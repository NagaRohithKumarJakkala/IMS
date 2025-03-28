package models

import (
	connect "backend/initializers"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateFunctions(c *gin.Context) {
	for _, query := range CreateFunctionsQueries {
		_, err := connect.Db.Exec(query)
		if err != nil {
			log.Println("Error executing function:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create functions"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "All functions created successfully"})
}

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
