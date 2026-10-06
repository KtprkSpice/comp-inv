package main

import (
	"inventory/internal/config"
	"inventory/internal/database"
	"inventory/internal/migration"
	"inventory/internal/routes"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg  := config.Load()
	
	database.ConnectDatabase()

	migration.Migrate()

	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	routes.SetupRoutes(router)

	router.Run(":" + cfg.AppPort)
}