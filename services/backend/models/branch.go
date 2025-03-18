package models

import (
	"log"
	"net/http"
  "backend/initializers"
	"github.com/gin-gonic/gin"
)


// Branch insert
type BranchInsert struct {
	BranchID   string `json:"branch_id"`
	BranchName string `json:"branch_name"`
}

func InsertBranch(c *gin.Context) {
	var branch BranchInsert
	if err := c.ShouldBindJSON(&branch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if branch.BranchID == "" || branch.BranchName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Branch ID and Name are required"})
		return
	}

	query := "INSERT INTO Branch_Table (branch_id, branch_name) VALUES (?, ?);"
	_, err := connect.Db.Exec(query, branch.BranchID, branch.BranchName)
	if err != nil {
		log.Println("Error inserting branch:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert branch"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Branch inserted successfully",
		"branch": branch,
	})
}

