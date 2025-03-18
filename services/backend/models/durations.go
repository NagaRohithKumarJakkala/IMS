package models

import (
	"log"
	"net/http"
  "backend/initializers"

	"github.com/gin-gonic/gin"
)



// Duration insert
type DurationInsert struct {
	ProductID        string `json:"product_id"`
	SellerID         int    `json:"seller_id"`
	ManufacturedDate string `json:"manufactured_date"` // Format: YYYY-MM-DD
	DurationValue    int    `json:"duration_value"`
	DurationUnit     string `json:"duration_unit"` // 'D', 'M', or 'Y'
	QuantityOfItem   int    `json:"quantity_of_item"`
}

func InsertDuration(c *gin.Context) {
	var duration DurationInsert
	if err := c.ShouldBindJSON(&duration); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if duration.ProductID == "" || duration.ManufacturedDate == "" || 
		duration.DurationValue <= 0 || duration.QuantityOfItem < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid duration data"})
		return
	}

	// Validate duration unit
	if duration.DurationUnit != "D" && duration.DurationUnit != "M" && duration.DurationUnit != "Y" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Duration unit must be 'D', 'M', or 'Y'"})
		return
	}

	query := `INSERT INTO Duration_Table 
		(product_id, seller_id, manufactured_date, duration_value, duration_unit, quantity_of_item) 
		VALUES (?, ?, ?, ?, ?, ?);`
	
	_, err := connect.Db.Exec(query, 
		duration.ProductID, 
		duration.SellerID, 
		duration.ManufacturedDate, 
		duration.DurationValue, 
		duration.DurationUnit, 
		duration.QuantityOfItem)
	
	if err != nil {
		log.Println("Error inserting duration:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert duration"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Duration inserted successfully",
		"duration": duration,
	})
}

