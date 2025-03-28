package controllers

import (
	"backend/middleware"
	"backend/models"

	"github.com/gin-gonic/gin"
)

func get(router *gin.Engine) {
	// Public endpoints (No authentication required)
	router.GET("/create-tables", models.CreateTables)
	router.GET("/create-triggers", models.CreateTriggers)
	router.GET("/get-branches", models.GetBranches)
	router.GET("/allproducts", models.GetAllProducts)
	router.GET("/product", models.GetProductDetails)
	router.GET("/products-by-name", models.GetProductsByName)
	router.GET("/product-in-branch", models.GetProductsByNameInBranch)
	router.GET("/product-all-in-branch", models.GetAllProductsInBranch)

	// Restricted routes with role-based access control
	adminGroup := router.Group("/")
	adminGroup.Use(middleware.AuthMiddleware("admin")) // Only admins can access
	{
	}

	staffGroup := router.Group("/")
	staffGroup.Use(middleware.AuthMiddleware("staff", "admin")) // Staff and admins can access
	{
		staffGroup.GET("/product/:product_id", models.GetProduct)
		staffGroup.GET("/get-suppliers", models.GetSuppliers)
	}

	customerGroup := router.Group("/")
	customerGroup.Use(middleware.AuthMiddleware("customer", "staff", "admin")) // Customers, Staff, Admins
	{
	}

	auditorGroup := router.Group("/")
	auditorGroup.Use(middleware.AuthMiddleware("auditor", "admin")) // Auditors & Admins
	{
		auditorGroup.GET("/history/orders", models.GetBranchSaleHistory)
		auditorGroup.GET("/history/entries", models.GetBranchEntryHistory)
	}
}
