package models

import (
	"log"
	"net/http"

	connect "backend/initializers"

	"github.com/gin-gonic/gin"
)

// Product struct
type Product struct {
	ProductID    string  `json:"product_id"`
	ProductBrand string  `json:"product_brand"`
	ProductName  string  `json:"product_name"`
	Description  string  `json:"description"`
	Category     string  `json:"category"`
	MRP          float64 `json:"mrp"`
	SellingPrice float64 `json:"selling_price"`
}

// InsertProduct handles inserting a new product via a POST request
func InsertProduct(c *gin.Context) {
	var product Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if product.ProductID == "" || product.ProductName == "" || product.MRP <= 0 || product.SellingPrice <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID, Name, MRP, and Selling Price are required and must be valid"})
		return
	}

	query := "INSERT INTO Product_Table (product_id, product_brand, product_name, description, category, mrp, selling_price) VALUES (?, ?, ?, ?, ?, ?, ?);"
	_, err := connect.Db.Exec(query, product.ProductID, product.ProductBrand, product.ProductName, product.Description, product.Category, product.MRP, product.SellingPrice)
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

func GetProduct(c *gin.Context) {
	productID := c.Param("product_id")

	if productID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID is required"})
		return
	}

	var product Product
	query := "SELECT product_id, product_brand, product_name, description, category, mrp, selling_price FROM Product_Table WHERE product_id = ?"
	err := connect.Db.QueryRow(query, productID).Scan(
		&product.ProductID, &product.ProductBrand, &product.ProductName,
		&product.Description, &product.Category, &product.MRP, &product.SellingPrice,
	)

	if err != nil {
		log.Println("Error fetching product:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"product": product})
}

func GetAllProducts(c *gin.Context) {
	var products []Product

	query := "SELECT product_id, product_brand, product_name, description, category, mrp, selling_price FROM Product_Table"
	rows, err := connect.Db.Query(query)
	if err != nil {
		log.Println("Error fetching products:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve products"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var product Product
		if err := rows.Scan(
			&product.ProductID, &product.ProductBrand, &product.ProductName,
			&product.Description, &product.Category, &product.MRP, &product.SellingPrice,
		); err != nil {
			log.Println("Error scanning product:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process products"})
			return
		}
		products = append(products, product)
	}

	if err := rows.Err(); err != nil {
		log.Println("Error iterating through products:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"products": products})
}

func GetProductsByName(c *gin.Context) {
	queryParam := c.Query("query") // Get search term from query string

	if queryParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
		return
	}

	var products []Product
	query := "SELECT product_id, product_brand, product_name, description, category, mrp, selling_price FROM Product_Table WHERE product_name LIKE ?"
	rows, err := connect.Db.Query(query, "%"+queryParam+"%") // Use LIKE for partial matching

	if err != nil {
		log.Println("Error fetching products:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var product Product
		if err := rows.Scan(
			&product.ProductID, &product.ProductBrand, &product.ProductName,
			&product.Description, &product.Category, &product.MRP, &product.SellingPrice,
		); err != nil {
			log.Println("Error scanning product:", err)
			continue
		}
		products = append(products, product)
	}

	if len(products) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No products found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"products": products})
}
func UpdateProduct(c *gin.Context) {
	productID := c.Param("product_id")

	if productID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID is required"})
		return
	}

	var product Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	query := "UPDATE Product_Table SET product_brand=?, product_name=?, description=?, category=?, mrp=?, selling_price=? WHERE product_id=?"
	_, err := connect.Db.Exec(query, product.ProductBrand, product.ProductName, product.Description, product.Category, product.MRP, product.SellingPrice, productID)

	if err != nil {
		log.Println("Error updating product:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product updated successfully"})
}
func GetProductsByCategory(c *gin.Context) {
	category := c.Query("category") // Get category from query string

	if category == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category is required"})
		return
	}

	var products []Product
	query := "SELECT product_id, product_brand, product_name, description, category, mrp, selling_price FROM Product_Table WHERE category = ?"
	rows, err := connect.Db.Query(query, category)

	if err != nil {
		log.Println("Error fetching products by category:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var product Product
		if err := rows.Scan(
			&product.ProductID, &product.ProductBrand, &product.ProductName,
			&product.Description, &product.Category, &product.MRP, &product.SellingPrice,
		); err != nil {
			log.Println("Error scanning product:", err)
			continue
		}
		products = append(products, product)
	}

	if len(products) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No products found in this category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"products": products})
}

func GetProductsByCategoryAndName(c *gin.Context) {
	category := c.Query("category")
	queryParam := c.Query("query")              // Get search term from query string
	log.Println("Received category:", category) // Debugging log

	if category == "" && queryParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category and search query are required"})
		return
	}

	var products []Product
	query := "SELECT product_id, product_brand, product_name, description, category, mrp, selling_price FROM Product_Table WHERE category LIKE ? AND product_name LIKE ?"
	rows, err := connect.Db.Query(query, "%"+category+"%", "%"+queryParam+"%") // Use LIKE for partial matching

	if err != nil {
		log.Println("Error fetching products:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var product Product
		if err := rows.Scan(
			&product.ProductID, &product.ProductBrand, &product.ProductName,
			&product.Description, &product.Category, &product.MRP, &product.SellingPrice,
		); err != nil {
			log.Println("Error scanning product:", err)
			continue
		}
		products = append(products, product)
	}

	if len(products) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No products found for the given category and search query"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"products": products})
}
