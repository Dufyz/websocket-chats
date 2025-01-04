package message

import (
	"database/sql"
	"fmt"

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

func (mr *MessageRepository) GetMessageById(messageId int64) (*Message, error) {
	var message Message

	query, err := mr.connection.Prepare(`
		SELECT id, chat_id, user_id, message, created_at, updated_at
		FROM "messages"
		WHERE id = $1
	`)

	if err != nil {
		zap.L().Error("Error preparing query Message/Repository/GetMessageById", zap.Error(err))
		return nil, err
	}

	err = query.QueryRow(messageId).Scan(&message.ID, &message.Chat_id, &message.User_id, &message.Message, &message.Created_at, &message.Updated_at)
	if err != nil {
		zap.L().Error("Error querying row Message/Repository/GetMessageById", zap.Error(err))
		return nil, err
	}

	return &message, nil
}

func (mr *MessageRepository) GetMessagesByChatId(body GetMessagesRequest) (GetMessagesResponse, error) {
	var response GetMessagesResponse
	var countQuery string
	var dataQuery string
	var args []interface{}

	countQuery = `
		SELECT COUNT(*) 
		FROM "messages" 
		WHERE chat_id = $1
	`

	dataQuery = `
		SELECT id, chat_id, user_id, message, created_at, updated_at
		FROM "messages"
		WHERE chat_id = $1
	`

	args = append(args, body.Chat_id)
	argCount := 1

	if body.Cursor != nil {
		dataQuery += fmt.Sprintf(" AND id < $%d", argCount+1)
		countQuery += fmt.Sprintf(" AND id < $%d", argCount+1)
		args = append(args, *body.Cursor)
		argCount++
	}

	dataQuery += " ORDER BY id DESC"

	if body.Limit != nil {
		dataQuery += fmt.Sprintf(" LIMIT $%d", argCount+1)
		args = append(args, *body.Limit)
	} else {
		dataQuery += " LIMIT 50"
	}

	var total int64
	err := mr.connection.QueryRow(countQuery, args[:len(args)-1]...).Scan(&total)
	if err != nil {
		zap.L().Error("Error counting messages", zap.Error(err))
		return response, err
	}

	rows, err := mr.connection.Query(dataQuery, args...)
	if err != nil {
		zap.L().Error("Error querying messages", zap.Error(err))
		return response, err
	}
	defer rows.Close()

	var messages []Message
	var lastID int64

	for rows.Next() {
		var message Message
		err = rows.Scan(
			&message.ID,
			&message.Chat_id,
			&message.User_id,
			&message.Message,
			&message.Created_at,
			&message.Updated_at,
		)
		if err != nil {
			zap.L().Error("Error scanning message row", zap.Error(err))
			return response, err
		}
		messages = append(messages, message)
		lastID = message.ID
	}

	response.Messages = messages
	response.Pagination.Total = total

	if body.Cursor != nil {
		response.Pagination.Cursor = *body.Cursor
	}

	limit := 50
	if body.Limit != nil {
		limit = *body.Limit
	}

	if len(messages) == limit {
		response.Pagination.Next_cursor = &lastID
	}

	return response, nil
}

func (mr *MessageRepository) PostMessage(body PostMessageRequest) (*Message, error) {
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

func (mr *MessageRepository) PatchMessage(messageId int64, body PatchMessageRequest) (*Message, error) {
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
