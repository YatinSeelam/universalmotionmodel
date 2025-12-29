# 🎨 UI/UX Redesign Proposal — Internal App Simplification

## Executive Summary

This proposal outlines a complete redesign of the **internal authenticated pages** (`/work/*` and `/lab/*`) to:
- Replace flat top navigation with a **left sidebar**
- Add clear **primary actions** to every page
- Reduce cognitive load through **better information hierarchy**
- Optimize for **speed and repetition** (key workflows)
- Maintain **light mode** and match **landing page theme**

**Landing page (`/`, `/how`, `/waitlist`, etc.) remains 100% unchanged.**

---

## 🎯 Design Principles

### Visual System (Matches Landing Page)
- **Colors**: Soft slate grays, purple accent (`#8350e8`), minimal color usage
- **Typography**: `Archivo` for headings, `Rethink Sans` for body
- **Spacing**: Generous padding, rounded corners (`rounded-lg`), soft borders
- **Mode**: Light mode only (no dark mode)
- **Style**: Clean, minimal, tool-focused (not marketing-focused)

### UX Principles
1. **One primary action per page** — answer "What should I do here?"
2. **Progressive disclosure** — show what matters first, hide details
3. **Keyboard-friendly** — support common shortcuts
4. **Visual hierarchy** — use size, color, and spacing to guide attention
5. **Speed over beauty** — optimize for repeated tasks

---

## 📐 New Layout Structure

### Sidebar Navigation (Left Side)

**Width**: 240px (collapsible to 64px icon-only)
**Position**: Fixed left, full height
**Background**: White with subtle border-right
**Active State**: Purple accent background + left border indicator

#### Worker Sidebar Structure
```
┌─────────────────────────┐
│  Work Portal            │
├─────────────────────────┤
│ 🏠 Dashboard            │
│ 📋 Work Queue           │
│ ✅ History              │
│ 💰 Earnings             │
│ ⚙️  Profile             │
└─────────────────────────┘
```

#### Lab Sidebar Structure
```
┌─────────────────────────┐
│  Lab Portal              │
├─────────────────────────┤
│ 📊 Overview             │
│ ⬆️  Upload Episode       │
│ 📁 Dataset               │
│ 🔍 Review / Fixes        │
│ 📦 Export                │
│ ⚙️  Settings             │
└─────────────────────────┘
```

**Sidebar Features**:
- Icon + label (icons from Heroicons or similar)
- Active state: purple background (`bg-[#8350e8]/10`) + left border (`border-l-2 border-[#8350e8]`)
- Hover state: subtle gray background
- Collapsible (icon-only mode for power users)
- User info at bottom (optional)

---

## 📄 Page-by-Page Redesign

### 🔹 WORKER PORTAL

---

#### 1. `/work/dashboard` — Worker Dashboard

**Current Problems**:
- Too empty, feels like a stats page
- No clear next action
- Stats don't guide behavior

**New Structure**:

