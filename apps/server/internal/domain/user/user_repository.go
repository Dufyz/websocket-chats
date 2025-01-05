package user

import (
	"database/sql"

	"go.uber.org/zap"
)

type UserRepository struct {
	connection *sql.DB
}

func NewUserRepository(connection *sql.DB) *UserRepository {
	return &UserRepository{
		connection: connection,
	}
}

func (ur *UserRepository) SignUp(body PostUserSignUp) error {
	tx, err := ur.connection.Begin()
	defer tx.Rollback()

	if err != nil {
		zap.L().Error("Error starting transaction User/Repository/SignUp", zap.Error(err))
		return err
	}

	var userId int64
	err = tx.QueryRow(`
		INSERT INTO "users" (name, password)
		VALUES ($1, $2)
		RETURNING id
	`, body.Name, body.Password).Scan(&userId)

	if err != nil {
		zap.L().Error("Error on INSERT INTO user User/Repository/SignUp", zap.Error(err))
		return err
	}

	err = tx.Commit()
	if err != nil {
		zap.L().Error("Error committing transaction User/Repository/SignUp", zap.Error(err))
		return err
	}

	return nil
}

func (ur *UserRepository) GetUserById(userId int64) (*User, error) {
	var user User

	query, err := ur.connection.Prepare(`
		SELECT id, name, password, created_at, updated_at
		FROM "users"
		WHERE id = $1
	`)

	if err != nil {
		zap.L().Error("Error on SELECT User/Repository/GetUserById", zap.Error(err))
		return nil, err
	}

	defer query.Close()

	err = query.QueryRow(userId).Scan(
		&user.ID,
		&user.Name,
		&user.Password,
		&user.Created_at,
		&user.Updated_at,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		zap.L().Error("Error on scan row User/Repository/GetUserById", zap.Error(err))
		return nil, err
	}

	return &user, nil
}

func (ur *UserRepository) GetUserByName(name string) (*User, error) {
	var user User

	query, err := ur.connection.Prepare(`
		SELECT id, name, password, created_at, updated_at
		FROM "users"
		WHERE name = $1
	`)

	if err != nil {
		zap.L().Error("Error on SELECT User/Repository/GetUserById", zap.Error(err))
		return nil, err
	}

	defer query.Close()

	err = query.QueryRow(name).Scan(
		&user.ID,
		&user.Name,
		&user.Password,
		&user.Created_at,
		&user.Updated_at,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		zap.L().Error("Error on scan row User/Repository/GetUserById", zap.Error(err))
		return nil, err
	}

	return &user, nil
}

func (ur *UserRepository) PatchUser(userId int64, body PatchUser) (*User, error) {
	var updatedUser User

	tx, err := ur.connection.Begin()
	if err != nil {
		zap.L().Error("Error starting transaction User/Repository/PatchUser", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback()

	err = tx.QueryRow(`
		SELECT id, name, password, created_at, updated_at 
		FROM "users" 
		WHERE id = $1`, userId).Scan(
		&updatedUser.ID,
		&updatedUser.Name,
		&updatedUser.Password,
		&updatedUser.Created_at,
		&updatedUser.Updated_at,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}

		zap.L().Error("Error on QueryRow User/Repository/PatchUser", zap.Error(err))
		return nil, err
	}

	if body.Name != "" {
		updatedUser.Name = body.Name
	}

	_, err = tx.Exec(`
		UPDATE "users" 
		SET name = $1, password = $2, updated_at = now() 
		WHERE id = $3`,
		updatedUser.Name,
		updatedUser.Password,
		userId,
	)

	if err != nil {
		zap.L().Error("Error updating user User/Repository/PatchUser", zap.Error(err))
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		zap.L().Error("Error committing transaction User/Repository/PatchUser", zap.Error(err))
		return nil, err
	}

	return &updatedUser, nil
}

func (ur *UserRepository) PatchUserPassword(userId int64, password string) error {
	tx, err := ur.connection.Begin()
	if err != nil {
		zap.L().Error("Error starting transaction User/Repository/PatchUserPassword", zap.Error(err))
		return err
	}

	_, err = tx.Exec(`
		UPDATE "users"
		SET password = $1, updated_at = now()
		WHERE id = $2
	`, password, userId)

	if err != nil {
		zap.L().Error("Error updating user password User/Repository/PatchUserPassword", zap.Error(err))
		return err
	}

	err = tx.Commit()
	if err != nil {
		zap.L().Error("Error committing transaction User/Repository/PatchUserPassword", zap.Error(err))
		return err
	}

	return nil
}
