package models

import (
	"log"
	"net/http"
  "backend/initializers"

	"github.com/gin-gonic/gin"
)



// User level insert
type UserLevelInsert struct {
	UserEmail      string `json:"user_email"`
	LevelOfAccess  string `json:"level_of_access"`
}

func InsertUserLevel(c *gin.Context) {
	var user UserLevelInsert
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if user.UserEmail == "" || user.LevelOfAccess == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User email and access level are required"})
		return
	}

	query := "INSERT INTO user_level_table (user_email, level_of_access) VALUES (?, ?);"
	result, err := connect.Db.Exec(query, user.UserEmail, user.LevelOfAccess)
	if err != nil {
		log.Println("Error inserting user level:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user level"})
		return
	}

	userID, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"message": "User level inserted successfully",
		"user_id": userID,
		"user": user,
	})
}


