/*
  # Initial LifeOS Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `priority` (text: low, medium, high)
      - `status` (text: todo, inprogress, review, done)
      - `due_date` (timestamp)
      - `assignee` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `content` (text)
      - `tags` (text array)
      - `starred` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `habits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `target_days_per_week` (integer)
      - `color` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `habit_entries`
      - `id` (uuid, primary key)
      - `habit_id` (uuid, foreign key)
      - `date` (date)
      - `completed` (boolean)
      - `created_at` (timestamp)
    
    - `reflections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `date` (date)
      - `mood` (text: great, good, okay, difficult)
      - `energy_level` (integer)
      - `gratitude` (text array)
      - `wins` (text array)
      - `challenges` (text array)
      - `tomorrow_focus` (text array)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `calendar_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `location` (text)
      - `color` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text DEFAULT 'todo' CHECK (status IN ('todo', 'inprogress', 'review', 'done')),
  due_date timestamptz,
  assignee text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text DEFAULT '',
  tags text[] DEFAULT '{}',
  starred boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  target_days_per_week integer DEFAULT 7 CHECK (target_days_per_week >= 1 AND target_days_per_week <= 7),
  color text DEFAULT 'from-blue-400 to-cyan-500',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create habit_entries table
CREATE TABLE IF NOT EXISTS habit_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, date)
);

-- Create reflections table
CREATE TABLE IF NOT EXISTS reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  mood text DEFAULT 'good' CHECK (mood IN ('great', 'good', 'okay', 'difficult')),
  energy_level integer DEFAULT 5 CHECK (energy_level >= 1 AND energy_level <= 10),
  gratitude text[] DEFAULT '{}',
  wins text[] DEFAULT '{}',
  challenges text[] DEFAULT '{}',
  tomorrow_focus text[] DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  location text,
  color text DEFAULT 'from-blue-400 to-cyan-400',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for tasks table
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for notes table
CREATE POLICY "Users can read own notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for habits table
CREATE POLICY "Users can read own habits"
  ON habits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for habit_entries table
CREATE POLICY "Users can read own habit entries"
  ON habit_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_entries.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own habit entries"
  ON habit_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_entries.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own habit entries"
  ON habit_entries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_entries.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own habit entries"
  ON habit_entries
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_entries.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

-- Create policies for reflections table
CREATE POLICY "Users can read own reflections"
  ON reflections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
  ON reflections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections"
  ON reflections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections"
  ON reflections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for calendar_events table
CREATE POLICY "Users can read own calendar events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendar events"
  ON calendar_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar events"
  ON calendar_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar events"
  ON calendar_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reflections_updated_at BEFORE UPDATE ON reflections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();