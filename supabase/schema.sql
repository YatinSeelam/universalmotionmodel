-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Episodes table
CREATE TABLE IF NOT EXISTS episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id TEXT NOT NULL REFERENCES tasks(id),
    uploader_user_id UUID REFERENCES users(id),
    storage_path TEXT NOT NULL,
    video_path TEXT,
    success BOOLEAN NOT NULL,
    failure_reason TEXT,
    failure_time_sec FLOAT,
    hz INT NOT NULL,
    steps INT NOT NULL,
    duration_sec FLOAT NOT NULL,
    edge_case BOOLEAN NOT NULL DEFAULT FALSE,
    quality_score INT NOT NULL DEFAULT 0,
    accepted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id TEXT NOT NULL REFERENCES tasks(id),
    episode_id UUID NOT NULL REFERENCES episodes(id),
    status TEXT NOT NULL CHECK (status IN ('open', 'claimed', 'submitted', 'accepted', 'rejected')),
    claimed_by UUID REFERENCES users(id),
    fix_episode_id UUID REFERENCES episodes(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_episodes_task_id ON episodes(task_id);
CREATE INDEX IF NOT EXISTS idx_episodes_edge_case ON episodes(edge_case);
CREATE INDEX IF NOT EXISTS idx_episodes_accepted ON episodes(accepted);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_task_id ON jobs(task_id);
CREATE INDEX IF NOT EXISTS idx_jobs_episode_id ON jobs(episode_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

