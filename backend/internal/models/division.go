package models

import (
	"time"

	"gorm.io/gorm"
)

type Division struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `gorm:"size:100;not null;unique" json:"name"`
	Description string `gorm:"size:255;null" json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`
}