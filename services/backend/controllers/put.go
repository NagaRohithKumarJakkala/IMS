package controllers
import(
      "backend/models"
    "github.com/gin-gonic/gin"
)

func put(router *gin.Engine ){
    router.GET("/albums/put", models.GetAlbums)
}
