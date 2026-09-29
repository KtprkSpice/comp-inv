package models

import (
	"time"

	"gorm.io/gorm"
)

type Status string

const (
	StatusActive   Status = "active"
	StatusInactive Status = "inactive"
)

type Employee struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	FullName  string         `gorm:"size:100;not null" json:"fullname"`
	Phone     string         `gorm:"size:20;unique;not null" json:"phone"`
	DivisionID uint `gorm:"not null" json:"division_id"`
	Division  Division       `gorm:"foreignKey:DivisionID" json:"division"`
	Status    Status         `gorm:"type:enum('active','inactive');default:'active'" json:"status"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`
}