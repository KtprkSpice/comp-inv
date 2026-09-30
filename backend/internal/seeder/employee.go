package seeder

import (
	"inventory/internal/database"
	"inventory/internal/models"
)

func EmployeeSeeder() {
	var count int64

	database.DB.Model(&models.Employee{}).Where("full_name = ?", "rehan siregar").Count(&count)
	if count > 0 {
		return
	}

	employee := models.Employee{
		FullName: "rehan siregar",
		Phone: "0x5xxxx",
		DivisionID: 1,
		Status: "active",
	}

	if err := database.DB.Create(&employee).Error; err != nil {
		panic("Failed to seed employee")
	}
}