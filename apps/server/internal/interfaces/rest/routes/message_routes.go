package routes

import (
	"database/sql"
	"server/internal/domain/message"
	"server/internal/domain/user"
	"server/internal/interfaces/rest/controller"

	"github.com/labstack/echo/v4"
)

func MessageRoutes(g *echo.Group, aG *echo.Group, dbConnection *sql.DB) {
	userRepository := user.NewUserRepository(dbConnection)
	userUsecase := user.NewUserUsecase(userRepository)

	messageRepository := message.NewMessageRepository(dbConnection)
	messageUsecase := message.NewMessageUsecase(messageRepository, userUsecase)
	messageController := controller.NewMessageController(messageUsecase)

	g.GET("/messages/chat/:chat_id", messageController.GetMessagesByChatId)

	aG.POST("/messages", messageController.PostMessage)
	aG.PATCH("/messages/:message_id", messageController.PatchMessage)
	aG.DELETE("/messages/:message_id", messageController.DeleteMessage)
}
