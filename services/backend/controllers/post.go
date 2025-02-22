package controllers
import(
      "backend/models"
    "github.com/gin-gonic/gin"
)

func post(router *gin.Engine ){
    router.GET("/albums/post", models.GetAlbums)
}
