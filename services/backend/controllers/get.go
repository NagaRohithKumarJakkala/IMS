package controllers

import (
	"backend/middleware"
	"backend/models"

	"github.com/gin-gonic/gin"
)

func get(router *gin.Engine) {
	// Public endpoints (No authentication required)
	router.GET("/branches", models.GetBranches)
	router.GET("/product/:product_id", models.GetProduct)
	router.GET("/product-in-branch", models.GetProductDetails)
	router.GET("/products", models.GetAllProducts)
	router.GET("/products-in-branch", models.GetAllProductsInBranch)
	router.GET("/products-by-name", models.GetProductsByName)
	router.GET("/products-by-name-in-branch", models.GetProductsByNameInBranch)
	router.GET("/announcements", models.GetAnnouncements)
	router.GET("/products-by-category", models.GetProductsByCategory)
	router.GET("/products-by-category-in-branch", models.GetProductsByCategoryInBranch)

	router.GET("/filtered-products", models.GetProductsByCategoryAndName)
	router.GET("/filtered-products-in-branch", models.GetProductsByCategoryAndNameInBranch)

	router.GET("/supplier", models.GetSupplierEntries)

	// Restricted routes with role-based access control
	adminGroup := router.Group("/")
	adminGroup.Use(middleware.AuthMiddleware("admin")) // Only admins can access
	{
	}

	supplierGroup := router.Group("/")
	supplierGroup.Use(middleware.AuthMiddleware("supplier")) // Only admins can access
	{
	}

	staffGroup := router.Group("/")
	staffGroup.Use(middleware.AuthMiddleware("staff", "admin")) // Staff and admins can access
	{

	}

	customerGroup := router.Group("/")
	customerGroup.Use(middleware.AuthMiddleware("customer", "staff", "admin")) // Customers, Staff, Admins
	{
	}

	auditorGroup := router.Group("/")
	auditorGroup.Use(middleware.AuthMiddleware("auditor", "admin")) // Auditors & Admins
	{

	}

	checkGroup := router.Group("/")
	checkGroup.Use(middleware.AuthMiddleware("auditor", "admin", "staff"))
	{
		checkGroup.GET("/suppliers", models.GetSuppliers)
		checkGroup.GET("/order", models.GetOrderProducts)
		checkGroup.GET("/entry", models.GetEntryProducts)
		checkGroup.GET("/history/orders", models.GetBranchSaleHistory)
		checkGroup.GET("/history/entries", models.GetBranchEntryHistory)
	}
}
