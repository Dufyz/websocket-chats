package chat

type ChatRepositoryInterface interface {
	GetChatById(chat_id int64) (*Chat, error)
	GetChatsByUserId(user_id int64) ([]Chat, error)
	GetChats(body GetChatsRequest) (GetChatsResponse, error)

	PostChat(body PostChatRequest) (*Chat, error)
	PatchChat(chat_id int64, body PatchChatRequest) (*Chat, error)
	DeleteChat(chat_id int64) error
}

var _ ChatRepositoryInterface = (*ChatRepository)(nil)