```
┌─────────────────────────────────────────────┐
│  Dashboard                                  │
│  Track your performance and earnings        │
├─────────────────────────────────────────────┤
│                                             │
│  [PRIMARY ACTION CARD]                      │
│  ┌─────────────────────────────────────┐   │
│  │  🎯 Start Fixing                    │   │
│  │  {X} jobs available in queue        │   │
│  │  [View Queue →]                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [QUICK STATS - 3 Cards]                  │
│  ┌──────┐  ┌──────┐  ┌──────┐            │
│  │ $24  │  │  92  │  │  47  │            │
│  │Today │  │Score │  │Done  │            │
│  └──────┘  └──────┘  └──────┘            │
│                                             │
│  [RECENT ACTIVITY - Collapsible]           │
│  Last 5 completed tasks...                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Changes**:
- **Primary CTA**: Large, prominent "Start Fixing" card with job count
- **Stats**: Smaller, secondary cards (still visible but not dominant)
- **Recent Activity**: Collapsible section (hidden by default)
- **Visual Hierarchy**: Primary action is 2x larger than stats

**Why Simpler**:
- Immediately answers "What should I do?" → Start fixing
- Reduces visual noise (stats are smaller)
- One-click to queue (primary action)

---

#### 2. `/work/queue` — Fix Queue

**Current Problems**:
- Too many rows, hard to scan
- Status is visually weak
- No prioritization
- Filters take up space

**New Structure**:

```
┌─────────────────────────────────────────────┐
│  Work Queue                                 │
│  Fix robot failures and earn                │
├─────────────────────────────────────────────┤
│                                             │
│  [FILTERS - Collapsible]                    │
│  Lab | Task | Failure Reason  [Clear]      │
│                                             │
│  [PRIMARY ACTION - Sticky Top]              │
│  ┌─────────────────────────────────────┐   │
│  │  ⚡ Fix Next Episode                 │   │
│  │  {Next job preview}                  │   │
│  │  [Start Fixing →]                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [JOB CARDS - Prioritized]                 │
│  ┌─────────────────────────────────────┐   │
│  │  🔴 OPEN  |  Lab: Rutgers           │   │
│  │  Task: pick_and_place               │   │
│  │  Failed: slip_after_grasp @ 8.2s    │   │
│  │  [Fix]                               │   │
│  └─────────────────────────────────────┘   │
│  ... (sorted by priority)                   │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Changes**:
- **Sticky Primary Action**: "Fix Next Episode" card at top (always visible)
- **Status Badges**: Larger, color-coded, left-aligned
- **Job Cards**: Card-based layout (not table rows)
- **Priority Sorting**: Open → Claimed → Submitted (by default)
- **Filters**: Collapsible by default (expand when needed)
- **Visual Hierarchy**: Next job is highlighted, others are secondary

**Why Simpler**:
- Clear next action (sticky card)
- Easier to scan (cards vs rows)
- Better status visibility (badges are prominent)
- Less scrolling (filters collapse)

---

#### 3. `/work/jobs/[id]` — Job Detail

**Current Problems**:
- Form is hidden behind toggle
- No clear workflow
- Too many clicks to submit

**New Structure**:

```
┌─────────────────────────────────────────────┐
│  ← Back to Queue                            │
│  Job Detail                                 │
├─────────────────────────────────────────────┤
│                                             │
│  [VIDEO PLAYER - Large]                     │
│  ┌─────────────────────────────────────┐   │
│  │  [Video with failure marker]        │   │
│  │  [Jump to Failure]                  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [FAILURE INFO - Compact]                  │
│  Reason: slip_after_grasp                  │
│  Time: 8.2s | Duration: 12.5s              │
│                                             │
│  [FIX FORM - Always Visible]                │
│  ┌─────────────────────────────────────┐   │
│  │  Duration (s): [8.2]                │   │
│  │  Frequency (Hz): [20]                │   │
│  │  Steps: 164 (auto)                  │   │
│  │  Video: [Upload]                    │   │
│  │  [Submit Fix] ← PRIMARY              │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Changes**:
- **Form Always Visible**: No toggle, form is always shown
- **Auto-fill Defaults**: Pre-fill duration/frequency from original episode
- **Primary Button**: Large, prominent "Submit Fix" button
- **Keyboard Shortcuts**: Enter to submit, Esc to cancel
- **Visual Flow**: Video → Info → Form (top to bottom)

**Why Simpler**:
- One less click (no toggle)
- Faster submission (auto-filled defaults)
- Clear workflow (video → fix → submit)

---

#### 4. `/work/history` — History (NEW PAGE)

**Purpose**: View completed tasks, earnings breakdown, quality trends

**Structure**:

```
┌─────────────────────────────────────────────┐
│  History                                    │
│  View your completed work                   │
├─────────────────────────────────────────────┤
│                                             │
│  [FILTERS]                                  │
│  Date Range | Status | Task                │
│                                             │
│  [COMPLETED TASKS TABLE]                    │
│  Date | Task | Status | Quality | Earnings │
│  ...                                        │
│                                             │
│  [EARNINGS SUMMARY]                         │
│  This Week: $X | This Month: $Y            │
│                                             │
└─────────────────────────────────────────────┘
```

---

#### 5. `/work/earnings` — Earnings (NEW PAGE)

**Purpose**: Detailed earnings breakdown, payment history

**Structure**:

```
┌─────────────────────────────────────────────┐
│  Earnings                                   │
│  Track your payments                        │
├─────────────────────────────────────────────┤
│                                             │
│  [EARNINGS OVERVIEW]                        │
│  ┌──────┐  ┌──────┐  ┌──────┐            │
│  │ $X   │  │ $Y   │  │ $Z   │            │
│  │Today │  │Week  │  │Month │            │
│  └──────┘  └──────┘  └──────┘            │
│                                             │
│  [PAYMENT HISTORY]                          │
│  Date | Amount | Status | Method           │
│  ...                                        │
│                                             │
│  [QUALITY SCORE TREND]                      │
│  [Chart showing quality over time]          │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 🔹 LAB PORTAL

