package routes

import (
	"database/sql"
	"server/internal/domain/user"
	"server/internal/interfaces/rest/controller"

	"github.com/labstack/echo/v4"
)

func UserRoutes(g *echo.Group, aG *echo.Group, dbConnection *sql.DB) {
	userRepository := user.NewUserRepository(dbConnection)
	userUsecase := user.NewUserUsecase(userRepository)
	userController := controller.NewUserController(userUsecase)

	g.POST("/users/sign-up", userController.SignUp)
	g.POST("/users/sign-in", userController.SignIn)
	aG.POST("/users/verify-token", userController.VerifyToken)

	aG.PATCH("/users/:id", userController.PatchUser)
	aG.PATCH("/users/:id/password", userController.PatchUserPassword)
}
