package migration

import (
	"fmt"
	"inventory/internal/database"
	"inventory/internal/models"
)

func Migrate() {
	database.ConnectDatabase()

	err := database.DB.AutoMigrate(
		&models.Division{},
		&models.Employee{},
	)
	if err != nil {
		panic("failed to migrate")
	}

	fmt.Println("Database Migration Completed")
}