package db

import (
	"database/sql"
	"os"

	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"go.uber.org/zap"
)

func ConnectDB() (*sql.DB, error) {
	url := os.Getenv("DB_URL")

	db, err := sql.Open("postgres", url)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	zap.L().Info("Connected to database on port 5432")

	return db, nil
}
