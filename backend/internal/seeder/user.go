package seeder

import (
	"inventory/internal/database"
	"inventory/internal/models"

	"golang.org/x/crypto/bcrypt"
)

func SeedUser() {
	var count int64

	database.DB.Model(&models.User{}).Where("email = ?", "admin@mail.com").Count(&count)
	if count > 0 {
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
	if err != nil {
		panic("failed to seed hashed password")
	}

	admin := models.User{
		EmployeeID: 1,
		Email: "admin@mail.com",
		Password: string(hashedPassword),
		Role: string(models.RoleAdmin),
	}

	if err := database.DB.Create(&admin).Error; err != nil {
		panic("failed to seed admin")
	}
}