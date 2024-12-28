package errors

import "errors"

var ErrForeignKeyViolation = errors.New("foreign key violation")
var ErrNotFound = errors.New("not found")
var ErrNameUniqueViolation = errors.New("unique violation")
var ErrInvalidCredentials = errors.New("invalid credentials")
