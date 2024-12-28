package user_test

import (
	"server/internal/domain/user"
	dbT "server/internal/infra/db"
	"server/internal/interfaces/dto"
	"testing"

	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
)

func TestRepositoryPatchUserPassword(t *testing.T) {
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

	err = userRepo.SignUp(postSignUp)
	assert.NoError(t, err)

	userByName, err := userRepo.GetUserByName(postSignUp.Name)
	assert.NoError(t, err)

	patchUser := dto.PatchUserPassword{
		ID:           userByName.ID,
		New_password: "1234567",
	}

	err = userRepo.PatchUserPassword(patchUser.ID, patchUser.New_password)
	assert.NoError(t, err)

	user, err := userRepo.GetUserByName(postSignUp.Name)
	assert.NoError(t, err)

	assert.NotNil(t, user)
	assert.Equal(t, postSignUp.Name, user.Name)
	assert.Equal(t, patchUser.New_password, user.Password)
	assert.NotEqual(t, postSignUp.Password, user.Password)
}
