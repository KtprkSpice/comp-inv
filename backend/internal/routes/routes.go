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

	employee := api.Group("/employee")
	{
		employee.POST("/create", handler.CreateEmployee)
		employee.GET("/get", handler.GetEmployee)
		employee.PUT("/:id", handler.UpdateEmployee)
		employee.DELETE("/:id", handler.DeleteEmployee)
	}

	item := api.Group("/item")
	{
		item.POST("/create", handler.CreateItem)
		item.GET("/get", handler.GetItem)
		item.PUT("/:id", handler.UpdateItem)
	}
}