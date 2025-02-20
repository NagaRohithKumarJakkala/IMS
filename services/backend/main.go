package main

import (
    "backend/models"
    "backend/initializers"
    "github.com/gin-gonic/gin"
)

func main() {
    connect.ConnectDB();
    router := gin.Default()
    router.GET("/albums", models.GetAlbums)

    router.Run("localhost:8080")
}

