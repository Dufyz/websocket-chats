package routes

import (
	"database/sql"
	"server/internal/domain/message"
	"server/internal/interfaces/rest/controller"

	"github.com/labstack/echo/v4"
)

func MessageRoutes(g *echo.Group, aG *echo.Group, dbConnection *sql.DB) {
	messageRepository := message.NewMessageRepository(dbConnection)
	messageUsecase := message.NewMessageUsecase(messageRepository)
	messageController := controller.NewMessageController(messageUsecase)

	g.GET("/messages/chat/:chat_id", messageController.GetMessagesByChatId)

	aG.POST("/messages", messageController.PostMessage)
	aG.PATCH("/messages/:message_id", messageController.PatchMessage)
	aG.DELETE("/messages/:message_id", messageController.DeleteMessage)
}
