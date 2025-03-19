package controllers
import(
      "backend/models"
    "github.com/gin-gonic/gin"
)

func get(router *gin.Engine ){
    //setup 

    router.GET("/create-tables", models.CreateTables)
    router.GET("/create-triggers", models.CreateTables)

    router.GET("/get-branches",models.GetBranches)
    router.GET("/product/:product_id",models.GetProduct)
    router.GET("/products",models.GetAllProducts)
    router.GET("/products-by-name/:query",models.GetProductsByName)
}
