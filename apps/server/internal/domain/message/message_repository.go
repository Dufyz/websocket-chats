package message

import (
	"database/sql"
	"server/internal/interfaces/dto"

	"go.uber.org/zap"
)

type MessageRepository struct {
	connection *sql.DB
}

func NewMessageRepository(connection *sql.DB) *MessageRepository {
	return &MessageRepository{
		connection: connection,
	}
}

func (mr *MessageRepository) GetMessagesByChatId(chatId int64) ([]Message, error) {
	var messages []Message

	query, err := mr.connection.Prepare(`
		SELECT id, chat_id, user_id, message, created_at, updated_at
		FROM "messages"
		WHERE chat_id = $1
	`)

	if err != nil {
		zap.L().Error("Error preparing query Message/Repository/GetMessagesByChatId", zap.Error(err))
		return nil, err
	}

	rows, err := query.Query(chatId)
	if err != nil {
		zap.L().Error("Error querying rows Message/Repository/GetMessagesByChatId", zap.Error(err))
		return nil, err
	}

	for rows.Next() {
		var message Message

		err = rows.Scan(&message.ID, &message.Chat_id, &message.User_id, &message.Message, &message.Created_at, &message.Updated_at)
		if err != nil {
			zap.L().Error("Error scanning row Message/Repository/GetMessagesByChatId", zap.Error(err))
			return nil, err
		}

		messages = append(messages, message)
	}

	return messages, nil
}

func (mr *MessageRepository) PostMessage(body dto.PostMessage) (*Message, error) {
	var message Message

	query, err := mr.connection.Prepare(`
		INSERT INTO "messages" (chat_id, user_id, message)
		VALUES ($1, $2, $3)
		RETURNING id, chat_id, user_id, message, created_at, updated_at
	`)

	if err != nil {
		zap.L().Error("Error preparing query Message/Repository/PostMessage", zap.Error(err))
		return nil, err
	}

	err = query.QueryRow(body.Chat_id, body.User_id, body.Message).Scan(&message.ID, &message.Chat_id, &message.User_id, &message.Message, &message.Created_at, &message.Updated_at)
	if err != nil {
		zap.L().Error("Error querying row Message/Repository/PostMessage", zap.Error(err))
		return nil, err
	}

	return &message, nil
}

func (mr *MessageRepository) PatchMessage(messageId int64, body dto.PatchMessage) (*Message, error) {
	var message Message

	query, err := mr.connection.Prepare(`
		UPDATE "messages"
		SET message = $1
		WHERE id = $2
		RETURNING id, chat_id, user_id, message, created_at, updated_at
	`)

	if err != nil {
		zap.L().Error("Error preparing query Message/Repository/PatchMessage", zap.Error(err))
		return nil, err
	}

	err = query.QueryRow(body.Message, messageId).Scan(&message.ID, &message.Chat_id, &message.User_id, &message.Message, &message.Created_at, &message.Updated_at)
	if err != nil {
		zap.L().Error("Error querying row Message/Repository/PatchMessage", zap.Error(err))
		return nil, err
	}

	return &message, nil
}

func (mr *MessageRepository) DeleteMessage(messageId int64) error {
	query, err := mr.connection.Prepare(`
		DELETE FROM "messages"
		WHERE id = $1
	`)

	if err != nil {
		zap.L().Error("Error preparing query Message/Repository/DeleteMessage", zap.Error(err))
		return err
	}

	_, err = query.Exec(messageId)
	if err != nil {
		zap.L().Error("Error executing query Message/Repository/DeleteMessage", zap.Error(err))
		return err
	}

	return nil
}
