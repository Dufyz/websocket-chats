package message

import "server/internal/interfaces/dto"

type MessageUsecase struct {
	repository MessageRepositoryInterface
}

func NewMessageUsecase(repository MessageRepositoryInterface) MessageUsecase {
	return MessageUsecase{
		repository: repository,
	}
}

func (uc *MessageUsecase) GetMessagesByChatId(chatId int64) ([]Message, error) {
	return uc.repository.GetMessagesByChatId(chatId)
}

func (uc *MessageUsecase) PostMessage(body dto.PostMessage) (*Message, error) {
	return uc.repository.PostMessage(body)
}

func (uc *MessageUsecase) PatchMessage(messageId int64, body dto.PatchMessage) (*Message, error) {
	return uc.repository.PatchMessage(messageId, body)
}

func (uc *MessageUsecase) DeleteMessage(messageId int64) error {
	return uc.repository.DeleteMessage(messageId)
}
