package chat

import (
	"server/internal/interfaces/dto"
)

type ChatUsecase struct {
	repository ChatRepositoryInterface
}

func NewChatUsecase(repository ChatRepositoryInterface) ChatUsecase {
	return ChatUsecase{
		repository: repository,
	}
}

func (uc *ChatUsecase) GetChatById(chatId int64) (*Chat, error) {
	return uc.repository.GetChatById(chatId)
}

func (uc *ChatUsecase) GetChatsByUserId(userId int64) ([]Chat, error) {
	return uc.repository.GetChatsByUserId(userId)
}

func (uc *ChatUsecase) GetChats() ([]Chat, error) {
	return uc.repository.GetChats()
}

func (uc *ChatUsecase) PostChat(body dto.PostChat) (*Chat, error) {
	return uc.repository.PostChat(body)
}

func (uc *ChatUsecase) PatchChat(chatId int64, body dto.PatchChat) (*Chat, error) {
	return uc.repository.PatchChat(chatId, body)
}

func (uc *ChatUsecase) DeleteChat(chatId int64) error {
	return uc.repository.DeleteChat(chatId)
}
