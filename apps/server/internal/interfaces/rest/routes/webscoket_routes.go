package routes

import (
	"server/internal/interfaces/rest/controller"

	"github.com/labstack/echo/v4"
)

func WebsocketRoutes(g *echo.Group) {
	WebsocketController := controller.NewWebsocketController()
	g.GET("/web-socket", WebsocketController.HandleConnection)
}
