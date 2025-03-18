package models

import (
	"log"
	"net/http"
  "backend/initializers"
	"github.com/gin-gonic/gin"
)


// Branch insert
type Branch struct {
	BranchID   string `json:"branch_id"`
	BranchName string `json:"branch_name"`
}

func InsertBranch(c *gin.Context) {
	var branch Branch
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

func GetBranches(c *gin.Context) {
	rows, err := connect.Db.Query("SELECT branch_id, branch_name FROM Branch_Table")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query database"})
		return
	}
	defer rows.Close()

  var branches []Branch

	for rows.Next() {
		var branch Branch
		if err := rows.Scan(&branch.BranchID, &branch.BranchName); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read data"})
			return
		}
		branches = append(branches, branch)
	}

	// Check if no branches were found
	if len(branches) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No branches found"})
		return
	}


	c.JSON(http.StatusOK, branches)
}

