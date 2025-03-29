package models

import (
	connect "backend/initializers"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Function to get the current month's profit
func GetCurrentMonthProfit(c *gin.Context) {

	branchID := c.Query("branch_id")

	if branchID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "branch ID is required"})
		return
	}

	var profit float64

	// Query to call the SQL function
	query := `SELECT get_branch_current_month_profit(?);`
	err := connect.Db.QueryRow(query, branchID).Scan(&profit)
	if err != nil {
		log.Println("Error fetching current month profit:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch profit"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"current_month_profit": profit,
	})
}
