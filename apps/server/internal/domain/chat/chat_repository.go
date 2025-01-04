package chat

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"server/internal/domain/user"

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

func (cr *ChatRepository) GetChatById(chatId int64) (GetChatByIdResponse, error) {
	var response ChatWithStats
	var chat Chat
	var usersJSON []byte

	query := `
		WITH MessageStats AS (
			SELECT 
				m.chat_id,
				COUNT(DISTINCT m.user_id) as total_users,
				COUNT(m.id) as total_messages,
				jsonb_agg(
					DISTINCT jsonb_build_object(
						'id', u.id,
						'name', u.name,
						'created_at', u.created_at,
						'updated_at', u.updated_at
					)
				) as users
			FROM messages m
			JOIN users u ON m.user_id = u.id
			WHERE m.chat_id = $1
			GROUP BY m.chat_id
		)
		SELECT 
			c.id, 
			c.admin_user_id, 
			c.name, 
			c.category, 
			c.description, 
			c.created_at, 
			c.updated_at,
			COALESCE(ms.total_users, 0) as total_users,
			COALESCE(ms.total_messages, 0) as total_messages,
			COALESCE(ms.users, '[]'::jsonb) as users
		FROM chats c
		LEFT JOIN MessageStats ms ON c.id = ms.chat_id
		WHERE c.id = $1`

	err := cr.connection.QueryRow(query, chatId).Scan(
		&chat.ID,
		&chat.Admin_user_id,
		&chat.Name,
		&chat.Category,
		&chat.Description,
		&chat.Created_at,
		&chat.Updated_at,
		&response.Total_users,
		&response.Total_messages,
		&usersJSON,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return GetChatByIdResponse{}, nil
		}
		zap.L().Error("Error querying row Chat/Repository/GetChatById", zap.Error(err))
		return GetChatByIdResponse{}, err
	}

	var users []user.User
	if err = json.Unmarshal(usersJSON, &users); err != nil {
		zap.L().Error("Error unmarshaling users JSON", zap.Error(err))
		return GetChatByIdResponse{}, err
	}

	response.Chat = chat
	response.Users = users

	return response, nil
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

func (cr *ChatRepository) GetChats(body GetChatsRequest) (GetChatsResponse, error) {
	var response GetChatsResponse
	var chatStats []ChatWithStats
	var params []interface{}
	paramCount := 1

	// Set default limit if not provided
	limit := 10 // Default limit
	if body.Limit != nil && *body.Limit > 0 {
		limit = *body.Limit
	}

	// Validate cursor
	cursor := int64(0) // Default cursor
	if body.Cursor != nil {
		cursor = *body.Cursor
	}

	// Build the WHERE clause
	whereClause := "WHERE c.id > $1"
	params = append(params, cursor)
	paramCount++

	// Add search condition if search string is provided
	if body.Search != nil && *body.Search != "" {
		whereClause += fmt.Sprintf(" AND (c.name ILIKE $%d OR c.description ILIKE $%d)",
			paramCount, paramCount)
		searchTerm := "%" + *body.Search + "%"
		params = append(params, searchTerm)
		paramCount++
	}

	// Get total count for pagination with search condition
	countQuery := `SELECT COUNT(*) FROM "chats" c ` + whereClause
	err := cr.connection.QueryRow(countQuery, params...).Scan(&response.Pagination.Total)
	if err != nil {
		zap.L().Error("Error counting total chats", zap.Error(err))
		return GetChatsResponse{}, err
	}

	// Main query with pagination, search, and user statistics
	query := fmt.Sprintf(`
        WITH MessageStats AS (
            SELECT 
                m.chat_id,
                COUNT(DISTINCT m.user_id) as total_users,
                COUNT(m.id) as total_messages,
                jsonb_agg(
                    DISTINCT jsonb_build_object(
                        'id', u.id,
                        'name', u.name,
                        'created_at', u.created_at,
                        'updated_at', u.updated_at
                    )
                ) as users
            FROM messages m
            JOIN users u ON m.user_id = u.id
            GROUP BY m.chat_id
        )
        SELECT 
            c.id, 
            c.admin_user_id, 
            c.name, 
            c.category, 
            c.description, 
            c.created_at, 
            c.updated_at,
            COALESCE(ms.total_users, 0) as total_users,
            COALESCE(ms.total_messages, 0) as total_messages,
            COALESCE(ms.users, '[]'::jsonb) as users
        FROM "chats" c
        LEFT JOIN MessageStats ms ON c.id = ms.chat_id
        %s
        ORDER BY c.id
        LIMIT $%d
    `, whereClause, paramCount)

	// Add limit to params
	params = append(params, limit)

	// Execute the query
	rows, err := cr.connection.Query(query, params...)
	if err != nil {
		zap.L().Error("Error querying rows Chat/Repository/GetChats", zap.Error(err))
		return GetChatsResponse{}, err
	}
	defer rows.Close()

	var lastID int64
	for rows.Next() {
		var chatStat ChatWithStats
		var chat Chat
		var usersJSON []byte
		err = rows.Scan(
			&chat.ID,
			&chat.Admin_user_id,
			&chat.Name,
			&chat.Category,
			&chat.Description,
			&chat.Created_at,
			&chat.Updated_at,
			&chatStat.Total_users,
			&chatStat.Total_messages,
			&usersJSON,
		)
		if err != nil {
			zap.L().Error("Error scanning rows Chat/Repository/GetChats", zap.Error(err))
			return GetChatsResponse{}, err
		}

		// Parse users JSON into User structs
		var users []user.User
		if err = json.Unmarshal(usersJSON, &users); err != nil {
			zap.L().Error("Error unmarshaling users JSON", zap.Error(err))
			return GetChatsResponse{}, err
		}

		chatStat.Chat = chat
		chatStat.Users = users
		chatStats = append(chatStats, chatStat)
		lastID = chat.ID
	}

	if err = rows.Err(); err != nil {
		zap.L().Error("Error iterating rows Chat/Repository/GetChats", zap.Error(err))
		return GetChatsResponse{}, err
	}

	response.Chats = chatStats

	// Set pagination information
	response.Pagination.Cursor = cursor

	// Set next_cursor only if we have more results
	if len(chatStats) == limit {
		response.Pagination.Next_cursor = &lastID
	}

	return response, nil
}

func (cr *ChatRepository) PostChat(body PostChatRequest) (*Chat, error) {
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

func (cr *ChatRepository) PatchChat(user_id int64, body PatchChatRequest) (*Chat, error) {
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
