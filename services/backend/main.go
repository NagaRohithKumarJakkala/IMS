package main

import (
    "backend/initializers"
    "backend/controllers"
)

func main() {
    connect.ConnectDB()
    controllers.Run()
}

