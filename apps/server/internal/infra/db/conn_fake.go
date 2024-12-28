package db

import (
	"context"
	"database/sql"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"
	"time"

	_ "github.com/lib/pq" // PostgreSQL driver
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
	"go.uber.org/zap"
)

func ConnectDBTest(t *testing.T) (*sql.DB, error) {
	ctx := context.Background()

	currentDir, _ := os.Getwd()
	migrationsDir := filepath.Join(currentDir, "..", "..", "..", "infra", "db", "migrations", "up")

	pgContainer, err := postgres.RunContainer(ctx,
		testcontainers.WithImage("postgres:15.3-alpine"),
		postgres.WithDatabase("postgres"),
		postgres.WithUsername("postgres"),
		postgres.WithPassword("postgres"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").WithOccurrence(2).WithStartupTimeout(30*time.Second),
		),
	)

	if err != nil {
		return nil, fmt.Errorf("failed to start container: %w", err)
	}

	t.Cleanup(func() {
		if err := pgContainer.Terminate(ctx); err != nil {
			t.Fatalf("Failed to terminate container: %s", err)
		}
	})

	connURL, err := pgContainer.Endpoint(ctx, "")
	if err != nil {
		t.Fatal(err)
	}

	connStr := fmt.Sprintf("postgres://postgres:postgres@%s/%s?sslmode=disable", connURL, "postgres")

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to postgres: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping postgres: %w", err)
	}

	err = applyMigrations(db, migrationsDir)
	if err != nil {
		return nil, fmt.Errorf("failed to apply migrations: %w", err)
	}

	return db, nil
}

func applyMigrations(db *sql.DB, migrationsDir string) error {
	files, err := ioutil.ReadDir(migrationsDir)
	if err != nil {
		return fmt.Errorf("failed to read migrations directory: %w", err)
	}

	for _, file := range files {
		if filepath.Ext(file.Name()) == ".sql" {
			filePath := filepath.Join(migrationsDir, file.Name())
			sqlBytes, err := ioutil.ReadFile(filePath)
			if err != nil {
				return fmt.Errorf("failed to read migration file %s: %w", file.Name(), err)
			}

			_, err = db.Exec(string(sqlBytes))
			if err != nil {
				return fmt.Errorf("failed to execute migration %s: %w", file.Name(), err)
			}
		}
	}

	return nil
}

func TeardownDBTest(db *sql.DB) {
	if err := db.Close(); err != nil {
		zap.L().Error("Error closing database", zap.Error(err))
	}
}
