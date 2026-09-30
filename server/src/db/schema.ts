export const SCHEMA_SQL = `-- FindMate database schema
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY,
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
`;
