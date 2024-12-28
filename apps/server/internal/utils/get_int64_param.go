package utils

import (
	"strconv"

	"github.com/labstack/echo/v4"
)

func GetInt64Param(ctx echo.Context, paramName string) (int64, string) {
	param := ctx.Param(paramName)
	if param == "" {
		return 0, paramName + " is required!"
	}

	value, err := strconv.Atoi(param)
	if err != nil {
		return 0, paramName + " needs to be an integer!"
	}

	return int64(value), ""
}
