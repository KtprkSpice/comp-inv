package handler

import (
	"inventory/internal/database"
	"inventory/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Create
type CreateItemRequest struct {
	Name string `json:"name" binding:"required"`
	Category string `json:"category" binding:"required"`
	Stock int32 `json:"stock" binding:"required"`
}

func CreateItem(c *gin.Context) {
	var req CreateItemRequest

	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "Invalid body Request",
			"error" : err.Error(),
		})
		return
	}

	item := models.Item{
		Name: req.Name,
		Category: req.Category,
		Stock: req.Stock,
	} 

	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message" : "Failed to create item",
			"error" : err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message" : "item created succesfully",
		"data" : req,
	})
}
// End Create

// Start Get
func GetItem(c *gin.Context) {
	var items []models.Item

	err := database.DB.Find(&items).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message" : "Failed to get item",
			"error" : err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message" : "Item retrived succesfully",
		"data" : items,
	})
}
// End Get