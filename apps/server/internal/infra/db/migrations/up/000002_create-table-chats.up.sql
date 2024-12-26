CREATE TYPE chat_category AS ENUM (
    'chat',
    'technology',
    'games',
    'music',
    'sports',
    'art',
    'science',
    'movies',
    'books',
    'food',
    'travel',
    'photography',
    'history',
    'fashion',
    'business',
    'health',
    'nature',
    'education',
    'politics',
    'religion'
);

CREATE TABLE chats (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    admin_user_id BIGINT REFERENCES users(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category chat_category NOT NULL DEFAULT 'chat',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);