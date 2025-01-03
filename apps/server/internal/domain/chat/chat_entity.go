package chat

import (
	"server/internal/domain/user"
	"time"
)

type Chat struct {
	ID            int64     `json:"id"`
	Admin_user_id int64     `json:"admin_user_id"`
	Name          string    `json:"name"`
	Category      string    `json:"category"`
	Description   *string   `json:"description"`
	Created_at    time.Time `json:"created_at"`
	Updated_at    time.Time `json:"updated_at"`
}

type ChatWithStats struct {
	Chat           Chat        `json:"chat"`
	Users          []user.User `json:"users"`
	Total_users    int         `json:"total_users"`
	Total_messages int         `json:"total_messages"`
}
