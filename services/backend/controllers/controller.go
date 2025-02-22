package controllers

import(
    "github.com/gin-gonic/gin"
)

func Run(){
    router := gin.Default()
    get(router)
    post(router)
    put(router)
    del(router)
    router.Run("localhost:8080")
}
