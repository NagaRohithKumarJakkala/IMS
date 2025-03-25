package models

import (
	connect "backend/initializers"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Order struct {
	BranchID string      `json:"branch_id"`
	UserID   int         `json:"user_id"`
	Items    []OrderItem `json:"items"`
}

type OrderItem struct {
	ProductID    string  `json:"product_id"`
	Quantity     int     `json:"quantity_of_item"`
	SellingPrice float64 `json:"selling_price"`
}

func InsertOrder(c *gin.Context) {
	var order Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	tx, err := connect.Db.Begin()
	if err != nil {
		log.Println("Error starting transaction:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction start failed"})
		return
	}

	var orderID int64
	query := "INSERT INTO Order_Table (branch_id, user_id) VALUES (?, ?)"
	result, err := tx.Exec(query, order.BranchID, order.UserID)
	if err != nil {
		tx.Rollback()
		log.Println("Error inserting order:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert order"})
		return
	}

	orderID, err = result.LastInsertId()
	if err != nil {
		tx.Rollback()
		log.Println("Error fetching last insert ID:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve order ID"})
		return
	}

	queryItem := "INSERT INTO Order_Items (order_id, product_id, quantity_of_item, SP) VALUES (?, ?, ?, ?)"
	for _, item := range order.Items {
		_, err := tx.Exec(queryItem, orderID, item.ProductID, item.Quantity, item.SellingPrice)
		if err != nil {
			tx.Rollback()
			log.Println("Error inserting order item:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert order item"})
			return
		}
	}

	tx.Commit()
	c.JSON(http.StatusCreated, gin.H{"message": "Order inserted successfully", "order_id": orderID})
}
