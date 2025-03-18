package models

import (
	"log"
	"net/http"

	"backend/initializers"
	"github.com/gin-gonic/gin"
)

type ProductInfo struct {
	ProductID    string  `json:"product_id"`
	ProductBrand string  `json:"product_brand"` // Added brand name
	ProductName  string  `json:"product_name"`
	Quantity     int     `json:"quantity_of_item"`
	CostOfItem   float64 `json:"cost_of_item"`
}

// Fetch available products with quantity and cost (excluding expired products)
func GetAvailableProducts(c *gin.Context) {
	query := `
SELECT 
			P.product_id,
			P.product_brand,    -- Added brand name in the SELECT clause
			P.product_name,
			D.quantity_of_item,
			C.cost_of_item
		FROM 
			Product_Table P
		JOIN 
			Duration_Table D ON P.product_id = D.product_id
		JOIN 
			Cost_Table C ON P.product_id = C.product_id
		WHERE 
			(
				(D.duration_unit = 'D' AND DATE_ADD(D.manufactured_date, INTERVAL D.duration_value DAY) > CURDATE()) OR
				(D.duration_unit = 'M' AND DATE_ADD(D.manufactured_date, INTERVAL D.duration_value MONTH) > CURDATE()) OR
				(D.duration_unit = 'Y' AND DATE_ADD(D.manufactured_date, INTERVAL D.duration_value YEAR) > CURDATE())
			);
	`
	rows, err := connect.Db.Query(query)
	if err != nil {
		log.Println("Error executing query:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}
	defer rows.Close()
	
	var products []ProductInfo
	for rows.Next() {
		var p ProductInfo
		if err := rows.Scan(&p.ProductID, &p.ProductBrand, &p.ProductName, &p.Quantity, &p.CostOfItem); err != nil {
			log.Println("Error scanning row:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading data"})
			return
		}
		products = append(products, p)
	}
	
	c.JSON(http.StatusOK, products)
}


type ProductInsert struct {
	ProductID    string  `json:"product_id"`
	ProductBrand string  `json:"product_brand"`
	ProductName  string  `json:"product_name"`
	Description  string  `json:"description"`
	Category     string  `json:"category"`
	CostOfItem   float64 `json:"cost_of_item"`
	MRP          float64 `json:"mrp"`
	SP           float64 `json:"SP"`
}

func InsertProduct(c *gin.Context) {
	var product ProductInsert

	// Bind JSON request body to struct
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	// Validate required fields
	if product.ProductID == "" || product.ProductName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID and Product Name are required"})
		return
	}

	// Check database connection
	if err := connect.Db.Ping(); err != nil {
		log.Println("Database connection lost:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection lost"})
		return
	}

	// Begin MySQL transaction
	tx, err := connect.Db.Begin()
	if err != nil {
		log.Println("Transaction start failed:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Insert into Product_Table
	_, err = tx.Exec(`
		INSERT INTO Product_Table (product_id, product_brand, product_name, description)
		VALUES (?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE 
		product_brand = VALUES(product_brand), 
		product_name = VALUES(product_name), 
		description = VALUES(description)`,
		product.ProductID, product.ProductBrand, product.ProductName, product.Description)
	if err != nil {
		tx.Rollback()
		log.Println("Error inserting product:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert product"})
		return
	}

	// Insert into Category_Table
	_, err = tx.Exec(`
		INSERT INTO Category_Table (product_id, category)
		VALUES (?, ?)
		ON DUPLICATE KEY UPDATE category = VALUES(category)`,
		product.ProductID, product.Category)
	if err != nil {
		tx.Rollback()
		log.Println("Error inserting category:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert category"})
		return
	}

	// Insert into Cost_Table (without branch_id)
	_, err = tx.Exec(`
		INSERT INTO Cost_Table (product_id, cost_of_item, mrp, SP)
		VALUES (?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE 
		cost_of_item = VALUES(cost_of_item), 
		mrp = VALUES(mrp), 
		SP = VALUES(SP)`,
		product.ProductID, product.CostOfItem, product.MRP, product.SP)
	if err != nil {
		tx.Rollback()
		log.Println("Error inserting into Cost_Table:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert cost details"})
		return
	}

	// Commit transaction
	err = tx.Commit()
	if err != nil {
		log.Println("Transaction commit failed:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed"})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{
		"message": "Product added successfully",
		"product": product,
	})
}

