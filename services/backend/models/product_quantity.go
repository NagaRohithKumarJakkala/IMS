package models

import (
	connect "backend/initializers"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProductDetails struct {
	ProductID    string  `json:"product_id"`
	ProductName  string  `json:"product_name"`
	ProductBrand string  `json:"product_brand"`
	Category     string  `json:"category"`
	Description  string  `json:"description"`
	MRP          float64 `json:"mrp"`
	SellingPrice float64 `json:"selling_price"`
	Quantity     int     `json:"quantity"`
}

func GetProductDetails(c *gin.Context) {
	branchID := c.Query("branch_id")
	productID := c.Query("product_id")

	if branchID == "" || productID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Branch ID and Product ID are required"})
		return
	}

	var productDetails ProductDetails
	query := `
		SELECT p.product_id, p.product_name,p.product_brand, p.category,p.description, p.mrp, p.selling_price AS selling_price, s.quantity_of_item 
		FROM Product_Table p 
		JOIN Stock_Table s ON p.product_id = s.product_id 
		WHERE s.branch_id = ? AND p.product_id = ?`

	err := connect.Db.QueryRow(query, branchID, productID).Scan(
		&productDetails.ProductID, &productDetails.ProductName, &productDetails.ProductBrand,
		&productDetails.Category, &productDetails.Description, &productDetails.MRP,
		&productDetails.SellingPrice, &productDetails.Quantity,
	)

	if err != nil {
		log.Println("Error fetching product details:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found or not available in the branch"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"product_details": productDetails})
}

func GetAllProductsInBranch(c *gin.Context) {
	branchID := c.Query("branch_id")

	if branchID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Branch ID is required"})
		return
	}

	var products []ProductDetails
	query := `
		SELECT p.product_id, p.product_name, p.product_brand, p.category, p.description ,p.mrp, p.selling_price AS selling_price, s.quantity_of_item 
		FROM Product_Table p 
		JOIN Stock_Table s ON p.product_id = s.product_id 
		WHERE s.branch_id = ?`

	rows, err := connect.Db.Query(query, branchID)
	if err != nil {
		log.Println("Error fetching products:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve products"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var product ProductDetails
		if err := rows.Scan(
			&product.ProductID, &product.ProductName, &product.ProductBrand,
			&product.Category, &product.Description,
			&product.MRP, &product.SellingPrice, &product.Quantity,
		); err != nil {
			log.Println("Error scanning product:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process products"})
			return
		}
		products = append(products, product)
	}

	if len(products) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No products found in this branch"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"products": products})
}
func GetProductsByNameInBranch(c *gin.Context) {
	branchID := c.Query("branch_id")
	queryParam := c.Query("query")

	if branchID == "" || queryParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Branch ID and search query are required"})
		return
	}

	var products []ProductDetails
	query := `
		SELECT p.product_id, p.product_name, p.product_brand, p.category,p.description, p.mrp, p.selling_price AS selling_price, s.quantity_of_item 
		FROM Product_Table p 
		JOIN Stock_Table s ON p.product_id = s.product_id 
		WHERE s.branch_id = ? AND p.product_name LIKE ?`

	rows, err := connect.Db.Query(query, branchID, "%"+queryParam+"%")
	if err != nil {
		log.Println("Error fetching products by name:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var product ProductDetails
		if err := rows.Scan(
			&product.ProductID, &product.ProductName, &product.ProductBrand, &product.Category,
			&product.Description, &product.MRP, &product.SellingPrice, &product.Quantity,
		); err != nil {
			log.Println("Error scanning product:", err)
			continue
		}
		products = append(products, product)
	}

	if len(products) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No matching products found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"products": products})
}
