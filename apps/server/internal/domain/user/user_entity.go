package user

type User struct {
	ID         int64  `json:"id"`
	Name       string `json:"name"`
	Password   string `json:"password"`
	Created_at string `json:"created_at"`
	Updated_at string `json:"updated_at"`
}
