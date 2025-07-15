-- Check if database exists and create if it doesn't
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'todoapp'
   ) THEN
      CREATE DATABASE todoapp;
   END IF;
END
$do$;

\c todoapp;

-- Create todos table if it doesn't exist
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE
    ON todos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO todos (text, completed) VALUES
('Learn Docker fundamentals', false),
('Set up containerized development environment', false),
('Implement Docker Compose orchestration', false);