package message

import (
	"fmt"
	"server/internal/domain/user"
	"server/internal/infra/websocket"
)

type MessageUsecase struct {
	repository       MessageRepositoryInterface
	userUsecase      user.UserUsecase
	websocketEmitter *websocket.EventService
}

func NewMessageUsecase(repository MessageRepositoryInterface, userUsecase user.UserUsecase) MessageUsecase {
	return MessageUsecase{
		repository:       repository,
		userUsecase:      userUsecase,
		websocketEmitter: websocket.GetEventService(),
	}
}

func (uc *MessageUsecase) GetMessageById(messageId int64) (*Message, error) {
	return uc.repository.GetMessageById(messageId)
}

func (uc *MessageUsecase) GetMessagesByChatId(body GetMessagesRequest) (GetMessagesResponse, error) {
	return uc.repository.GetMessagesByChatId(body)
}

func (uc *MessageUsecase) PostMessage(body PostMessageRequest) (*Message, error) {
	message, err := uc.repository.PostMessage(body)
	if err != nil {
		return nil, err
	}

	user, err := uc.userUsecase.GetUserById(body.User_id)
	if err != nil {
		return nil, err
	}

	uc.websocketEmitter.EmitToRoom(fmt.Sprintf("chat_%d", body.Chat_id), websocket.Event{
		Type:    "message",
		Room_id: fmt.Sprintf("chat_%d", body.Chat_id),
		Payload: map[string]interface{}{
			"action":  "create",
			"message": message,
			"user":    user,
			"chat_id": body.Chat_id,
		},
	})

	return message, nil
}

func (uc *MessageUsecase) PatchMessage(messageId int64, body PatchMessageRequest) (*Message, error) {
	message, err := uc.repository.PatchMessage(messageId, body)
	if err != nil {
		return nil, err
	}

	uc.websocketEmitter.EmitToRoom(fmt.Sprintf("chat_%d", message.Chat_id), websocket.Event{
		Type:    "message",
		Room_id: fmt.Sprintf("chat_%d", message.Chat_id),
		Payload: map[string]interface{}{
			"action":  "update",
			"message": message,
			"chat_id": message.Chat_id,
		},
	})

	return message, nil
}

func (uc *MessageUsecase) DeleteMessage(messageId int64) error {
	message, err := uc.repository.GetMessageById(messageId)
	if err != nil {
		return err
	}

	err = uc.repository.DeleteMessage(messageId)
	if err != nil {
		return err
	}

	uc.websocketEmitter.EmitToRoom(fmt.Sprintf("chat_%d", message.Chat_id), websocket.Event{
		Type:    "message",
		Room_id: fmt.Sprintf("chat_%d", message.Chat_id),
		Payload: map[string]interface{}{
			"action":     "delete",
			"chat_id":    message.Chat_id,
			"message_id": message.ID,
		},
	})

	return nil
}
