package message

type MessageUsecase struct {
	repository MessageRepositoryInterface
}

func NewMessageUsecase(repository MessageRepositoryInterface) MessageUsecase {
	return MessageUsecase{
		repository: repository,
	}
}

func (uc *MessageUsecase) GetMessagesByChatId(body GetMessagesRequest) (GetMessagesResponse, error) {
	return uc.repository.GetMessagesByChatId(body)
}

func (uc *MessageUsecase) PostMessage(body PostMessageRequest) (*Message, error) {
	return uc.repository.PostMessage(body)
}

func (uc *MessageUsecase) PatchMessage(messageId int64, body PatchMessageRequest) (*Message, error) {
	return uc.repository.PatchMessage(messageId, body)
}

func (uc *MessageUsecase) DeleteMessage(messageId int64) error {
	return uc.repository.DeleteMessage(messageId)
}
