package models

import (
	connect "backend/initializers"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Entry struct {
	SupplierID int         `json:"supplier_id"`
	BranchID   string      `json:"branch_id"`
	UserID     int         `json:"user_id"`
	Items      []EntryItem `json:"items"`
}

type EntryItem struct {
	ProductID  string  `json:"product_id"`
	Quantity   int     `json:"quantity_of_item"`
	CostOfItem float64 `json:"cost_of_item"`
}

func InsertEntry(c *gin.Context) {
	var entry Entry

	// Bind JSON properly
	if err := c.ShouldBindJSON(&entry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Validate required fields
	if entry.SupplierID == 0 || entry.UserID == 0 || entry.BranchID == "" || len(entry.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Start database transaction
	tx, err := connect.Db.Begin()
	if err != nil {
		log.Println("Error starting transaction:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction start failed"})
		return
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			log.Println("Panic occurred:", r)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
	}()

	// Insert into Entry_Table
	query := "INSERT INTO Entry_Table (supplier_id, branch_id, user_id, entry_time) VALUES (?, ?, ?, NOW())"
	result, err := tx.Exec(query, entry.SupplierID, entry.BranchID, entry.UserID)
	if err != nil {
		tx.Rollback()
		log.Println("Error inserting entry:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert entry"})
		return
	}

	entryID, err := result.LastInsertId()
	if err != nil {
		tx.Rollback()
		log.Println("Error fetching last insert ID:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve entry ID"})
		return
	}

	// Insert Entry Items
	queryItem := "INSERT INTO Entry_Items (entry_id, product_id, quantity_of_item, cost_of_item) VALUES (?, ?, ?, ?)"
	for _, item := range entry.Items {
		_, err := tx.Exec(queryItem, entryID, item.ProductID, item.Quantity, item.CostOfItem)
		if err != nil {
			tx.Rollback()
			log.Println("Error inserting entry item:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert entry item"})
			return
		}
	}

	// Update stock after successful entry
	updateStockQuery := `
		UPDATE Stock_Table 
		SET quantity_of_item = quantity_of_item + ? 
		WHERE product_id = ? AND branch_id = ?
	`
	insertStockQuery := `
		INSERT INTO Stock_Table (product_id, branch_id, quantity_of_item) 
		SELECT ?, ?, ? 
		WHERE NOT EXISTS (
			SELECT 1 FROM Stock_Table 
			WHERE product_id = ? AND branch_id = ?
		)
	`
	for _, item := range entry.Items {
		// First, try to update existing stock
		res, err := tx.Exec(updateStockQuery, item.Quantity, item.ProductID, entry.BranchID)
		if err != nil {
			tx.Rollback()
			log.Println("Error updating stock:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update stock"})
			return
		}

		// Check if any row was affected; if not, insert new stock
		rowsAffected, _ := res.RowsAffected()
		if rowsAffected == 0 {
			_, err = tx.Exec(insertStockQuery, item.ProductID, entry.BranchID, item.Quantity, item.ProductID, entry.BranchID)
			if err != nil {
				tx.Rollback()
				log.Println("Error inserting stock:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert stock"})
				return
			}
		}

		// Log stock change
		logStockQuery := `
			INSERT INTO Stock_Log 
			(product_id, branch_id, quantity_change, change_type) 
			VALUES (?, ?, ?, 'INCREASE')
		`
		_, err = tx.Exec(logStockQuery, item.ProductID, entry.BranchID, item.Quantity)
		if err != nil {
			tx.Rollback()
			log.Println("Error logging stock change:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to log stock change"})
			return
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Println("Error committing transaction:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Entry inserted successfully",
		"entry_id": entryID,
	})
}
