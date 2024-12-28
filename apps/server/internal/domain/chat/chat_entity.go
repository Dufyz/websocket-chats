package chat

import "time"

type Chat struct {
	ID            int64     `json:"id"`
	Admin_user_id int64     `json:"admin_user_id"`
	Name          string    `json:"name"`
	Category      string    `json:"category"`
	Description   *string   `json:"description"`
	Created_at    time.Time `json:"created_at"`
	Updated_at    time.Time `json:"updated_at"`
}
