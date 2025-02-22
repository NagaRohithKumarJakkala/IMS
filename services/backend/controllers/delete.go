package controllers
import(
      "backend/models"
    "github.com/gin-gonic/gin"
)

func del(router *gin.Engine ){
    router.GET("/albums/del", models.GetAlbums)
}
