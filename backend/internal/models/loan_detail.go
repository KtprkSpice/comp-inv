package models

import (
	"time"

	"gorm.io/gorm"
)

type LoanStatus string 
const (
	StatusTerlambat Status = "Terlambat"
	StatusTempo Status = "Jatuh Tempo Segera"
	StatusBerjalan Status = "Sedang Berjalan"
	StatusDikembalikan Status = "Dikembalikan"
)

type LoanDetail struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	EmployeeID uint           `gorm:"not null" json:"employee_id"`
	Employee   Employee       `gorm:"foreignKey:EmployeeID" json:"employee"`
	ItemID     uint           `gorm:"not null" json:"item_id"`
	Item       Item           `gorm:"foreignKey:ItemID" json:"item"`
	Amount     int32          `gorm:"not null" json:"amount"`
	Status     LoanStatus     `gorm:"type:varchar(100);not null" json:"status"`
	StartTime  time.Time      `gorm:"not null" json:"start_time"`
	EndTime    time.Time      `gorm:"not null" json:"end_time"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"deleted_at"`
}