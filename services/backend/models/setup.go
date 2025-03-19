package models

import (
	"log"
	"net/http"

	"backend/initializers"
	"github.com/gin-gonic/gin"
)

func CreateTables(c *gin.Context) {
	for _, query := range CreateTablesQueries {
		_, err := connect.Db.Exec(query)
		if err != nil {
			log.Println("Error executing query:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tables"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "All tables created successfully"})
}

func CreateTriggers(c *gin.Context) {
	for _, query := range CreateTriggersQueries {
		_, err := connect.Db.Exec(query)
		if err != nil {
			log.Println("Error executing trigger:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create triggers"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "All triggers created successfully"})
}

