package models

import (
	"log"
	"net/http"
  "backend/initializers"

	"github.com/gin-gonic/gin"
)


// Selling insert
type SellingInsert struct {
	ProductID      string  `json:"product_id"`
	QuantityOfItem int     `json:"quantity_of_item"`
	BranchID       string  `json:"branch_id"`
	SP             float64 `json:"SP"`
	// SellingTime is optional, will default to current timestamp
}

func InsertSelling(c *gin.Context) {
	var selling SellingInsert
	if err := c.ShouldBindJSON(&selling); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if selling.ProductID == "" || selling.BranchID == "" || selling.QuantityOfItem <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID, Branch ID, and quantity > 0 are required"})
		return
	}

	query := "INSERT INTO Selling_Table (product_id, quantity_of_item, branch_id, SP) VALUES (?, ?, ?, ?);"
	result, err := connect.Db.Exec(query, selling.ProductID, selling.QuantityOfItem, selling.BranchID, selling.SP)
	if err != nil {
		log.Println("Error inserting selling record:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert selling record"})
		return
	}

	orderID, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"message": "Selling record inserted successfully",
		"order_id": orderID,
		"selling": selling,
	})
}


