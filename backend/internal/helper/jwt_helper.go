package helper

import (
	"inventory/internal/config"
	"inventory/internal/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(UserID uint, role models.UserRole) (string,error) {
	cfg := config.Load()

	claims := jwt.MapClaims{
		"user_id" : UserID,
		"role" : string(role),
		"exp" : time.Now().Add(24*time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(cfg.JWTSecret))
}