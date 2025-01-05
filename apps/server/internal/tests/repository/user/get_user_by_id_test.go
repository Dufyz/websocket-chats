package user_test

import (
	"server/internal/domain/user"
	dbT "server/internal/infra/db"
	"testing"

	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
)

func TestRepositorytGetUserById(t *testing.T) {
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

	userByName, err := userRepo.GetUserByName(postSignUp.Name)
	assert.NoError(t, err)
	assert.NotNil(t, userByName)

	user, err := userRepo.GetUserById(userByName.ID)
	assert.NoError(t, err)
	assert.NotNil(t, user)

	assert.NotNil(t, user)
	assert.Equal(t, postSignUp.Name, user.Name)
}
