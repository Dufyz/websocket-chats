package dto

type PostUserSignIn struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type PostUserSignUp struct {
	Name     string `json:"name" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type PostUserVerifyToken struct {
	Token string `json:"token"`
}

type PatchUser struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type PatchUserPassword struct {
	ID               int64  `json:"id"`
	Cureent_password string `json:"current_password"`
	New_password     string `json:"new_password"`
}
