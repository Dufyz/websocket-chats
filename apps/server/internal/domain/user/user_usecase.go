package user

import (
	"fmt"
	"os"
	"server/internal/interfaces/dto"
	"server/internal/interfaces/errors"
	"time"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

type UserUsecase struct {
	repository UserRepositoryInterface
}

func NewUserUsecase(repository UserRepositoryInterface) UserUsecase {
	return UserUsecase{
		repository: repository,
	}
}

func (uc *UserUsecase) SignUp(body dto.PostUserSignUp) (*User, string, error) {
	hashedPassword, err := uc.HashUserPassword(body.Password)
	if err != nil {
		return nil, "", err
	}

	err = uc.repository.SignUp(dto.PostUserSignUp{
		Name:     body.Name,
		Password: hashedPassword,
	})
	if err != nil {
		if err.Error() == "pq: duplicate key value violates unique constraint \"users_name_key\"" {
			return nil, "", errors.ErrNameUniqueViolation
		}
		return nil, "", err
	}

	user, err := uc.repository.GetUserByName(body.Name)
	if err != nil {
		return nil, "", err
	}
	if user == nil {
		return nil, "", errors.ErrNotFound
	}

	token, err := uc.GenerateToken(user.ID)
	if err != nil {
		return nil, "", err
	}

	return user, token, err
}

func (uc *UserUsecase) SignIn(body dto.PostUserSignIn) (*User, string, error) {
	user, err := uc.repository.GetUserByName(body.Name)
	if err != nil {
		return nil, "", err
	}
	if user == nil {
		return nil, "", errors.ErrInvalidCredentials
	}

	err = uc.CompareUserPassword(body.Password, user.Password)
	if err != nil {
		if err.Error() == "crypto/bcrypt: hashedPassword is not the hash of the given password" {
			return nil, "", errors.ErrInvalidCredentials
		}
		return nil, "", err
	}

	token, err := uc.GenerateToken(user.ID)
	if err != nil {
		return nil, "", err
	}

	return user, token, err
}

func (uc *UserUsecase) GetUserById(user_id int64) (*User, error) {
	return uc.repository.GetUserById(user_id)
}

func (uc *UserUsecase) GetUserByName(name string) (*User, error) {
	return uc.repository.GetUserByName(name)
}

func (uc *UserUsecase) PatchUser(user_id int64, body dto.PatchUser) (*User, error) {
	return uc.repository.PatchUser(user_id, body)
}

func (uc *UserUsecase) PatchUserPassword(user_id int64, body dto.PatchUserPassword) (*User, error) {
	user, err := uc.repository.GetUserById(user_id)
	if err != nil {
		return nil, err
	}

	err = uc.CompareUserPassword(body.Cureent_password, user.Password)
	if err != nil {
		if err.Error() == "crypto/bcrypt: hashedPassword is not the hash of the given password" {
			return nil, errors.ErrInvalidCredentials
		}
		return nil, err
	}

	hashedPassword, err := uc.HashUserPassword(body.New_password)
	if err != nil {
		return nil, err
	}

	err = uc.repository.PatchUserPassword(user_id, hashedPassword)
	if err != nil {
		return nil, err
	}

	user.Password = hashedPassword

	return user, nil
}

func (uc *UserUsecase) GenerateToken(user_id int64) (string, error) {
	var JWT_KEY = []byte(os.Getenv("JWT_KEY"))

	claims := jwt.MapClaims{}
	claims["user_id"] = user_id
	claims["exp"] = time.Now().Add(time.Hour * 1).Unix() // Token valid for 1 hour

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(JWT_KEY)
}

func (uc *UserUsecase) VerifyToken(tokenString string) (*User, *string, error) {
	var JWT_KEY = []byte(os.Getenv("JWT_KEY"))

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if token.Method.Alg() != jwt.SigningMethodHS256.Alg() {
			return nil, fmt.Errorf("invalid signing method")
		}

		return JWT_KEY, nil
	})

	if err != nil {
		return nil, nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := int64(claims["user_id"].(float64))
		user, err := uc.repository.GetUserById(userID)
		if err != nil {
			return nil, nil, err
		}
		return user, &tokenString, nil
	}

	return nil, nil, fmt.Errorf("invalid token")
}

func (uc *UserUsecase) HashUserPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func (uc *UserUsecase) CompareUserPassword(password string, hash string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		return err
	}

	return nil
}
