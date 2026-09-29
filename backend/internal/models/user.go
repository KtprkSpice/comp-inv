package models

import (
	"time"

	"gorm.io/gorm"
)

type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleEmployee UserRole = "employee"
)

type User struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	Email      string         `gorm:"size:100;unique;not null" json:"email"`
	Password   string         `gorm:"size100;not null" json:"password"`
	EmployeeID uint           `gorm:"not null" json:"employee_id"`
	Employee   Employee       `gorm:"foreignKey:EmployeeID" json:"employee"`
	Role       string         `gorm:"type:enum('admin','employee');default:admin;not null" json:"role"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"deleted_at"`
}