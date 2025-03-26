package models

import (
	"database/sql"
	"log"
	"net/http"

	connect "backend/initializers"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Success       bool   `json:"success"`
	UserID        int    `json:"user_id"`
	LevelOfAccess string `json:"level_of_access"`
}

func LoginHandler(c *gin.Context) {
	var req LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	var userID int
	var storedPasswordHash string
	var levelOfAccess string
	err := connect.Db.QueryRow("SELECT user_id, user_password, level_of_access FROM User_Table WHERE username = ?", req.Username).
		Scan(&userID, &storedPasswordHash, &levelOfAccess)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	} else if err != nil {
		log.Println("Database error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Compare hashed password
	if bcrypt.CompareHashAndPassword([]byte(storedPasswordHash), []byte(req.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	c.JSON(http.StatusOK, LoginResponse{
		Success:       true,
		UserID:        userID,
		LevelOfAccess: levelOfAccess,
	})
}
