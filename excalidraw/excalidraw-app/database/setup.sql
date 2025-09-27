-- Create table for storing drawing backups
CREATE TABLE IF NOT EXISTS drawing_backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drawing_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_drawing_backups_user_id ON drawing_backups(user_id);

-- Create an index on updated_at for ordering
CREATE INDEX IF NOT EXISTS idx_drawing_backups_updated_at ON drawing_backups(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE drawing_backups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own backups
CREATE POLICY "Users can view their own backups" ON drawing_backups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own backups" ON drawing_backups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backups" ON drawing_backups
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backups" ON drawing_backups
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE OR REPLACE TRIGGER update_drawing_backups_updated_at
  BEFORE UPDATE ON drawing_backups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();