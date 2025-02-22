package controllers
import(
      "backend/models"
    "github.com/gin-gonic/gin"
)

func get(router *gin.Engine ){
    router.GET("/albums", models.GetAlbums)
}
