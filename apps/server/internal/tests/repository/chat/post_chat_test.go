package chat_test

import (
	"server/internal/domain/chat"
	"server/internal/domain/user"
	dbT "server/internal/infra/db"
	"testing"

	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
)

func TestRepositorytPostChat(t *testing.T) {
	db, err := dbT.ConnectDBTest(t)
	if err != nil {
		t.Fatalf("failed to connect to postgres: %s", err)
	}

	defer db.Close()

	userRepo := user.NewUserRepository(db)
	chatRepo := chat.NewChatRepository(db)

	postSignUp := user.PostUserSignUp{
		Name:     "Test User",
		Password: "123456",
	}

	err = userRepo.SignUp(postSignUp)
	assert.NoError(t, err)

	user, err := userRepo.GetUserByName(postSignUp.Name)
	assert.NoError(t, err)
	assert.NotNil(t, user)

	postChat := chat.PostChatRequest{
		Admin_user_id: user.ID,
		Name:          "Test Chat",
		Category:      "chat",
		Description:   nil,
	}

	chat, err := chatRepo.PostChat(postChat)
	assert.NoError(t, err)
	assert.NotNil(t, chat)

	assert.Equal(t, postChat.Admin_user_id, chat.Admin_user_id)
	assert.Equal(t, postChat.Name, chat.Name)
	assert.Equal(t, postChat.Category, chat.Category)
	assert.Nil(t, chat.Description)
}