---

#### 1. `/lab/dashboard` — Lab Overview

**Current Problems**:
- Too many numbers at once
- No hierarchy
- Hard to answer "Is my dataset healthy?"

**New Structure**:

```
┌─────────────────────────────────────────────┐
│  Overview                                   │
│  Monitor your dataset health                │
├─────────────────────────────────────────────┤
│                                             │
│  [PRIMARY ACTION]                           │
│  ┌─────────────────────────────────────┐   │
│  │  ⬆️  Upload Episode                   │   │
│  │  Add a new robot run                 │   │
│  │  [Upload Now →]                      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [HEALTH INDICATOR]                         │
│  ┌─────────────────────────────────────┐   │
│  │  Dataset Health: 🟢 Good             │   │
│  │  {Acceptance rate, quality, etc.}    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [KEY METRICS - 4 Cards]                   │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │ 150  │  │  45  │  │  92% │  │  34s │  │
│  │Total │  │Edge  │  │Accept│  │AvgFix│  │
│  └──────┘  └──────┘  └──────┘  └──────┘  │
│                                             │
│  [PIPELINE STATUS - Compact]                │
│  Uploaded: 12 | In Review: 5 | Done: 133  │
│                                             │
│  [RECENT ACTIVITY - Collapsible]           │
│  Last 5 uploads...                          │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Changes**:
- **Primary Action**: "Upload Episode" card (most common task)
- **Health Indicator**: Single "Dataset Health" card (green/yellow/red)
- **Metrics**: Reduced to 4 key numbers (not 5)
- **Pipeline**: Compact horizontal bar (not 5 cards)
- **Recent Activity**: Collapsible (hidden by default)

**Why Simpler**:
- Clear primary action (upload)
- Health at a glance (one indicator)
- Less visual noise (fewer cards)
- Faster to understand (hierarchy)

---

#### 2. `/lab/upload` — Upload Episode

**Current Problems**:
- Feels dense
- No guidance
- Not optimized for repeated uploads

**New Structure**:

```
┌─────────────────────────────────────────────┐
│  Upload Episode                             │
│  Add a new robot run                       │
├─────────────────────────────────────────────┤
│                                             │
│  [QUICK UPLOAD - Primary]                  │
│  ┌─────────────────────────────────────┐   │
│  │  Task: [Dropdown]                   │   │
│  │  Success: ☑ Episode succeeded        │   │
│  │  Duration: [10.0] s                  │   │
│  │  Frequency: [20] Hz                   │   │
│  │  Steps: 200 (auto)                  │   │
│  │  Video: [Upload]                     │   │
│  │  [Upload Episode] ← PRIMARY          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [FAILURE DETAILS - Conditional]            │
│  (Only shown if success = false)            │
│  Reason: [Dropdown]                        │
│  Failure Time: [8.2] s                     │
│                                             │
│  [SUCCESS STATE]                            │
│  ✓ Episode uploaded! Job created: #123     │
│  [Upload Another] [View Queue]             │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Changes**:
- **Smart Defaults**: Pre-fill last used values
- **Conditional Fields**: Failure fields only show when needed
- **Success State**: Clear confirmation with "Upload Another" button
- **Keyboard Shortcuts**: Tab through fields, Enter to submit
- **Visual Flow**: Essential fields first, optional last

