package chat

import (
	"database/sql"
	"server/internal/interfaces/dto"

	"go.uber.org/zap"
)

type ChatRepository struct {
	connection *sql.DB
}

func NewChatRepository(connection *sql.DB) *ChatRepository {
	return &ChatRepository{
		connection: connection,
	}
}

func (cr *ChatRepository) GetChatById(chatId int64) (*Chat, error) {
	var chat Chat

	query, err := cr.connection.Prepare(`
		SELECT id, admin_user_id, name, category, description, created_at, updated_at
		FROM "chats"
		WHERE id = $1
	`)

	if err != nil {
		zap.L().Error("Error preparing query Chat/Repository/GetChatById", zap.Error(err))
		return nil, err
	}

	err = query.QueryRow(chatId).Scan(&chat.ID, &chat.Admin_user_id, &chat.Name, &chat.Category, &chat.Description, &chat.Created_at, &chat.Updated_at)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		zap.L().Error("Error querying row Chat/Repository/GetChatById", zap.Error(err))
		return nil, err
	}

	return &chat, nil
}

func (cr *ChatRepository) GetChatsByUserId(userId int64) ([]Chat, error) {
	var chats []Chat

	query, err := cr.connection.Prepare(`
		SELECT id, admin_user_id, name, category, description, created_at, updated_at
		FROM "chats"
		WHERE admin_user_id = $1
	`)

	if err != nil {
		zap.L().Error("Error preparing query Chat/Repository/GetChatsByUserId", zap.Error(err))
		return nil, err
	}

	rows, err := query.Query(userId)
	if err != nil {
		zap.L().Error("Error querying rows Chat/Repository/GetChatsByUserId", zap.Error(err))
		return nil, err
	}

	for rows.Next() {
		var chat Chat
		err = rows.Scan(&chat.ID, &chat.Admin_user_id, &chat.Name, &chat.Category, &chat.Description, &chat.Created_at, &chat.Updated_at)
		if err != nil {
			zap.L().Error("Error scanning rows Chat/Repository/GetChatsByUserId", zap.Error(err))
			return nil, err
		}

		chats = append(chats, chat)
	}

	return chats, nil
}

func (cr *ChatRepository) GetChats() ([]Chat, error) {
	var chats []Chat

	query, err := cr.connection.Prepare(`
		SELECT id, admin_user_id, name, category, description, created_at, updated_at
		FROM "chats"
	`)

	if err != nil {
		zap.L().Error("Error preparing query Chat/Repository/GetChats", zap.Error(err))
		return nil, err
	}

	rows, err := query.Query()
	if err != nil {
		zap.L().Error("Error querying rows Chat/Repository/GetChats", zap.Error(err))
		return nil, err
	}

	for rows.Next() {
		var chat Chat
		err = rows.Scan(&chat.ID, &chat.Admin_user_id, &chat.Name, &chat.Category, &chat.Description, &chat.Created_at, &chat.Updated_at)
		if err != nil {
			zap.L().Error("Error scanning rows Chat/Repository/GetChats", zap.Error(err))
			return nil, err
		}

		chats = append(chats, chat)
	}

	return chats, nil
}

func (cr *ChatRepository) PostChat(body dto.PostChat) (*Chat, error) {
	var chat Chat

	query, err := cr.connection.Prepare(`
		INSERT INTO "chats" (admin_user_id, name, category, description)
		VALUES ($1, $2, $3, $4)
		RETURNING id, admin_user_id, name, category, description, created_at, updated_at
	`)

	if err != nil {
		zap.L().Error("Error preparing query Chat/Repository/PostChat", zap.Error(err))
		return nil, err
	}

	err = query.QueryRow(body.Admin_user_id, body.Name, body.Category, body.Description).Scan(&chat.ID, &chat.Admin_user_id, &chat.Name, &chat.Category, &chat.Description, &chat.Created_at, &chat.Updated_at)
	if err != nil {
		zap.L().Error("Error querying row Chat/Repository/PostChat", zap.Error(err))
		return nil, err
	}

	return &chat, nil
}

func (cr *ChatRepository) PatchChat(user_id int64, body dto.PatchChat) (*Chat, error) {
	var updatedChat Chat

	tx, err := cr.connection.Begin()
	if err != nil {
		zap.L().Error("Error beginning transaction Chat/Repository/PatchChat", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback()

	err = tx.QueryRow(`
		SELECT id, admin_user_id, name, category, description, created_at, updated_at
		FROM "chats"
		WHERE id = $1
	`, user_id).Scan(
		&updatedChat.ID,
		&updatedChat.Admin_user_id,
		&updatedChat.Name,
		&updatedChat.Category,
		&updatedChat.Description,
		&updatedChat.Created_at,
		&updatedChat.Updated_at,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		zap.L().Error("Error querying user Chat/Repository/PatchChat", zap.Error(err))
		return nil, err
	}

	if body.Name != "" {
		updatedChat.Name = body.Name
	}

	if body.Category != "" {
		updatedChat.Category = body.Category
	}

	if body.Description != nil {
		updatedChat.Description = body.Description
	}

	_, err = tx.Exec(`
		UPDATE "chats"
		SET name = $1, category = $2, description = $3
		WHERE id = $4
	`, updatedChat.Name, updatedChat.Category, updatedChat.Description, updatedChat.ID,
	)

	if err != nil {
		zap.L().Error("Error updating user Chat/Repository/PatchChat", zap.Error(err))
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		zap.L().Error("Error committing transaction Chat/Repository/PatchChat", zap.Error(err))
		return nil, err
	}

	return &updatedChat, nil
}

func (cr *ChatRepository) DeleteChat(chat_id int64) error {
	query, err := cr.connection.Prepare(`
		DELETE FROM "chats"
		WHERE id = $1
	`)

	if err != nil {
		zap.L().Error("Error preparing query Chat/Repository/DeleteChat", zap.Error(err))
		return err
	}

	_, err = query.Exec(chat_id)
	if err != nil {
		zap.L().Error("Error executing query Chat/Repository/DeleteChat", zap.Error(err))
		return err
	}

	return nil
}
