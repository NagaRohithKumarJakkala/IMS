package controllers

import (
	// "backend/models"
	"backend/middleware"
	"backend/models"

	"github.com/gin-gonic/gin"
)

func put(router *gin.Engine) {

	staffGroup := router.Group("/")
	staffGroup.Use(middleware.AuthMiddleware("staff", "admin"))
	{
		staffGroup.PUT("/product/:product_id", models.UpdateProduct)
	}

}