**Why Simpler**:
- Faster for repeated uploads (defaults)
- Less cognitive load (conditional fields)
- Clear feedback (success state)
- Keyboard-friendly (tab navigation)

---

#### 3. `/lab/dataset` — Dataset View

**Current Problems**:
- Feels like raw logs
- Hard to understand quality at a glance

**New Structure**:

```
┌─────────────────────────────────────────────┐
│  Dataset                                    │
│  Review your curated data                   │
├─────────────────────────────────────────────┤
│                                             │
│  [FILTERS]                                  │
│  Lab | Task | Tab: [Accepted|Edge|Fixes]    │
│                                             │
│  [QUALITY SUMMARY]                          │
│  ┌─────────────────────────────────────┐   │
│  │  Total: 150 | Avg Quality: 92       │   │
│  │  [Quality Distribution Chart]       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [EPISODES TABLE]                           │
│  Time | Task | Status | Quality | Video    │
│  ...                                        │
│                                             │
│  [BULK ACTIONS]                             │
│  [Export Selected] [Download All]           │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Changes**:
- **Quality Summary**: Visual chart showing distribution
- **Bulk Actions**: Select multiple episodes for export
- **Better Status**: Color-coded, larger badges
- **Visual Hierarchy**: Summary first, table second

**Why Simpler**:
- Quality at a glance (chart)
- Faster bulk operations (select multiple)
- Better organization (summary → details)

---

#### 4. `/lab/review` — Review / Fixes (NEW PAGE)

**Purpose**: Review submitted fixes, accept/reject, manage quality

**Structure**:

```
┌─────────────────────────────────────────────┐
│  Review / Fixes                              │
│  Review worker submissions                   │
├─────────────────────────────────────────────┤
│                                             │
│  [PENDING REVIEW - Primary]                 │
│  ┌─────────────────────────────────────┐   │
│  │  {Next fix to review}               │   │
│  │  [Accept] [Reject] [View Details]    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [FILTERS]                                  │
│  Status | Worker | Task | Date             │
│                                             │
│  [FIXES TABLE]                               │
│  Date | Task | Worker | Quality | Actions  │
│  ...                                        │
│                                             │
└─────────────────────────────────────────────┘
```

---

#### 5. `/lab/export` — Export Center

**Current Problems**:
- Too verbose
- Reads like a report, not a decision tool

**New Structure**:

```
┌─────────────────────────────────────────────┐
│  Export                                      │
│  Download training datasets                 │
├─────────────────────────────────────────────┤
│                                             │
│  [TASK SELECTOR]                            │
│  Task: [Dropdown]                           │
│                                             │
│  [DATASET PREVIEW]                          │
│  ┌─────────────────────────────────────┐   │
│  │  📦 Dataset Ready                   │   │
│  │  Episodes: 150 | Fixes: 45          │   │
│  │  Quality: 92/100                   │   │
│  │  [Download ZIP] ← PRIMARY            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [DETAILS - Collapsible]                    │
│  ▼ Breakdown                                │
│  Total Episodes: 150                        │
│  Edge Cases: 45                             │
│  Acceptance Rate: 92%                       │
│  Top Failure Reasons: ...                   │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Changes**:
- **Primary Action**: Large "Download ZIP" button
- **Preview First**: Key numbers visible immediately
- **Details Collapsed**: Full breakdown hidden by default
- **Visual Hierarchy**: Download button is 2x larger

