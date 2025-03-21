package models

import (
	connect "backend/initializers"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type User struct {
	UserID        int    `json:"user_id"`
	LevelOfAccess string `json:"level_of_access"`
}

func InsertUser(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if user.LevelOfAccess == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Level of access is required"})
		return
	}

	query := "INSERT INTO User_Table (level_of_access) VALUES (?)"
	result, err := connect.Db.Exec(query, user.LevelOfAccess)
	if err != nil {
		log.Println("Error inserting user:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user"})
		return
	}

	userID, err := result.LastInsertId()
	if err != nil {
		log.Println("Error fetching last insert ID:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user ID"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User inserted successfully", "user_id": userID})
}
