-- Workers table (for displaying worker names)
CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table (for organizing tasks under labs)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_id UUID NOT NULL REFERENCES labs(id),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add project_id columns
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id);
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id);

-- Update jobs to reference workers instead of users for claimed_by
-- Keep claimed_by as UUID but we'll use workers table for names
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS claimed_by_worker_id UUID REFERENCES workers(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workers_email ON workers(email);
CREATE INDEX IF NOT EXISTS idx_projects_lab_id ON projects(lab_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_episodes_project_id ON episodes(project_id);
CREATE INDEX IF NOT EXISTS idx_jobs_project_id ON jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_jobs_claimed_by_worker ON jobs(claimed_by_worker_id);

