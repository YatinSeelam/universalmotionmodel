# Files to Modify/Create

## Phase 1: App Shell Layout

### New Components
- `frontend/app/components/app-shell/Sidebar.tsx` - Main sidebar component
- `frontend/app/components/app-shell/SidebarItem.tsx` - Individual sidebar item
- `frontend/app/components/app-shell/AppShell.tsx` - Shell wrapper
- `frontend/app/components/app-shell/ShellHeader.tsx` - Page header with title + actions
- `frontend/app/components/app-shell/ContentContainer.tsx` - Content wrapper

### New Layouts
- `frontend/app/work/layout.tsx` - WorkLayout wrapper for all /work/* pages
- `frontend/app/lab/layout.tsx` - LabLayout wrapper for all /lab/* pages

### Placeholder Pages (New)
- `frontend/app/work/history/page.tsx`
- `frontend/app/work/earnings/page.tsx`
- `frontend/app/work/profile/page.tsx`
- `frontend/app/lab/review/page.tsx`
- `frontend/app/lab/settings/page.tsx`

## Phase 2: Worker Pages

### Modified Pages
- `frontend/app/work/dashboard/page.tsx` - Add primary action card, redesign layout
- `frontend/app/work/queue/page.tsx` - Add sticky "Fix Next" card, convert to cards
- `frontend/app/work/jobs/[id]/page.tsx` - Always show form, auto-fill defaults

## Phase 3: Lab Pages

### Modified Pages
- `frontend/app/lab/dashboard/page.tsx` - Add primary action, health indicator, compact metrics
- `frontend/app/lab/upload/page.tsx` - Conditional fields, smart defaults, success state
- `frontend/app/lab/dataset/page.tsx` - Quality summary, bulk actions
- `frontend/app/lab/export/page.tsx` - Preview card first, collapse details

## Files to Remove/Deprecate
- `frontend/app/components/DashboardNav.tsx` - Replace with sidebar (keep for now, remove later)


