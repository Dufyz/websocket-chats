package user_test

import (
	"server/internal/domain/user"
	dbT "server/internal/infra/db"
	"testing"

	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
)

func TestRepositorytGetUserByName(t *testing.T) {
	db, err := dbT.ConnectDBTest(t)
	if err != nil {
		t.Fatalf("failed to connect to postgres: %s", err)
	}

	defer db.Close()

	userRepo := user.NewUserRepository(db)

	postSignUp := user.PostUserSignUp{
		Name:     "Test User",
		Password: "123456",
	}

	err = userRepo.SignUp(postSignUp)
	assert.NoError(t, err)

	user, err := userRepo.GetUserByName(postSignUp.Name)
	assert.NoError(t, err)
	assert.NotNil(t, user)

	assert.NotNil(t, user)
	assert.Equal(t, postSignUp.Name, user.Name)
}
