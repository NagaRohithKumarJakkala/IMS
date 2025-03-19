package controllers
import(
      "backend/models"
    "github.com/gin-gonic/gin"
)

func post(router *gin.Engine ){
    router.POST("/products", models.InsertProduct)
    router.POST("/branches", models.InsertBranch)
}
