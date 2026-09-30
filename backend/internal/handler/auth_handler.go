package handler

import (
	"inventory/internal/database"
	"inventory/internal/helper"
	"inventory/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var request LoginRequest
	
	if err := c.ShouldBindBodyWithJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "Invalid Request",
			"error" : err.Error(),
		})
		return
	}

	var user models.User

	if err := database.DB.Where("email = ?", request.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message" : "Email Invalid",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message" : "Password Invalid",
		})
		return
	}

	token, err := helper.GenerateToken(user.ID, models.UserRole(user.Role))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message" : "Failed To Generate Token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message" : "Login Success",
		"token" : token,
		"user" : gin.H{
			"id" : user.ID,
			"email" : user.Email,
			"role" : user.Role,
		},
	})
}

func Me(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	
	c.JSON(http.StatusOK, gin.H{
		"message" : "Authenticated User",
		"user" : gin.H{
			"id" : userID,
			"role" : role,
		},
	})
}