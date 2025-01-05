package user

type UserRepositoryInterface interface {
	SignUp(body PostUserSignUp) error

	GetUserById(user_id int64) (*User, error)
	GetUserByName(name string) (*User, error)
	PatchUser(user_id int64, body PatchUser) (*User, error)
	PatchUserPassword(user_id int64, password string) error
}

var _ UserRepositoryInterface = (*UserRepository)(nil)
