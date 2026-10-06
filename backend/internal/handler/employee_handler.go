package handler

import (
	"errors"
	"inventory/internal/database"
	"inventory/internal/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Create
type CreateEmployeeRequest struct {
	Fullname string `json:"fullname" binding:"required"`
	Phone string `json:"phone" binding:"required"`
	DivisionID uint `json:"division_id" binding:"required"`
	Email string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

func CreateEmployee(c *gin.Context) {
	var req CreateEmployeeRequest

	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "Invalid Body Request",
			"error" : err.Error(),
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message" : "Failed To Create Password",
		})
		return 
	}

	var employee models.Employee

	err = database.DB.Transaction(func(tx *gorm.DB) error {
		employee = models.Employee{
			FullName: strings.ToLower(req.Fullname),
			Phone: req.Phone,
			DivisionID: req.DivisionID,
			Status: models.StatusActive,
		} 

		if err := tx.Create(&employee).Error; err != nil {
			return err
		}

		user := models.User{
			Email: req.Email,
			Password: string(hashedPassword),
			EmployeeID: employee.ID,
			Role: string(models.RoleEmployee),
		}

		return tx.Create(&user).Error
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message" : "Failed TO create Employee and user",
			"error" : err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated,gin.H{
		"message" : "Employee Created Succesfully",
		"data" : gin.H{
			"employee" : employee,
			"user" : gin.H{
				"email" : req.Email,
				"division" :req.DivisionID,
				"role" : models.RoleEmployee,
			},
		},
	})

}
// End Create

// Get
func GetEmployee(c *gin.Context) {
	var employees []models.Employee

	err := database.DB.
		Preload("User").
		Preload("Division").
		Find(&employees).Error
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message" : "Failed to get Employee",
			"error" : err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message" : "Employee Retriveed Succesfully",
		"data" : employees,
	})
}
// End Get

// Put
type UpdateEmployeeRequest struct {
	Fullname string `json:"fullname" binding:"required"`
	Phone string `json:"phone" binding:"required"`
	DivisionID uint `json:"division_id" binding:"required"`
	Status     models.Status `json:"status" binding:"required,oneof=active inactive"`
	Email string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

func UpdateEmployee(c *gin.Context) {
	id := c.Param("id")

	var req UpdateEmployeeRequest
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message" : "Invalid Body Request",
			"error" : err.Error(),
		})
		return
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		var employee models.Employee

		if err := tx.First(&employee,id).Error; err != nil {
			return err
		}

		employee.FullName = strings.ToLower(req.Fullname)
		employee.Phone = req.Phone
		employee.DivisionID = req.DivisionID
		employee.Status = req.Status

		if err := tx.Save(&employee).Error; err != nil {
			return err
		}

		var user models.User
		if err := tx.Where("employee_id = ?", employee.ID).First(&user).Error; err != nil {
			return err
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message" : "Failed To Create Password",
				"error" : err.Error(),
			})
			return err
		}

		user.Email = req.Email
		user.Password = string(hashedPassword)
		return tx.Save(&user).Error
	})

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"message" : "Employee And User Not Found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message" : "Failed To Update Employee",
			"error" : err.Error(),
		})
		return
	}

	var updated models.Employee
	if err := database.DB.
		Preload("Division").
		Preload("User").
		First(&updated, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message" : "Employee Updated But Failed To Retrive Data",
				"error" : err.Error(),
			})
			return
	}

	c.JSON(http.StatusOK, gin.H{
		"message" : "Data Updated Succesfully",
		"data" : updated,
	})
}
// End Put

// Delete
func DeleteEmployee(c *gin.Context) {
	id := c.Param("id")

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		var employee models.Employee

		if err := tx.First(&employee, id).Error; err != nil {
			return err
		}

		if err := tx.Where("employee_id = ?", employee.ID).Delete(&models.User{}).Error; err != nil {
			return err
		}

		return tx.Delete(&employee).Error
	})

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"message" : "Employee not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message" : "Failed to delete Employee And User",
			"error" : err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message" : "Employee and User deleted Succesfully",
	})
}
// End Delete