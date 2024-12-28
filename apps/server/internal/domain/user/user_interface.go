package user

import "server/internal/interfaces/dto"

type UserRepositoryInterface interface {
	SignUp(body dto.PostUserSignUp) error

	GetUserById(user_id int64) (*User, error)
	GetUserByName(name string) (*User, error)
	PatchUser(user_id int64, body dto.PatchUser) (*User, error)
	PatchUserPassword(user_id int64, password string) error
}

var _ UserRepositoryInterface = (*UserRepository)(nil)
