package message

type MessageRepositoryInterface interface {
	GetMessagesByChatId(body GetMessagesRequest) (GetMessagesResponse, error)
	PostMessage(body PostMessageRequest) (*Message, error)
	PatchMessage(message_id int64, body PatchMessageRequest) (*Message, error)
	DeleteMessage(message_id int64) error
}

var _ MessageRepositoryInterface = (*MessageRepository)(nil)
