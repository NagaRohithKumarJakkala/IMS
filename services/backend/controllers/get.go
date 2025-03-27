package controllers

import (
	"backend/models"

	"github.com/gin-gonic/gin"
)

func get(router *gin.Engine) {
	//setup

	router.GET("/create-tables", models.CreateTables)
	router.GET("/create-triggers", models.CreateTriggers)

	router.GET("/get-branches", models.GetBranches)
	router.GET("/product/:product_id", models.GetProduct)
	router.GET("/allproducts", models.GetAllProducts)
	router.GET("/products-by-name", models.GetProductsByName)
	router.GET("/product", models.GetProductDetails)
	router.GET("/products", models.GetAllProductsInBranch)
	router.GET("/products/branch", models.GetProductsByNameInBranch)
	router.GET("/history/orders", models.GetBranchSaleHistory)
}
