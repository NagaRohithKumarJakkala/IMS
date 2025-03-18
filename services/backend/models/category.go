package models

import (
	"log"
	"net/http"
  "backend/initializers"
	"github.com/gin-gonic/gin"
)



// Category insert
type CategoryInsert struct {
	ProductID string `json:"product_id"`
	Category  string `json:"category"`
}

func InsertCategory(c *gin.Context) {
	var category CategoryInsert
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if category.ProductID == "" || category.Category == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID and Category are required"})
		return
	}

	query := "INSERT INTO Category_Table (product_id, category) VALUES (?, ?);"
	_, err := connect.Db.Exec(query, category.ProductID, category.Category)
	if err != nil {
		log.Println("Error inserting category:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert category"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Category inserted successfully",
		"category": category,
	})
}


