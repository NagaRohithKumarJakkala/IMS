package models

import (
	connect "backend/initializers"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BranchSaleHistory struct {
	OrderID   int     `json:"order_id"`
	Timestamp string  `json:"timestamp"`
	UserID    int     `json:"user_id"`
	BranchID  string  `json:"branch_id"`
	TotalCost float64 `json:"total_cost"`
}

func GetBranchSaleHistory(c *gin.Context) {
	branchID := c.Query("branch_id")
	if branchID == "" {
		log.Println("Branch ID is required")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Branch ID is required"})
		return
	}

	rows, err := connect.Db.Query(`
		SELECT order_id, order_time, user_id, branch_id,get_order_total_money(order_id) as total_cost
 		FROM Order_Table
 		WHERE branch_id = ?
 		ORDER BY order_time DESC
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

		var totalCost sql.NullFloat64

		if err := rows.Scan(&record.OrderID, &orderTime, &userID, &branchID, &totalCost); err != nil {
			log.Println("Error reading branch sale history record:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read branch sale history data"})
			return
		}

		// Convert NULL values to empty strings or zero
		record.Timestamp = orderTime.String
		record.UserID = int(userID.Int64)
		record.BranchID = branchID.String
		record.TotalCost = totalCost.Float64

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

func GetOrderProducts(c *gin.Context) {
	orderID := c.Query("order_id")

	if orderID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order ID is required"})
		return
	}

	rows, err := connect.Db.Query(`
		SELECT oi.product_id, p.product_name, oi.quantity_of_item, oi.selling_price
		FROM Order_Items oi
		JOIN Product_Table p ON oi.product_id = p.product_id
		WHERE oi.order_id = ?
	`, orderID)
	if err != nil {
		log.Println("Error fetching order products:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve order products"})
		return
	}
	defer rows.Close()

	var products []map[string]interface{}
	for rows.Next() {
		var productID, productName string
		var quantity int
		var sellingPrice float64

		if err := rows.Scan(&productID, &productName, &quantity, &sellingPrice); err != nil {
			log.Println("Error scanning order products:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process order products"})
			return
		}

		products = append(products, map[string]interface{}{
			"product_id":    productID,
			"product_name":  productName,
			"quantity":      quantity,
			"selling_price": sellingPrice,
		})
	}

	if err := rows.Err(); err != nil {
		log.Println("Error iterating through products:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing order products"})
		return
	}

	if len(products) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No products found for this order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"order_id": orderID, "products": products})
}
