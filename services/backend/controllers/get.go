package controllers
import(
      "backend/models"
    "github.com/gin-gonic/gin"
)

func get(router *gin.Engine ){
    router.GET("/create-tables", models.CreateTables)
    router.GET("/get-products", models.GetAvailableProducts)

}
