package message

type GetMessagesRequest struct {
	Chat_id int64  `json:"chat_id" validate:"required"`
	Cursor  *int64 `json:"cursor"`
	Limit   *int   `json:"limit"`
}

type GetMessagesResponse struct {
	Messages   []Message `json:"messages"`
	Pagination struct {
		Total       int64  `json:"total"`
		Next_cursor *int64 `json:"next_cursor"`
		Cursor      int64  `json:"cursor"`
	} `json:"pagination"`
}

type PostMessageRequest struct {
	Chat_id int64  `json:"chat_id" validate:"required"`
	User_id int64  `json:"user_id" validate:"required"`
	Message string `json:"message" validate:"required"`
}

type PatchMessageRequest struct {
	Message string `json:"message" validate:"required"`
}
