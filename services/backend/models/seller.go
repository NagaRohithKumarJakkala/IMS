package models

import (
	"log"
	"net/http"
  "backend/initializers"

	"github.com/gin-gonic/gin"
)

// Seller insert
type SellerInsert struct {
	SellerName string `json:"seller_name"`
}

func InsertSeller(c *gin.Context) {
	var seller SellerInsert
	if err := c.ShouldBindJSON(&seller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if seller.SellerName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Seller name is required"})
		return
	}

	query := "INSERT INTO Seller_Table (seller_name) VALUES (?);"
	result, err := connect.Db.Exec(query, seller.SellerName)
	if err != nil {
		log.Println("Error inserting seller:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert seller"})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"message": "Seller inserted successfully",
		"seller_id": id,
		"seller_name": seller.SellerName,
	})
}

