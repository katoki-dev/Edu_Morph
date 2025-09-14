-- Create tables for Edu-Morph platform

-- Resources table for file uploads
CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    size INTEGER NOT NULL,
    type TEXT NOT NULL,
    file_type TEXT NOT NULL,
    content TEXT NOT NULL, -- Base64 encoded file content
    uploaded_by TEXT NOT NULL,
    uploaded_by_name TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    is_public BOOLEAN DEFAULT true
);

-- Tests table for AI-generated tests
CREATE TABLE IF NOT EXISTS tests (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    time_limit INTEGER NOT NULL,
    questions TEXT NOT NULL, -- JSON string
    test_code TEXT UNIQUE,
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    status TEXT DEFAULT 'draft' -- 'draft' or 'published'
);

-- Students table for student management
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'student',
    progress INTEGER DEFAULT 0,
    last_active TIMESTAMP DEFAULT NOW(),
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Courses table for course planning
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    topics TEXT, -- JSON string
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    status TEXT DEFAULT 'active'
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies for resources table
CREATE POLICY "Resources are viewable by everyone" ON resources
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own resources" ON resources
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own resources" ON resources
    FOR UPDATE USING (uploaded_by = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own resources" ON resources
    FOR DELETE USING (uploaded_by = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policies for tests table
CREATE POLICY "Tests are viewable by everyone" ON tests
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own tests" ON tests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own tests" ON tests
    FOR UPDATE USING (created_by = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own tests" ON tests
    FOR DELETE USING (created_by = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policies for students table
CREATE POLICY "Students are viewable by their creator" ON students
    FOR SELECT USING (created_by = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert students" ON students
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own students" ON students
    FOR UPDATE USING (created_by = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own students" ON students
    FOR DELETE USING (created_by = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policies for courses table
CREATE POLICY "Courses are viewable by their creator" ON courses
    FOR SELECT USING (created_by = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert courses" ON courses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own courses" ON courses
    FOR UPDATE USING (created_by = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own courses" ON courses
    FOR DELETE USING (created_by = current_setting('request.jwt.claims', true)::json->>'sub');
