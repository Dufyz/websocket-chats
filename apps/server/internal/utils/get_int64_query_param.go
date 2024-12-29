package utils

import (
	"strconv"

	"github.com/labstack/echo/v4"
)

func GetInt64QueryParam(ctx echo.Context, queryName string) (int64, string) {
	query := ctx.QueryParam(queryName)
	if query == "" {
		return 0, queryName + " is required!"
	}

	value, err := strconv.Atoi(query)
	if err != nil {
		return 0, queryName + " must be a valid integer!"
	}

	return int64(value), ""
}
