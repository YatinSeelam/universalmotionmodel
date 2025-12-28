-- Labs table
CREATE TABLE IF NOT EXISTS labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add lab_id columns
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS lab_id UUID REFERENCES labs(id);
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS lab_id UUID REFERENCES labs(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS lab_id UUID REFERENCES labs(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_lab_id ON tasks(lab_id);
CREATE INDEX IF NOT EXISTS idx_episodes_lab_id ON episodes(lab_id);
CREATE INDEX IF NOT EXISTS idx_jobs_lab_id ON jobs(lab_id);

-- Seed: Create default lab
INSERT INTO labs (id, name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Rutgers Robotics Lab')
ON CONFLICT (id) DO NOTHING;

-- Update existing data to use default lab
UPDATE tasks SET lab_id = '00000000-0000-0000-0000-000000000001' WHERE lab_id IS NULL;
UPDATE episodes SET lab_id = '00000000-0000-0000-0000-000000000001' WHERE lab_id IS NULL;
UPDATE jobs SET lab_id = '00000000-0000-0000-0000-000000000001' WHERE lab_id IS NULL;

