package models

import (
	"backend/initializers"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type Supplier struct {
	SupplierID   int    `json:"supplier_id"`
	SupplierName string `json:"supplier_name"`
}

func InsertSupplier(c *gin.Context) {
	var supplier Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if supplier.SupplierName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Supplier name is required"})
		return
	}

	query := "INSERT INTO Supplier_Table (supplier_id, supplier_name) VALUES (?, ?)"
	_, err := connect.Db.Exec(query, supplier.SupplierID, supplier.SupplierName)
	if err != nil {
		log.Println("Error inserting supplier:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert supplier"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Supplier inserted successfully", "supplier": supplier})
}
