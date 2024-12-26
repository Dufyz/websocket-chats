package main

import (
	"fmt"
	"os"
	"path/filepath"
	"server/internal/infra/db"
	"server/internal/interfaces/rest/routes"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
)

var logger *zap.Logger

func init() {
	envPath := filepath.Join("..", ".env")
	if _, err := os.Stat(envPath); err == nil {
		if err := godotenv.Load(envPath); err != nil {
			logger.Fatal("Error loading .env file", zap.Error(err))
		}
		logger.Info(".env file loaded successfully")
	} else {
		logger.Warn(".env file not found, skipping loading")
	}

	requiredEnvVars := []string{
		"DB_URL",
		"WEB_URL",
	}

	for _, envVar := range requiredEnvVars {
		if os.Getenv(envVar) == "" {
			logger.Fatal("Missing required environment variable", zap.String("envVar", envVar))
		}
	}
}

func main() {
	dbConnection, err := db.ConnectDB()
	if err != nil {
		logger.Fatal("Could not connect to database", zap.Error(err))
	}
	defer dbConnection.Close()

	e := echo.New()
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins:     []string{os.Getenv("WEB_URL"), "https://*.vercel.app"},
		AllowMethods:     []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE, echo.OPTIONS},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		ExposeHeaders:    []string{echo.HeaderAuthorization},
		AllowCredentials: true,
	}))
	e.Use(echoMiddleware.Recover())

	routes.UseRoutes(e)

	port := os.Getenv("API_PORT")
	if port == "" {
		port = "3000"
	}

	if err := e.Start(fmt.Sprintf(":%s", port)); err != nil {
		logger.Fatal("Server failed to start", zap.Error(err))
	}
}
