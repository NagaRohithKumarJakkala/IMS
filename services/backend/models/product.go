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
    ProductID    string `json:"product_id"`
    ProductBrand string `json:"product_brand"`
    ProductName  string `json:"product_name"`
    Description  string `json:"description"`
}

// InsertProduct inserts a new product into the Product_Table
func InsertProduct(c *gin.Context) {
    var product ProductInsert
    
    // Bind JSON request body to the ProductInsert struct
    if err := c.ShouldBindJSON(&product); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
        return
    }
    
    // Validate the required fields
    if product.ProductID == "" || product.ProductName == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID and Name are required"})
        return
    }
    
    // SQL query to insert the product
    query := `
        INSERT INTO Product_Table (product_id, product_brand, product_name, description)
        VALUES (?, ?, ?, ?);
    `
    
    // Execute the query
    _, err := connect.Db.Exec(query, product.ProductID, product.ProductBrand, product.ProductName, product.Description)
    if err != nil {
        log.Println("Error inserting product:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert product"})
        return
    }
    
    c.JSON(http.StatusCreated, gin.H{
        "message": "Product inserted successfully",
        "product": product,
    })
}
