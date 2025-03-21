package main

import (
	"backend/controllers"
	connect "backend/initializers"
)

func main() {
	connect.ConnectDB()
	controllers.Run()
}
