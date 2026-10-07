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


// Start PUT
type UpdateItemRequest struct {
	Name string `json:"name" binding:"required"`
	Category string `json:"category" binding:"required"`
	Stock int32 `json:"stock" binding:"required"`
}

func UpdateItem(c *gin.Context) {
	id := c.Param("id")
	var item models.Item

	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message" : "Item Not found",
		})
		return
	}

	var req UpdateItemRequest
	if err := c.ShouldBindBodyWithJSON(&req); err  != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "Invalid body Request",
			"error" : err.Error(),
		})
		return
	}

	update := models.Item{
		Name: req.Name,
		Category: req.Category,
		Stock: req.Stock,
	}

	if err := database.DB.Model(&item).Updates(update).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "failed to update data",
			"error" : err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message" : "item updated succesfully",
		"data" : item,
	})
}
// End Put

// Start Delte
func DeleteItem(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusNotFound, gin.H{
			"message" : "id not found",
		})
		return
	}

	var item models.Item
	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message" : "data not found",
			"error" : err.Error(),
		})
		return
	}

	if err := database.DB.Delete(&item).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "failed to delete data",
			"error" : err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK,gin.H{
		"message" : "item deleted succesfully",
	})
}