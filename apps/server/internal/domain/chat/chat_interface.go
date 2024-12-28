package chat

import "server/internal/interfaces/dto"

type ChatRepositoryInterface interface {
	GetChatById(chat_id int64) (*Chat, error)
	GetChatsByUserId(user_id int64) ([]Chat, error)
	GetChats() ([]Chat, error)

	PostChat(body dto.PostChat) (*Chat, error)
	PatchChat(chat_id int64, body dto.PatchChat) (*Chat, error)
	DeleteChat(chat_id int64) error
}

var _ ChatRepositoryInterface = (*ChatRepository)(nil)
