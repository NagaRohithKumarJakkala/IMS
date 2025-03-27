package models

import (
	connect "backend/initializers"
	"log"
	"net/http"

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
