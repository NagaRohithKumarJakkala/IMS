package models

import (
	connect "backend/initializers"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SaleHistory struct {
	OrderID   int    `json:"order_id"`
	Timestamp string `json:"timestamp"`
	UserID    int    `json:"user_id"`
	BranchID  string `json:"branch_id"`
}

func GetSaleHistory(c *gin.Context) {
	rows, err := connect.Db.Query("SELECT order_id, timestamp, user_id, branch_id FROM Sales_Table ORDER BY timestamp DESC LIMIT 50")
	if err != nil {
		log.Println("Error fetching sale history:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve sale history"})
		return
	}
	defer rows.Close()

	var history []SaleHistory
	for rows.Next() {
		var record SaleHistory
		if err := rows.Scan(&record.OrderID, &record.Timestamp, &record.UserID, &record.BranchID); err != nil {
			log.Println("Error reading sale history record:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read sale history data"})
			return
		}
		history = append(history, record)
	}

	if len(history) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No recent sales found"})
		return
	}

	c.JSON(http.StatusOK, history)
}
