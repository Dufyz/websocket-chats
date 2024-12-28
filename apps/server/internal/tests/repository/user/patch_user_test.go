package user_test

import (
	"server/internal/domain/user"
	dbT "server/internal/infra/db"
	"server/internal/interfaces/dto"
	"testing"

	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
)

func TestRepositoryPatchUser(t *testing.T) {
	db, err := dbT.ConnectDBTest(t)
	if err != nil {
		t.Fatalf("failed to connect to postgres: %s", err)
	}

	defer dbT.TeardownDBTest(db)

	userRepo := user.NewUserRepository(db)

	postSignUp := dto.PostUserSignUp{
		Name:     "Test User",
		Password: "123456",
	}

	patchUser := dto.PatchUser{
		Name: "Test example",
	}

	err = userRepo.SignUp(postSignUp)
	assert.NoError(t, err)

	userByName, err := userRepo.GetUserByName(postSignUp.Name)
	assert.NoError(t, err)

	user, err := userRepo.PatchUser(userByName.ID, patchUser)
	assert.NoError(t, err)

	assert.NotNil(t, user)
	assert.Equal(t, patchUser.Name, user.Name)
}
