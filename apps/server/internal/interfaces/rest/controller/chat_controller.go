package controller

import (
	"net/http"
	"server/internal/domain/chat"
	"server/internal/interfaces/dto"
	"server/internal/utils"

	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
)

type chatController struct {
	chatUsecase chat.ChatUsecase
}

func NewChatController(chatUsecase chat.ChatUsecase) chatController {
	return chatController{
		chatUsecase: chatUsecase,
	}
}

func (cc *chatController) GetChatById(ctx echo.Context) error {
	chatId, errorMessage := utils.GetInt64Param(ctx, "chat_id")
	if errorMessage != "" {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": errorMessage,
		})
	}

	chat, err := cc.chatUsecase.GetChatById(chatId)
	if err != nil {

		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	if chat == nil {
		return ctx.JSON(http.StatusNotFound, map[string]interface{}{
			"message": "Chat not found!",
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"chat": chat,
	})
}

func (cc *chatController) GetChatsByUserId(ctx echo.Context) error {
	userId, errorMessage := utils.GetInt64Param(ctx, "user_id")
	if errorMessage != "" {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": errorMessage,
		})
	}

	chats, err := cc.chatUsecase.GetChatsByUserId(userId)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"chats": chats,
	})
}

func (cc *chatController) GetChats(ctx echo.Context) error {
	chats, err := cc.chatUsecase.GetChats()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"chats": chats,
	})
}

func (cc *chatController) PostChat(ctx echo.Context) error {
	var body dto.PostChat
	validate := validator.New()

	if err := ctx.Bind(&body); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Invalid request body!",
		})
	}

	err := validate.Struct(body)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Validation error!",
		})
	}

	chat, err := cc.chatUsecase.PostChat(body)
	if err != nil {
		if err.Error() == "pq: insert or update on table \"chats\" violates foreign key constraint \"chats_admin_user_id_fkey\"" {
			return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
				"message": "User not found!",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusCreated, map[string]interface{}{
		"chat": chat,
	})
}

func (cc *chatController) PatchChat(ctx echo.Context) error {
	var body dto.PatchChat
	validate := validator.New()

	chatId, errorMessage := utils.GetInt64Param(ctx, "chat_id")
	if errorMessage != "" {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": errorMessage,
		})
	}

	if err := ctx.Bind(&body); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Invalid request body!",
		})
	}

	err := validate.Struct(body)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Validation error!",
		})
	}

	chat, err := cc.chatUsecase.PatchChat(chatId, body)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	if chat == nil {
		return ctx.JSON(http.StatusNotFound, map[string]interface{}{
			"message": "Chat not found!",
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"chat": chat,
	})
}

func (cc *chatController) DeleteChat(ctx echo.Context) error {
	chatId, errorMessage := utils.GetInt64Param(ctx, "chat_id")
	if errorMessage != "" {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": errorMessage,
		})
	}

	err := cc.chatUsecase.DeleteChat(chatId)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"message": "Chat deleted!",
	})
}
