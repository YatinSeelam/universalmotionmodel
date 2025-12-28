-- Reset and Seed Demo Data
-- This script truncates all data and seeds realistic demo data
-- DO NOT run this in production!

-- Step 1: Disable foreign key checks temporarily (PostgreSQL doesn't support this directly)
-- Instead, we'll truncate in the correct order with CASCADE

-- Step 2: Truncate tables in correct order (CASCADE handles foreign keys)
-- Note: This will be executed by Python script using direct DELETE statements
-- TRUNCATE CASCADE is safer but requires proper permissions

-- Note: Storage objects must be deleted via Storage API (handled in Python script)

-- Step 3: Seed Labs (3 labs)
INSERT INTO labs (id, name, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Rutgers Robotics Lab', NOW() - INTERVAL '30 days'),
('22222222-2222-2222-2222-222222222222', 'Princeton Manipulation Group', NOW() - INTERVAL '25 days'),
('33333333-3333-3333-3333-333333333333', 'Columbia Medical Robotics', NOW() - INTERVAL '20 days');

-- Step 4: Seed Projects (2 per lab = 6 projects)
INSERT INTO projects (id, lab_id, name, description, created_at) VALUES
-- Rutgers projects
('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Reflective Object Grasping', 'Grasping reflective and transparent objects', NOW() - INTERVAL '28 days'),
('p1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Bin Picking v1', 'Random bin picking with clutter', NOW() - INTERVAL '27 days'),
-- Princeton projects
('p2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Peg In Hole', 'Precision peg insertion tasks', NOW() - INTERVAL '23 days'),
('p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Precision Placement', 'High-precision object placement', NOW() - INTERVAL '22 days'),
-- Columbia projects
('p3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Surgical Tool Handoff', 'Handoff tasks in surgical scenarios', NOW() - INTERVAL '18 days'),
('p3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'Endoscope Pose Hold', 'Maintaining endoscope pose stability', NOW() - INTERVAL '17 days');

-- Step 5: Seed Workers (5 workers)
INSERT INTO workers (id, name, email, created_at) VALUES
('w1111111-1111-1111-1111-111111111111', 'Ava Chen', 'ava.chen@example.com', NOW() - INTERVAL '15 days'),
('w2222222-2222-2222-2222-222222222222', 'Mateo Rivera', 'mateo.rivera@example.com', NOW() - INTERVAL '14 days'),
('w3333333-3333-3333-3333-333333333333', 'Noor Patel', 'noor.patel@example.com', NOW() - INTERVAL '13 days'),
('w4444444-4444-4444-4444-444444444444', 'Ethan Park', 'ethan.park@example.com', NOW() - INTERVAL '12 days'),
('w5555555-5555-5555-5555-555555555555', 'Sofia Martinez', 'sofia.martinez@example.com', NOW() - INTERVAL '11 days');

-- Step 6: Seed Tasks (6 tasks, one per project)
INSERT INTO tasks (id, name, description, lab_id, project_id, created_at) VALUES
('pick_reflective_v1', 'Reflective Object Grasp', 'Grasp reflective objects', '11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '26 days'),
('pick_bin_v1', 'Bin Picking', 'Random bin picking', '11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', NOW() - INTERVAL '25 days'),
('peg_v1', 'Peg In Hole', 'Precision peg insertion', '22222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222221', NOW() - INTERVAL '21 days'),
('place_precise_v1', 'Precision Placement', 'High-precision placement', '22222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '20 days'),
('tool_handoff_v1', 'Surgical Tool Handoff', 'Tool handoff in surgery', '33333333-3333-3333-3333-333333333333', 'p3333333-3333-3333-3333-333333333331', NOW() - INTERVAL '16 days'),
('pose_hold_v1', 'Endoscope Pose Hold', 'Maintain endoscope pose', '33333333-3333-3333-3333-333333333333', 'p3333333-3333-3333-3333-333333333332', NOW() - INTERVAL '15 days');

-- Episodes and Jobs will be seeded by Python script (to handle storage uploads)
-- This SQL file only handles the database structure

