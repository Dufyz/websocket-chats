package dto

type GetChats struct {
}

type PostChat struct {
	Admin_user_id int64   `json:"admin_user_id" validate:"required"`
	Name          string  `json:"name" validate:"required"`
	Category      string  `json:"category" validate:"required"`
	Description   *string `json:"description"`
}

type PatchChat struct {
	Name        string  `json:"name"`
	Category    string  `json:"category"`
	Description *string `json:"description"`
}
