package controller

import (
	"net/http"
	"server/internal/domain/message"
	"server/internal/utils"
	"strconv"

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
	var cursor *int64
	var limit *int

	chatId, errorMessage := utils.GetInt64Param(ctx, "chat_id")
	if errorMessage != "" {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": errorMessage,
		})
	}

	query := ctx.QueryParam("cursor")
	if query == "null" {
		cursor = nil
	}
	if query != "" && query != "null" {
		parsedCursor, err := strconv.ParseInt(query, 10, 64)
		if err != nil {
			return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
				"message": "Cursor must be a valid integer!",
			})
		}
		if parsedCursor < 0 {
			return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
				"message": "Cursor must be a positive integer!",
			})
		}
		cursor = &parsedCursor
	}

	query = ctx.QueryParam("limit")
	if query == "null" {
		limit = nil
	}
	if query != "" && query != "null" {
		parsedLimit, err := strconv.Atoi(query)
		if err != nil {
			return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
				"message": "Limit must be a valid integer!",
			})
		}
		if parsedLimit < 0 {
			return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
				"message": "Limit must be a positive integer!",
			})
		}
		limit = &parsedLimit
	}

	messages, err := mc.messageUsecase.GetMessagesByChatId(message.GetMessagesRequest{
		Chat_id: chatId,
		Cursor:  cursor,
		Limit:   limit,
	})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"data": messages,
	})
}

func (mc *messageController) PostMessage(ctx echo.Context) error {
	var body message.PostMessageRequest
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

	var body message.PatchMessageRequest
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
