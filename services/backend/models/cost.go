package models

import (
	"log"
	"net/http"
  "backend/initializers"
	"github.com/gin-gonic/gin"
)


// Cost insert
type CostInsert struct {
	BranchID   string  `json:"branch_id"`
	ProductID  string  `json:"product_id"`
	CostOfItem float64 `json:"cost_of_item"`
	MRP        float64 `json:"mrp"`
	SP         float64 `json:"SP"`
}

func InsertCost(c *gin.Context) {
	var cost CostInsert
	if err := c.ShouldBindJSON(&cost); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if cost.BranchID == "" || cost.ProductID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Branch ID and Product ID are required"})
		return
	}

	query := "INSERT INTO Cost_Table (branch_id, product_id, cost_of_item, mrp, SP) VALUES (?, ?, ?, ?, ?);"
	_, err := connect.Db.Exec(query, cost.BranchID, cost.ProductID, cost.CostOfItem, cost.MRP, cost.SP)
	if err != nil {
		log.Println("Error inserting cost:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert cost"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Cost inserted successfully",
		"cost": cost,
	})
}


