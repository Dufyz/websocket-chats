package chat

type GetChatsRequest struct {
	Search *string `json:"search"`
	Cursor *int64  `json:"cursor"`
	Limit  *int    `json:"limit"`
}

type GetChatsResponse struct {
	Chats      []ChatWithStats `json:"chats"`
	Pagination struct {
		Total       int64  `json:"total"`
		Next_cursor *int64 `json:"next_cursor"`
		Cursor      int64  `json:"cursor"`
	} `json:"pagination"`
}

type GetChatByIdResponse = ChatWithStats

type PostChatRequest struct {
	Admin_user_id int64   `json:"admin_user_id" validate:"required"`
	Name          string  `json:"name" validate:"required"`
	Category      string  `json:"category" validate:"required"`
	Description   *string `json:"description"`
}

type PatchChatRequest struct {
	Name        string  `json:"name"`
	Category    string  `json:"category"`
	Description *string `json:"description"`
}
