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
		adminGroup.POST("/branches", models.InsertBranch)
		adminGroup.POST("/supplier", models.InsertSupplier)
	}

	// Staff-only routes
	staffGroup := router.Group("/")
	staffGroup.Use(middleware.AuthMiddleware("staff", "admin"))
	{
		staffGroup.POST("/products", models.InsertProduct)
		staffGroup.POST("/entry", models.InsertEntry)
		staffGroup.POST("/order", models.InsertOrder)
	}

	// Customers can create orders
	customerGroup := router.Group("/")
	customerGroup.Use(middleware.AuthMiddleware("customer", "staff", "admin"))
	{
	}

	// Auditors have no write access
}
