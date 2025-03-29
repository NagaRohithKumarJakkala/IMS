package models

import (
	connect "backend/initializers"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetSupplierEntries(c *gin.Context) {
	supplierID := c.Query("supplier_id")
	if supplierID == "" {
		log.Println("Supplier ID is required")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Supplier ID is required"})
		return
	}

	rows, err := connect.Db.Query(`
		SELECT entry_id, entry_time, user_id, branch_id, supplier_id,get_entry_total_cost(entry_id) as total_cost
		FROM Entry_Table
		WHERE supplier_id = ?
		ORDER BY entry_time DESC
	`, supplierID)
	if err != nil {
		log.Println("Error fetching supplier entry history:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve supplier entry history"})
		return
	}
	defer rows.Close()

	var history []BranchEntryHistory
	for rows.Next() {
		var record BranchEntryHistory
		var entryTime sql.NullString
		var userID sql.NullInt64
		var branchID sql.NullString
		var supplierID sql.NullInt64
		var totalCost sql.NullFloat64

		if err := rows.Scan(&record.EntryID, &entryTime, &userID, &branchID, &supplierID, &totalCost); err != nil {
			log.Println("Error reading supplier entry history record:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read supplier entry history data"})
			return
		}

		// Convert NULL values to empty strings or zero
		record.Timestamp = entryTime.String
		record.UserID = int(userID.Int64)
		record.BranchID = branchID.String
		record.SupplierID = int(supplierID.Int64)
		record.TotalCost = totalCost.Float64

		history = append(history, record)
	}

	// Handle any iteration errors
	if err := rows.Err(); err != nil {
		log.Println("Error iterating through supplier entry history rows:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing supplier entry history data"})
		return
	}

	if len(history) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No recent entries found for this supplier"})
		return
	}

	log.Println("Successfully fetched entry history for supplier:", supplierID)
	c.JSON(http.StatusOK, history)
}
