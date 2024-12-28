package dto

type PostMessage struct {
	Chat_id int64  `json:"chat_id" validate:"required"`
	User_id int64  `json:"user_id" validate:"required"`
	Message string `json:"message" validate:"required"`
}

type PatchMessage struct {
	Message string `json:"message" validate:"required"`
}
