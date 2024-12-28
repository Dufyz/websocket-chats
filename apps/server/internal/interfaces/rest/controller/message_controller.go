package controller

import (
	"net/http"
	"server/internal/domain/message"
	"server/internal/interfaces/dto"
	"server/internal/utils"

	"github.com/labstack/echo/v4"
)

type messageController struct {
	messageUsecase message.MessageUsecase
}

func NewMessageController(messageUsecase message.MessageUsecase) messageController {
	return messageController{
		messageUsecase: messageUsecase,
	}
}

func (mc *messageController) GetMessagesByChatId(ctx echo.Context) error {
	chatId, errorMessage := utils.GetInt64Param(ctx, "chat_id")
	if errorMessage != "" {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": errorMessage,
		})
	}

	messages, err := mc.messageUsecase.GetMessagesByChatId(chatId)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"messages": messages,
	})
}

func (mc *messageController) PostMessage(ctx echo.Context) error {
	var body dto.PostMessage
	if err := ctx.Bind(&body); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": err.Error(),
		})
	}

	message, err := mc.messageUsecase.PostMessage(body)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusCreated, map[string]interface{}{
		"message": message,
	})
}

func (mc *messageController) PatchMessage(ctx echo.Context) error {
	messageId, errorMessage := utils.GetInt64Param(ctx, "message_id")
	if errorMessage != "" {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": errorMessage,
		})
	}

	var body dto.PatchMessage
	if err := ctx.Bind(&body); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": err.Error(),
		})
	}

	message, err := mc.messageUsecase.PatchMessage(messageId, body)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"message": message,
	})
}

func (mc *messageController) DeleteMessage(ctx echo.Context) error {
	messageId, errorMessage := utils.GetInt64Param(ctx, "message_id")
	if errorMessage != "" {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": errorMessage,
		})
	}

	err := mc.messageUsecase.DeleteMessage(messageId)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"message": "Message deleted",
	})
}
