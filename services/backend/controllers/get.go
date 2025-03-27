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

	// Restricted routes with role-based access control
	adminGroup := router.Group("/")
	adminGroup.Use(middleware.AuthMiddleware("admin")) // Only admins can access
	{
		adminGroup.GET("/get-branches", models.GetBranches)
	}

	staffGroup := router.Group("/")
	staffGroup.Use(middleware.AuthMiddleware("staff", "admin")) // Staff and admins can access
	{
		staffGroup.GET("/product/:product_id", models.GetProduct)
		staffGroup.GET("/products-by-name", models.GetProductsByName)
		staffGroup.GET("/get-suppliers", models.GetSuppliers)
	}

	customerGroup := router.Group("/")
	customerGroup.Use(middleware.AuthMiddleware("customer", "staff", "admin")) // Customers, Staff, Admins
	{
		customerGroup.GET("/allproducts", models.GetAllProducts)
		customerGroup.GET("/product", models.GetProductDetails)

		customerGroup.GET("/product-in-branch", models.GetProductsByNameInBranch)
		customerGroup.GET("/product-all-in-branch", models.GetAllProductsInBranch)
	}

	auditorGroup := router.Group("/")
	auditorGroup.Use(middleware.AuthMiddleware("auditor", "admin")) // Auditors & Admins
	{
		auditorGroup.GET("/history/orders", models.GetBranchSaleHistory)
		auditorGroup.GET("/history/entries", models.GetBranchEntryHistory)
	}
}
