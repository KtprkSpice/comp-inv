package routes

import (
	"inventory/internal/handler"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")

	auth := api.Group("/auth")
	{
		auth.POST("/login", handler.Login)
		auth.GET("/me", handler.Me)
	}
}