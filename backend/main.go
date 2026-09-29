package main

import (
	"inventory/internal/config"
	"inventory/internal/database"
	"inventory/internal/migration"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg  := config.Load()
	
	database.ConnectDatabase()

	migration.Migrate()

	router := gin.Default()

	router.Run(":" + cfg.AppPort)
}