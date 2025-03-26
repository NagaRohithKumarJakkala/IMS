package models

import (
	connect "backend/initializers"
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
	branchID := c.Param("branch_id")

	rows, err := connect.Db.Query("SELECT order_id, timestamp, user_id, branch_id FROM Sales_Table WHERE branch_id = ? ORDER BY timestamp DESC LIMIT 50", branchID)
	if err != nil {
		log.Println("Error fetching branch sale history:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve branch sale history"})
		return
	}
	defer rows.Close()

	var history []BranchSaleHistory
	for rows.Next() {
		var record BranchSaleHistory
		if err := rows.Scan(&record.OrderID, &record.Timestamp, &record.UserID, &record.BranchID); err != nil {
			log.Println("Error reading branch sale history record:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read branch sale history data"})
			return
		}
		history = append(history, record)
	}

	if len(history) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No recent sales found for this branch"})
		return
	}

	c.JSON(http.StatusOK, history)
}