**Why Simpler**:
- One-click download (primary action)
- Less reading (details collapsed)
- Faster decision (preview first)

---

## 🎨 Component Specifications

### Sidebar Component

**Props**:
- `items`: Array of `{ icon, label, href, active }`
- `collapsed`: Boolean (icon-only mode)
- `onToggleCollapse`: Function

**Styling**:
- Width: `240px` (expanded) / `64px` (collapsed)
- Background: `bg-white`
- Border: `border-r border-slate-200`
- Active: `bg-[#8350e8]/10 border-l-2 border-[#8350e8]`
- Hover: `bg-slate-50`

### Primary Action Card

**Purpose**: Large, prominent CTA on every page

**Styling**:
- Background: `bg-[#8350e8]/5 border border-[#8350e8]/20`
- Padding: `p-6`
- Button: `bg-[#8350e8] text-white`
- Size: `text-xl` heading, `text-base` description

### Status Badges

**Colors**:
- `open`: Yellow (`bg-yellow-50 text-yellow-700`)
- `claimed`: Blue (`bg-blue-50 text-blue-700`)
- `submitted`: Purple (`bg-purple-50 text-purple-700`)
- `accepted`: Green (`bg-green-50 text-green-700`)
- `rejected`: Red (`bg-red-50 text-red-700`)

**Size**: `text-xs px-2 py-0.5 rounded font-medium border`

---

## 🚀 Implementation Plan

### Phase 1: Sidebar Infrastructure
1. Create `Sidebar` component
2. Create `SidebarItem` component
3. Add sidebar to layout wrapper
4. Update routing to use sidebar

### Phase 2: Worker Portal Pages
1. Redesign `/work/dashboard`
2. Redesign `/work/queue`
3. Redesign `/work/jobs/[id]`
4. Create `/work/history` (new)
5. Create `/work/earnings` (new)

### Phase 3: Lab Portal Pages
1. Redesign `/lab/dashboard`
2. Redesign `/lab/upload`
3. Redesign `/lab/dataset`
4. Redesign `/lab/export`
5. Create `/lab/review` (new)

### Phase 4: Polish
1. Add keyboard shortcuts
2. Add loading states
3. Add empty states
4. Add error states
5. Test on mobile (responsive sidebar)

---

## ✅ Success Metrics

**Before → After**:
- **Clicks to complete task**: 5 → 2
- **Time to find next action**: 3s → 0.5s
- **Visual noise**: High → Low
- **Navigation clarity**: Medium → High

**User Goals**:
- Worker: "Start fixing" in < 2 clicks
- Lab: "Upload episode" in < 2 clicks
- Both: Clear primary action on every page

---

## 🎯 Why This Is Simpler

### 1. **Sidebar vs Top Nav**
- **Before**: Flat horizontal links, hard to scan
- **After**: Vertical hierarchy, icons + labels, always visible
- **Benefit**: Faster navigation, clearer structure

### 2. **Primary Actions**
- **Before**: No clear "what should I do?"
- **After**: Large, prominent CTA on every page
- **Benefit**: Zero confusion, faster workflows

### 3. **Information Hierarchy**
- **Before**: All info shown at once
- **After**: Primary first, details collapsed
- **Benefit**: Less cognitive load, faster decisions

### 4. **Reduced Clicks**
- **Before**: 5 clicks to submit fix
- **After**: 2 clicks (queue → fix → submit)
- **Benefit**: Faster task completion

### 5. **Visual Clarity**
- **Before**: Tables, rows, dense layouts
- **After**: Cards, badges, whitespace
- **Benefit**: Easier to scan, less overwhelming

---

## 📝 Next Steps

1. **Review this proposal** — Does this match your vision?
2. **Approve structure** — Confirm sidebar and page layouts
3. **Start implementation** — Begin with Phase 1 (Sidebar)
4. **Iterate** — Test and refine as we build

**Ready to proceed?** Let me know if you want any changes to the structure, and I'll start implementing! 🚀


