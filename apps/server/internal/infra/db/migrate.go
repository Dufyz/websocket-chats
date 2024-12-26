package db

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"go.uber.org/zap"
)

func MigrateDb() {
	cwd, err := os.Getwd()
	if err != nil {
		zap.L().Fatal("Erro ao obter o diretório de trabalho atual", zap.Error(err))
	}

	relativeMigrationsPath := "../internal/infra/db/migrations/up"
	migrationsPath := filepath.Join(cwd, relativeMigrationsPath)

	if runtime.GOOS == "windows" {
		migrationsPath = strings.ReplaceAll(migrationsPath, "\\", "/")
	}

	if _, err := os.Stat(migrationsPath); os.IsNotExist(err) {
		zap.L().Fatal("O caminho das migrations não existe", zap.Error(err))
	}

	migrationsURL := fmt.Sprintf("file://%s", migrationsPath)
	dbURL := os.Getenv("DB_URL")

	m, err := migrate.New(migrationsURL, dbURL)
	if err != nil {
		zap.L().Fatal("Erro ao criar a migração", zap.Error(err))
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		zap.L().Fatal("Erro ao rodar a migração", zap.Error(err))
	}

	zap.L().Info("Migrações executadas com sucesso!")
}
