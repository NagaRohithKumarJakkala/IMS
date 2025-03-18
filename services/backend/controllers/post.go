package controllers
import(
      "backend/models"
    "github.com/gin-gonic/gin"
)

func post(router *gin.Engine ){
    router.POST("/products", models.InsertProduct)
    router.POST("/sellers", models.InsertSeller)
    router.POST("/branches", models.InsertBranch)
    router.POST("/costs", models.InsertCost)
    router.POST("/sales", models.InsertSelling)
    router.POST("/categories", models.InsertCategory)
    router.POST("/durations", models.InsertDuration)
    router.POST("/users", models.InsertUserLevel)
    router.POST("/userlog", models.InsertUserLog)
}
