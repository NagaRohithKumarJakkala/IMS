package models

import (
	// "log"
	// "net/http"
	// "time"
	// "backend/initializers"

	"github.com/gin-gonic/gin"
)

// User log insert
type UserLogInsert struct {
	UserID     int64  `json:"user_id"`
	LoginTime  string `json:"login_time,omitempty"`  // Optional, format: YYYY-MM-DDTHH:MM:SS
	LogoutTime string `json:"logout_time,omitempty"` // Optional, format: YYYY-MM-DDTHH:MM:SS
}

func InsertUserLog(c *gin.Context) {
	// var log UserLogInsert
	// if err := c.ShouldBindJSON(&log); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
	// 	return
	// }
	//
	// if log.UserID <= 0 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Valid user ID is required"})
	// 	return
	// }
	//
	// // If login time is not provided, use current time
	// loginTime := time.Now().Format("2006-01-02 15:04:05")
	// if log.LoginTime != "" {
	// 	loginTime = log.LoginTime
	// }
	//
	// var query string
	// var args []interface{}
	//
	// if log.LogoutTime != "" {
	// 	// If logout time is provided, insert both login and logout
	// 	query = "INSERT INTO user_log (user_id, login_time, logout_time) VALUES (?, ?, ?);"
	// 	args = []interface{}{log.UserID, loginTime, log.LogoutTime}
	// } else {
	// 	// If logout time is not provided, insert only login
	// 	query = "INSERT INTO user_log (user_id, login_time) VALUES (?, ?);"
	// 	args = []interface{}{log.UserID, loginTime}
	// }
	//
	// result, err := connect.Db.Exec(query, args...)
	// if err != nil {
	// 	log.Println("Error inserting user log:", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user log"})
	// 	return
	// }
	//
	// logID, _ := result.LastInsertId()
	// c.JSON(http.StatusCreated, gin.H{
	// 	"message": "User log inserted successfully",
	// 	"log_id": logID,
	// 	"user_id": log.UserID,
	// 	"login_time": loginTime,
	// 	"logout_time": log.LogoutTime,
	// })
}
