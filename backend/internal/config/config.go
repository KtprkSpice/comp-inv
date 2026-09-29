package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppPort string

	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string

	JWTSecret string
}

func Load() Config {
	_ = godotenv.Load()
	return Config{
		AppPort: getEnv("APP_PORT", "8080"),

		DBHost: getEnv("DB_HOST", "localhost"),
		DBPort: getEnv("DB_PORT", "3306"),
		DBUser: getEnv("DB_USER", "admin"),
		DBPassword: getEnv("DB_PASSWORD", "password"),
		DBName: getEnv("DB_NAME", "inventory"),

		JWTSecret: getEnv("JWT_SECRET", "this_is_a_secret"),
	}
}

func getEnv(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}

	return value
}