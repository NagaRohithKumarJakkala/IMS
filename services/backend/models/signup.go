package models

import (
	"log"
	"net/http"

	connect "backend/initializers"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type SignupRequest struct {
	Username      string `json:"username"`
	Password      string `json:"password"` // Receives raw password from frontend
	LevelOfAccess string `json:"level_of_access"`
}

func SignupHandler(c *gin.Context) {
	var req SignupRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if req.Username == "" || req.Password == "" || req.LevelOfAccess == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
		return
	}

	// Hash raw password before storing
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Error hashing password:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing request"})
		return
	}

	// Insert user into database with hashed password
	query := "INSERT INTO User_Table (username, user_password, level_of_access) VALUES (?, ?, ?)"
	_, err = connect.Db.Exec(query, req.Username, string(hashedPassword), req.LevelOfAccess)
	if err != nil {
		log.Println("Database error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}
