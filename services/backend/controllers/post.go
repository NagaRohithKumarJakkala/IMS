package controllers

import (
	"backend/middleware"
	"backend/models"

	"github.com/gin-gonic/gin"
)

func post(router *gin.Engine) {
	// Public routes (No authentication required)
	router.POST("/signup", models.SignupHandler)
	router.POST("/login", models.LoginHandler)

	// Admin-only routes
	adminGroup := router.Group("/")
	adminGroup.Use(middleware.AuthMiddleware("admin"))
	{
		adminGroup.POST("/products", models.InsertProduct)
		adminGroup.POST("/branches", models.InsertBranch)
		adminGroup.POST("/supplier", models.InsertSupplier)
	}

	// Staff-only routes
	staffGroup := router.Group("/")
	staffGroup.Use(middleware.AuthMiddleware("staff", "admin"))
	{
		staffGroup.POST("/entry", models.InsertEntry)
	}

	// Customers can create orders
	customerGroup := router.Group("/")
	customerGroup.Use(middleware.AuthMiddleware("customer", "staff", "admin"))
	{
		customerGroup.POST("/order", models.InsertOrder)
	}

	// Auditors have no write access
}
