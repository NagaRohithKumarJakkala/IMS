package models

import (
	connect "backend/initializers"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
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

	if supplier.SupplierID == 0 || supplier.SupplierName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Supplier ID and Name are required"})
		return
	}

	query := "INSERT INTO Supplier_Table (supplier_id, supplier_name) VALUES (?, ?);"
	_, err := connect.Db.Exec(query, supplier.SupplierID, supplier.SupplierName)
	if err != nil {
		log.Println("Error inserting supplier:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert supplier"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Supplier inserted successfully",
		"supplier": supplier,
	})
}

func GetSuppliers(c *gin.Context) {
	rows, err := connect.Db.Query("SELECT supplier_id, supplier_name FROM Supplier_Table")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query database"})
		return
	}
	defer rows.Close()

	var suppliers []Supplier

	for rows.Next() {
		var supplier Supplier
		if err := rows.Scan(&supplier.SupplierID, &supplier.SupplierName); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read data"})
			return
		}
		suppliers = append(suppliers, supplier)
	}

	if len(suppliers) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No suppliers found"})
		return
	}

	c.JSON(http.StatusOK, suppliers)
}
