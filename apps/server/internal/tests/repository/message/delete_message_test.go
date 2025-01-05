package message_test

import (
	"server/internal/domain/chat"
	"server/internal/domain/message"
	"server/internal/domain/user"
	dbT "server/internal/infra/db"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRepositoryDeleteMessage(t *testing.T) {
	db, err := dbT.ConnectDBTest(t)
	if err != nil {
		t.Fatalf("failed to connect to postgres: %s", err)
	}

	defer db.Close()

	userRepo := user.NewUserRepository(db)
	chatRepo := chat.NewChatRepository(db)
	messageRepo := message.NewMessageRepository(db)

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

	postMessage := message.PostMessageRequest{
		Chat_id: chat.ID,
		User_id: user.ID,
		Message: "Test Message",
	}

	message, err := messageRepo.PostMessage(postMessage)
	assert.NoError(t, err)

	err = messageRepo.DeleteMessage(message.ID)
	assert.NoError(t, err)
	assert.NotNil(t, message)
}
