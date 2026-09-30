package seeder

import (
	"inventory/internal/database"
	"inventory/internal/models"
)

func SeedDivision() {
	var count int64

	database.DB.Model(&models.Division{}).Where("name = ?", "it").Count(&count)
	if count > 0 {
		return
	}

	it := models.Division{
		Name: "it",
		Description: "test",
	}

	if err := database.DB.Create(&it).Error; err != nil {
		panic("failed to create division")
	}
}