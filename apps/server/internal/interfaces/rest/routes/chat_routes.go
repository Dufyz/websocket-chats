package routes

import (
	"database/sql"
	"server/internal/domain/chat"
	"server/internal/interfaces/rest/controller"

	"github.com/labstack/echo/v4"
)

func ChatRoutes(g *echo.Group, aG *echo.Group, dbConnection *sql.DB) {
	chatRepository := chat.NewChatRepository(dbConnection)
	chatUsecase := chat.NewChatUsecase(chatRepository)
	chatController := controller.NewChatController(chatUsecase)

	g.GET("/chats", chatController.GetChats)
	g.GET("/chats/:chat_id", chatController.GetChatById)
	aG.GET("/chats/user/:user_id", chatController.GetChatsByUserId)

	aG.POST("/chats", chatController.PostChat)
	aG.PATCH("/chats/:chat_id", chatController.PatchChat)
	aG.DELETE("/chats/:chat_id", chatController.DeleteChat)
}
