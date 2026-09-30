package main

import (
	"inventory/internal/config"
	"inventory/internal/database"
	"inventory/internal/migration"
	"inventory/internal/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg  := config.Load()
	
	database.ConnectDatabase()

	migration.Migrate()

	router := gin.Default()

	routes.SetupRoutes(router)

	router.Run(":" + cfg.AppPort)
}