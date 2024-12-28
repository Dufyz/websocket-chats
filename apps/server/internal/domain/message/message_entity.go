package message

import "time"

type Message struct {
	ID         int64     `json:"id"`
	Chat_id    int64     `json:"chat_id"`
	User_id    int64     `json:"user_id"`
	Message    string    `json:"message"`
	Created_at time.Time `json:"created_at"`
	Updated_at time.Time `json:"updated_at"`
}
