package handler

import (
	"inventory/internal/database"
	"inventory/internal/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Post
type CreateLoanRequest struct {
	EmployeeId uint64 `json:"employee_id" binding:"required"`
	ItemId uint64 `json:"item_id" binding:"required"`
	Amount uint32 `json:"amount" binding:"required"`
	StartTime time.Time `json:"start_time" binding:"required"`
	EndTime time.Time `json:"end_time" binding:"required"`
}

func CreateLoan(c *gin.Context) {
	var req CreateLoanRequest

	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "Invalid body Request",
			"error" : err.Error(),
		})	
		return
	}

	loan := models.LoanDetail{
		EmployeeID: uint(req.EmployeeId),
		ItemID: uint(req.ItemId),
		Amount: int32(req.Amount),
		StartTime: req.StartTime,
		EndTime: req.EndTime,
	}

	if err := database.DB.Create(&loan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message" : "failed to create loan",
			"error" : err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message" : "data created succesfully",
		"data" : req,
	})
}
// End Post

// Get
func GetLoan(c *gin.Context) {
	var loan []models.LoanDetail
	
	if err := database.DB.
	Preload("Employee").
	Preload("Item").
	Find(&loan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message" : "failed to get loan",
			"error" : err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data" : loan,
	})
}
// End Get


// PUT
type UpdateLoanRequest struct {
	EmployeeId uint64 `json:"employee_id" binding:"required"`
	ItemId uint64 `json:"item_id" binding:"required"`
	Amount uint32 `json:"amount" binding:"required"`
	StartTime time.Time `json:"start_time" binding:"required"`
	EndTime time.Time `json:"end_time" binding:"required"`
}

func UpdateLoan(c *gin.Context) {
	var loan models.LoanDetail

	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "id is empty",
		})
		return
	}

	if err := database.DB.First(&loan, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message" : "data not found",
			"error" : err.Error(),
		})
		return
	}

	
	var req UpdateLoanRequest
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "invalid body request",
			"error" : err.Error(),
		})
		return
	}


	update := models.LoanDetail{
		EmployeeID: uint(req.EmployeeId),
		ItemID: uint(req.ItemId),
		Amount: int32(req.Amount),
		StartTime: req.StartTime,
		EndTime: req.EndTime,
	}


	if err := database.DB.Model(&loan).Updates(update).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "failed to update data",
			"error" : err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message" : "Data updated succesfully",
		"data" : loan,
	})
}
// End PUT

// Delete
func DelteLoan(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "invalid id",
		})
		return
	}

	var loan models.LoanDetail
	if err := database.DB.First(&loan, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message" : "data not found",
			"error" : err.Error(),
		})
		return
	}

	if err := database.DB.Delete(&loan).Error;err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "failed to delete data",
			"error" : err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message" : "data deleted succesfully",
	})
}
// End Delete