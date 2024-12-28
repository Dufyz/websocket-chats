package chat_test

import (
	"server/internal/domain/chat"
	"server/internal/domain/user"
	dbT "server/internal/infra/db"
	"server/internal/interfaces/dto"
	"testing"

	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
)

func TestRepositorytGetChatByUserId(t *testing.T) {
	db, err := dbT.ConnectDBTest(t)
	if err != nil {
		t.Fatalf("failed to connect to postgres: %s", err)
	}

	defer db.Close()

	userRepo := user.NewUserRepository(db)
	chatRepo := chat.NewChatRepository(db)

	postSignUp := dto.PostUserSignUp{
		Name:     "Test User",
		Password: "123456",
	}

	err = userRepo.SignUp(postSignUp)
	assert.NoError(t, err)

	user, err := userRepo.GetUserByName(postSignUp.Name)
	assert.NoError(t, err)
	assert.NotNil(t, user)

	postChat := dto.PostChat{
		Admin_user_id: user.ID,
		Name:          "Test Chat",
		Category:      "chat",
		Description:   nil,
	}

	chat, err := chatRepo.PostChat(postChat)
	assert.NoError(t, err)
	assert.NotNil(t, chat)

	chats, err := chatRepo.GetChatsByUserId(user.ID)
	assert.NoError(t, err)
	assert.NotNil(t, chat)

	assert.Equal(t, postChat.Admin_user_id, chats[0].Admin_user_id)
	assert.Equal(t, postChat.Name, chats[0].Name)
	assert.Equal(t, postChat.Category, chats[0].Category)
	assert.Nil(t, chats[0].Description)
}
