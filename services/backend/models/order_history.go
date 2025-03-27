package models

import (
	connect "backend/initializers"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BranchSaleHistory struct {
	OrderID   int    `json:"order_id"`
	Timestamp string `json:"timestamp"`
	UserID    int    `json:"user_id"`
	BranchID  string `json:"branch_id"`
}

func GetBranchSaleHistory(c *gin.Context) {
	branchID := c.Query("branch_id")
	if branchID == "" {
		log.Println("Branch ID is required")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Branch ID is required"})
		return
	}

	rows, err := connect.Db.Query(`
		SELECT order_id, order_time, user_id, branch_id 
		FROM Order_Table 
		WHERE branch_id = ? 
		ORDER BY order_time DESC 
		LIMIT 50
	`, branchID)
	if err != nil {
		log.Println("Error fetching branch sale history:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve branch sale history"})
		return
	}
	defer rows.Close()

	var history []BranchSaleHistory
	for rows.Next() {
		var record BranchSaleHistory
		var orderTime sql.NullString
		var userID sql.NullInt64
		var branchID sql.NullString

		if err := rows.Scan(&record.OrderID, &orderTime, &userID, &branchID); err != nil {
			log.Println("Error reading branch sale history record:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read branch sale history data"})
			return
		}

		// Convert NULL values to empty strings or zero
		record.Timestamp = orderTime.String
		record.UserID = int(userID.Int64)
		record.BranchID = branchID.String

		history = append(history, record)
	}

	// Handle any iteration errors
	if err := rows.Err(); err != nil {
		log.Println("Error iterating through rows:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing sales history data"})
		return
	}

	if len(history) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No recent sales found for this branch"})
		return
	}

	log.Println("Successfully fetched sales history for branch:", branchID)
	c.JSON(http.StatusOK, history)
}
