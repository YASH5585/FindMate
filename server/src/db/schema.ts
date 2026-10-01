export const SCHEMA_SQL = `-- FindMate database schema
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('lost', 'found')),
    category TEXT NOT NULL CHECK (category IN ('electronics', 'id-card', 'bags', 'books', 'accessories', 'clothing', 'other')),
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    date DATE NOT NULL,
    image TEXT,
    reporter_name TEXT NOT NULL,
    contact TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);

CREATE TABLE IF NOT EXISTS contact_requests (
    id UUID PRIMARY KEY,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL CHECK (message <> ''),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_not_self_contact CHECK (sender_id <> receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_item_id ON contact_requests(item_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_sender_id ON contact_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_receiver_id ON contact_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_requests_owner_pending ON contact_requests(receiver_id, status) WHERE status = 'pending';

-- connect-pg-simple session store table
CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR(255) PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_session_expire ON session(expire);
`;
