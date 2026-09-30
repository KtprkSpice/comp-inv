package migration

import (
	"fmt"
	"inventory/internal/database"
	"inventory/internal/models"
	"inventory/internal/seeder"
)

func Migrate() {
	database.ConnectDatabase()

	err := database.DB.AutoMigrate(
		&models.Division{},
		&models.Employee{},
		&models.User{},
		&models.Item{},
		&models.LoanDetail{},
	)
	if err != nil {
		panic("failed to migrate")
	}

	seeder.SeedDivision()
	seeder.EmployeeSeeder()
	seeder.SeedUser()
	fmt.Println("Database Migration Completed")
}