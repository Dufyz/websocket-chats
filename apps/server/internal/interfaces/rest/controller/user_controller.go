package controller

import (
	"net/http"
	"server/internal/domain/user"
	"server/internal/interfaces/dto"
	"server/internal/interfaces/errors"
	"server/internal/utils"

	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
)

type userController struct {
	userUsecase user.UserUsecase
}

func NewUserController(userUsecase user.UserUsecase) userController {
	return userController{
		userUsecase: userUsecase,
	}
}

func (uc *userController) SignUp(ctx echo.Context) error {
	var body dto.PostUserSignUp
	validate := validator.New()

	if err := ctx.Bind(&body); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Invalid request body!",
		})
	}

	err := validate.Struct(body)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Validation error!",
		})
	}

	user, token, err := uc.userUsecase.SignUp(body)
	if err != nil {

		if err == errors.ErrNameUniqueViolation {
			return ctx.JSON(http.StatusConflict, map[string]interface{}{
				"message": "Name already in use!",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	if user == nil {
		return ctx.JSON(http.StatusNotFound, map[string]interface{}{
			"message": "User not found!",
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"user":  user,
		"token": token,
	})
}

func (uc *userController) SignIn(ctx echo.Context) error {
	var body dto.PostUserSignIn
	validate := validator.New()

	if err := ctx.Bind(&body); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Invalid request body!",
		})
	}

	err := validate.Struct(body)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Validation error!",
		})
	}

	user, token, err := uc.userUsecase.SignIn(body)
	if err != nil {
		if err == errors.ErrInvalidCredentials {
			return ctx.JSON(http.StatusUnauthorized, map[string]interface{}{
				"message": "Invalid credentials!",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"user":  user,
		"token": token,
	})
}

func (uc *userController) VerifyToken(ctx echo.Context) error {
	var body dto.PostUserVerifyToken
	validate := validator.New()

	if err := ctx.Bind(&body); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Invalid request body!",
		})
	}

	err := validate.Struct(body)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Validation error!",
		})
	}

	user, token, err := uc.userUsecase.VerifyToken(body.Token)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	if user == nil {
		return ctx.JSON(http.StatusNotFound, map[string]interface{}{
			"message": "User not found!",
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"user":  user,
		"token": token,
	})
}

func (uc *userController) PatchUser(ctx echo.Context) error {
	var body dto.PatchUser
	validate := validator.New()

	user_id, errorMessage := utils.GetIntParam(ctx, "id")
	if errorMessage != "" {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": errorMessage,
		})
	}

	if err := ctx.Bind(&body); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Invalid request body!",
		})
	}

	err := validate.Struct(body)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Validation error!",
		})
	}

	// TODO: Validar se o usuário que está tentando alterar é o mesmo que está logado
	user, err := uc.userUsecase.PatchUser(int64(user_id), body)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	if user == nil {
		return ctx.JSON(http.StatusNotFound, map[string]interface{}{
			"message": "User not found!",
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"user": user,
	})
}

func (uc *userController) PatchUserPassword(ctx echo.Context) error {
	var body dto.PatchUserPassword
	validate := validator.New()

	user_id, errorMessage := utils.GetIntParam(ctx, "id")
	if errorMessage != "" {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": errorMessage,
		})
	}

	if err := ctx.Bind(&body); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Invalid request body!",
		})
	}

	err := validate.Struct(body)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "Validation error!",
		})
	}

	// TODO: Validar se o usuário que está tentando alterar é o mesmo que está logado
	user, err := uc.userUsecase.PatchUserPassword(int64(user_id), body)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	if user == nil {
		return ctx.JSON(http.StatusNotFound, map[string]interface{}{
			"message": "User not found!",
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"user": user,
	})
}
