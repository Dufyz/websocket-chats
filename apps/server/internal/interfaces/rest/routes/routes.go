package routes

import (
	"database/sql"
	"server/internal/interfaces/rest/middleware"

	"github.com/labstack/echo/v4"
)

func UseRoutes(e *echo.Echo, db *sql.DB) {
	api := e.Group("/api")
	authenticatedApi := api.Group("")
	authenticatedApi.Use(middleware.AuthMiddleware())

	WebsocketRoutes(api)
	UserRoutes(api, authenticatedApi, db)
}
