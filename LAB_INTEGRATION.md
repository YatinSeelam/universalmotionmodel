# Lab Integration Guide

## How Labs Integrate with Robot Motion Data Platform

This document outlines the integration contract for research labs to use our platform for managing robot motion data, detecting edge cases, and building high-quality datasets.

---

## What Labs Upload

Labs upload **episodes** (robot run data) in a simple format:

### Required Files
- **meta.json** - Episode metadata (JSON)
- **video.mp4** - Optional video recording of the episode

### Episode Format

Each episode is a single robot run. Upload via:
- **API**: `POST /api/episodes/upload` (multipart form: `meta_json` + `video`)
- **Web UI**: Navigate to `/upload` and submit files

---

## Required Fields in meta.json

```json
{
  "task_id": "pick_v1",           // Task identifier (must exist in system)
  "hz": 20,                        // Control frequency (int)
  "steps": 200,                    // Number of control steps (int)
  "duration_sec": 10.0,           // Episode duration in seconds (float)
  "success": false,                // Whether episode succeeded (boolean)
  "failure_reason": "slip_after_grasp",  // Optional: reason for failure (string)
  "failure_time_sec": 8.2          // Optional: time when failure occurred (float)
}
```

### Field Descriptions

- **task_id**: Identifies which task/experiment this episode belongs to. Must match a task in the system.
- **hz**: Control loop frequency (e.g., 20Hz, 30Hz)
- **steps**: Total number of control steps executed
- **duration_sec**: Total duration of the episode
- **success**: `true` if episode completed successfully, `false` otherwise
- **failure_reason**: Human-readable reason for failure (e.g., "slip_after_grasp", "missed_grasp", "timeout", "collision_spike")
- **failure_time_sec**: Timestamp (in seconds) when failure occurred, if applicable

---

## What Labs Get Back

### 1. Automatic Edge Case Detection

The platform automatically detects edge cases using these rules:
- Episode has `success: false`
- Episode duration exceeds 20 seconds
- Episode has a `failure_reason` specified

Edge cases are automatically added to the **Fix Queue** for human review and fixes.

### 2. Quality Control (QC) Scoring

Each episode receives a **quality_score** (0-100) based on:
- Base score: 50
- +30 if `success: true`
- -20 if `duration_sec > 15`
- -10 if `failure_reason` is present

### 3. Acceptance Criteria

Episodes are automatically marked as **accepted** if:
- `success == true` AND
- `duration_sec <= 20`

Fixes are accepted if:
- `success == true` AND
- `duration_sec <= 10`

### 4. Fix Queue Management

- Edge cases appear in the Fix Queue (`/jobs`)
- Workers can claim jobs, watch replays, and submit fixes
- Fixes are automatically QC'd and marked accepted/rejected

### 5. Dataset Export

Labs can export curated datasets:
- **Endpoint**: `GET /api/export?task_id={task_id}`
- **Format**: ZIP file containing:
  - All accepted episodes (meta.json + video.mp4)
  - All accepted fixes (meta.json + video.mp4)
  - `manifest.json` with metadata

### 6. Dataset Reports

Before export, labs see a **Dataset Report** with:
- Total episodes uploaded
- Edge cases detected
- Fixes submitted and accepted
- Acceptance rate
- Average quality score
- Top failure reasons

---

## Integration Workflow

1. **Setup**: Create a task in the system (or use existing task_id)
2. **Upload**: Upload episodes via API or web UI
3. **Auto-Processing**: Platform detects edge cases and creates jobs
4. **Fix Queue**: Workers review failures and submit fixes
5. **Export**: Download curated dataset with accepted episodes + fixes

---

## API Endpoints

### Upload Episode
```
POST /api/episodes/upload
Content-Type: multipart/form-data

Fields:
- meta_json: JSON string of episode metadata
- video: (optional) video file (mp4)
```

### List Jobs
```
GET /api/jobs?status=open
Returns: List of open edge case jobs
```

### Get Job Details
```
GET /api/jobs/{job_id}
Returns: Job details with signed video URL
```

### Submit Fix
```
POST /api/jobs/{job_id}/submit_fix
Content-Type: multipart/form-data

Fields:
- meta_json: JSON string of fix episode metadata
- video: (optional) video file (mp4)
```

### Export Dataset
```
GET /api/export?task_id={task_id}
Returns: ZIP file download
```

### Dataset Statistics
```
GET /api/dataset/stats?task_id={task_id}
Returns: Dataset report statistics
```

---

## Benefits for Labs

1. **Automated Edge Case Detection**: No manual review needed to find failures
2. **Quality Control**: Automatic scoring and acceptance criteria
3. **Human-in-the-Loop Fixes**: Workers can fix failures to improve dataset quality
4. **Curated Datasets**: Export only high-quality, accepted episodes
5. **Failure Analysis**: Track failure reasons and patterns
6. **Scalable**: Handle thousands of episodes with minimal manual work

---

## Support

For integration questions or issues:
- Check API documentation at `/api/docs` (FastAPI auto-generated)
- Review example episodes in the seed data
- Contact platform administrators

---

**Version**: 1.0  
**Last Updated**: December 2025

