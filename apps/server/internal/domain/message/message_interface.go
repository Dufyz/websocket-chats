package message

import "server/internal/interfaces/dto"

type MessageRepositoryInterface interface {
	GetMessagesByChatId(chat_id int64) ([]Message, error)
	PostMessage(body dto.PostMessage) (*Message, error)
	PatchMessage(message_id int64, body dto.PatchMessage) (*Message, error)
	DeleteMessage(message_id int64) error
}

var _ MessageRepositoryInterface = (*MessageRepository)(nil)
