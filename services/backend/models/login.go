package models

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	connect "backend/initializers"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Claims struct for JWT payload
type Claims struct {
	UserID        int    `json:"user_id"`
	LevelOfAccess string `json:"level_of_access"`
	jwt.RegisteredClaims
}

// Secret key for JWT (Ensure it's set in `.env`)
var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

// Login request structure
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Login response structure
type LoginResponse struct {
	Success bool `json:"success"`
	User    struct {
		ID            int    `json:"id"`
		Username      string `json:"username"`
		LevelOfAccess string `json:"level_of_access"`
	} `json:"user"`
	Token string `json:"token"` // ✅ Include token in response
}

// LoginHandler - Authenticates user and generates JWT
func LoginHandler(c *gin.Context) {
	var req LoginRequest

	// Bind JSON request body
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Println("Login Error: Invalid request data:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	var userID int
	var storedPasswordHash string
	var levelOfAccess string

	// Query user from database
	err := connect.Db.QueryRow("SELECT user_id, user_password, level_of_access FROM User_Table WHERE username = ?", req.Username).
		Scan(&userID, &storedPasswordHash, &levelOfAccess)

	if err == sql.ErrNoRows {
		log.Println("Login Error: User not found for username:", req.Username)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	} else if err != nil {
		log.Println("Database error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Debugging: Log password hashes
	log.Println("Stored Hash:", storedPasswordHash)
	log.Println("Entered Password:", req.Password)

	// Compare hashed password
	err = bcrypt.CompareHashAndPassword([]byte(storedPasswordHash), []byte(req.Password))
	if err != nil {
		log.Println("Login Error: Password mismatch")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	log.Println("Login Successful: User ID:", userID, "Role:", levelOfAccess)

	// Generate JWT token
	expirationTime := time.Now().Add(24 * time.Hour) // Token valid for 24 hours
	claims := &Claims{
		UserID:        userID,
		LevelOfAccess: levelOfAccess,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		log.Println("JWT Generation Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	// Debugging: Log generated token
	log.Println("Generated JWT:", tokenString)

	// Send response with JWT
	c.JSON(http.StatusOK, LoginResponse{
		Success: true,
		User: struct {
			ID            int    `json:"id"`
			Username      string `json:"username"`
			LevelOfAccess string `json:"level_of_access"`
		}{
			ID:            userID,
			Username:      req.Username,
			LevelOfAccess: levelOfAccess,
		},
		Token: tokenString, // ✅ Include token in response
	})
}
