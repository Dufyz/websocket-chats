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

func TestRepositorytDeleteChat(t *testing.T) {
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

	err = chatRepo.DeleteChat(chat.ID)
	assert.NoError(t, err)
	assert.NotNil(t, chat)

	chat, err = chatRepo.GetChatById(chat.ID)
	assert.Error(t, err)
	assert.Nil(t, chat)
}