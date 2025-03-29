package models

import (
	connect "backend/initializers"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BranchEntryHistory struct {
	EntryID    int    `json:"entry_id"`
	Timestamp  string `json:"timestamp"`
	UserID     int    `json:"user_id"`
	BranchID   string `json:"branch_id"`
	SupplierID int    `json:"supplier_id"`
}

func GetBranchEntryHistory(c *gin.Context) {
	branchID := c.Query("branch_id")
	if branchID == "" {
		log.Println("Branch ID is required")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Branch ID is required"})
		return
	}

	rows, err := connect.Db.Query(`
		SELECT entry_id, entry_time, user_id, branch_id, supplier_id
		FROM Entry_Table 
		WHERE branch_id = ? 
		ORDER BY entry_time DESC
	`, branchID)
	if err != nil {
		log.Println("Error fetching branch entry history:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve branch entry history"})
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

		if err := rows.Scan(&record.EntryID, &entryTime, &userID, &branchID, &supplierID); err != nil {
			log.Println("Error reading branch entry history record:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read branch entry history data"})
			return
		}

		// Convert NULL values to empty strings or zero
		record.Timestamp = entryTime.String
		record.UserID = int(userID.Int64)
		record.BranchID = branchID.String
		record.SupplierID = int(supplierID.Int64)

		history = append(history, record)
	}

	// Handle any iteration errors
	if err := rows.Err(); err != nil {
		log.Println("Error iterating through rows:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing entry history data"})
		return
	}

	if len(history) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No recent entries found for this branch"})
		return
	}

	log.Println("Successfully fetched entry history for branch:", branchID)
	c.JSON(http.StatusOK, history)
}
func GetEntryProducts(c *gin.Context) {
	entryID := c.Query("entry_id")

	if entryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Entry ID is required"})
		return
	}

	rows, err := connect.Db.Query(`
		SELECT ei.product_id, p.product_name, ei.quantity_of_item, ei.cost_of_item
		FROM Entry_Items ei
		JOIN Product_Table p ON ei.product_id = p.product_id
		WHERE ei.entry_id = ?
	`, entryID)
	if err != nil {
		log.Println("Error fetching entry products:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve entry products"})
		return
	}
	defer rows.Close()

	var products []map[string]interface{}
	for rows.Next() {
		var productID, productName string
		var quantity int
		var costOfItem float64

		if err := rows.Scan(&productID, &productName, &quantity, &costOfItem); err != nil {
			log.Println("Error scanning entry products:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process entry products"})
			return
		}

		products = append(products, map[string]interface{}{
			"product_id":   productID,
			"product_name": productName,
			"quantity":     quantity,
			"cost_of_item": costOfItem,
		})
	}

	if err := rows.Err(); err != nil {
		log.Println("Error iterating through products:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing entry products"})
		return
	}

	if len(products) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No products found for this entry"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"entry_id": entryID, "products": products})
}
