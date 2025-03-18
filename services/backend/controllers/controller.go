package controllers

import(
    "github.com/gin-gonic/gin"
    	"github.com/gin-contrib/cors" // Import cors middleware
)

func Run(){
    router := gin.Default()

    	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Allow Next.js frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

    get(router)
    post(router)
    put(router)
    del(router)
    router.Run("localhost:8080")
}
