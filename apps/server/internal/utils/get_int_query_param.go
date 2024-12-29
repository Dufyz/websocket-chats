package utils

import (
	"strconv"

	"github.com/labstack/echo/v4"
)

func GetIntQueryParam(ctx echo.Context, queryName string) (int, string) {
	query := ctx.QueryParam(queryName)
	if query == "" {
		return 0, queryName + " is required!"
	}

	value, err := strconv.Atoi(query)
	if err != nil {
		return 0, queryName + " must be a valid integer!"
	}

	return value, ""
}
