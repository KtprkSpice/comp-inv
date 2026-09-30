package middleware

import (
	"inventory/internal/config"
	"inventory/internal/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type ContextKey string

func AuthMiddleware() gin.HandlerFunc {
	return func (c *gin.Context)  {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized,gin.H{
				"message" : "Authorization Header Is Required",
			})

			c.Abort()
			return 
		}

		tokenString := strings.TrimPrefix(authHeader,"Bearer")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized,gin.H{
				"message" : "Bearer Token Is Required",
			})

			c.Abort()
			return 
		}

		cfg := config.Load()

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(cfg.JWTSecret), nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message" : "Invalid token",
			})
			
			c.Abort()
			return 
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message" : "Invalid Token Claims",
			})
			
			c.Abort()
			return 
		}

		userId, ok := claims["user_id"]
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message" : "Invalid User ID",
			})

			c.Abort()
			return 
		}

		roleId, ok := claims["role"]
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message" : "Invalid Role",
			})

			c.Abort()
			return 
		}

		c.Set("user_id", userId)
		c.Set("role", roleId)

		c.Next()
	}
}

func RoleMiddleware(allowedRoles ...models.UserRole) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleValue, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"message" : "Role Not Found",
			})

			c.Abort()
			return 
		}

		roleString, ok := roleValue.(string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"message" : "Failed To Stringfy Role",
			})

			c.Abort()
			return 
		}

		userRole := models.UserRole(roleString)

		for _, allowedRoles := range allowedRoles{
			if userRole == allowedRoles {
				c.Next()
				return 
			}
		}

		c.JSON(http.StatusForbidden, gin.H{
			"message" : "You do not hanve Permission",
		})

		c.Abort()
	}
}