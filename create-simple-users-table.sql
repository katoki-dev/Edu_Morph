-- Create a simple users table without foreign key constraints
-- Run this in your Supabase SQL Editor

-- Create a new table for users without foreign key constraints
CREATE TABLE IF NOT EXISTS simple_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'educator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_simple_users_email ON simple_users(email);

-- Create an index on role for filtering
CREATE INDEX IF NOT EXISTS idx_simple_users_role ON simple_users(role);

-- Disable RLS for this table (for demo purposes)
ALTER TABLE simple_users DISABLE ROW LEVEL SECURITY;

-- Insert some sample data
INSERT INTO simple_users (email, first_name, last_name, role) VALUES
('john@example.com', 'John', 'Doe', 'student'),
('jane@example.com', 'Jane', 'Smith', 'educator')
ON CONFLICT (email) DO NOTHING;
