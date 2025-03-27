package middleware

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Claims struct to extract JWT payload
type Claims struct {
	UserID        int    `json:"user_id"`
	LevelOfAccess string `json:"level_of_access"`
	jwt.RegisteredClaims
}

// AuthMiddleware validates JWT and checks access level
func AuthMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			log.Println("Auth Error: Missing Authorization header")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>"
		if !strings.HasPrefix(authHeader, "Bearer ") {
			log.Println("Auth Error: Invalid Authorization format")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization format"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse and validate the token
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil // Ensure JWT_SECRET is set in .env
		})

		if err != nil {
			log.Println("Auth Error: Invalid token ->", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		if !token.Valid {
			log.Println("Auth Error: Token is not valid")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Log extracted user information for debugging
		log.Printf("Authenticated User: ID=%d, Role=%s\n", claims.UserID, claims.LevelOfAccess)

		// Check if the user's role is allowed
		for _, role := range allowedRoles {
			if claims.LevelOfAccess == role {
				// Store user info in context for use in handlers
				c.Set("user_id", claims.UserID)
				c.Set("level_of_access", claims.LevelOfAccess)
				c.Next()
				return
			}
		}

		// If no match, deny access
		log.Printf("Auth Error: Access denied for user ID=%d with role=%s\n", claims.UserID, claims.LevelOfAccess)
		c.JSON(http.StatusForbidden, gin.H{"error": fmt.Sprintf("Access denied. Required roles: %v", allowedRoles)})
		c.Abort()
	}
}
