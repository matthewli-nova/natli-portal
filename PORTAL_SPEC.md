# Nat Li Portal — Build Spec v1.0

## What We're Building
This is the **Nat Li Portal** — Matthew Li's control dashboard for monitoring Nat Lee (AI assistant) operations.
It replaces the current Lepōs B2B portal content while reusing its design system (dark navy sidebar, cyan accents).

## Sidebar Navigation (replace existing menu-data.ts)
```
Dashboard       (Gauge icon)
Office          (Briefcase icon)
Agent           (Bot icon)
Research        (FlaskConical icon)
Task            (CheckSquare icon)
Calendar        (CalendarDays icon)
Scheduler       (Clock icon)
File            (FolderOpen icon)
Setting         (Settings icon)
```

## Architecture: Backend Proxy Server
Add a lightweight Express backend at `server/index.ts` (run alongside Vite in dev).
Vite proxy: `/api/*` → `http://localhost:3001`

### Backend endpoints to implement:

**System Health**
- `GET /api/health` → spawn `python3 /Users/natlee/.openclaw/workspace/scripts/system_health.py` and return parsed JSON output
  - system_health.py outputs text, parse it. If it says "No alerts", return `{ status: "ok", alerts: [] }`
  - Also return: cpu, memory, disk from `psutil` if available, or use `os` module

**Cron Jobs / Scheduler**  
- `GET /api/crons` → spawn `openclaw cron list --json` and return the JSON

**Sessions**
- `GET /api/sessions` → spawn `openclaw sessions --json --all-agents` and return JSON

**ClickUp Tasks**
- `GET /api/tasks` → fetch from ClickUp API
  - URL: `https://api.clickup.com/api/v2/list/901815865909/task?subtasks=true&include_closed=true`
  - Header: `Authorization: pk_107639602_Q8PJNSBF1MGMW9QA0UROQ3B1OIYKPJP6`
  - Return tasks array

**Memory Stats**
- `GET /api/memory/stats` → read workspace memory files
  - Count files in `/Users/natlee/.openclaw/workspace/memory/`
  - Count files in `/Users/natlee/.openclaw/workspace/memory/archive/`
  - Get SQLite DB size: `/Users/natlee/.openclaw/memory/main.sqlite`
  - Count .md files in workspace
  - Return: `{ dailyLogs: N, archived: N, dbSizeMb: N, totalFiles: N, lastUpdated: "..." }`

**Agents**
- `GET /api/agents` → read from `/Users/natlee/.openclaw/openclaw.json` and return agents.list array (without sensitive fields)

**Files**
- `GET /api/files?path=...` → list files/dirs at given path (restricted to workspace)
- `GET /api/files/content?path=...` → read file content (text files only, size limit 100KB)

---

## Dashboard Page (Priority #1)

Replace the existing Dashboard with a tabbed layout:

### Tabs: Overview | System | Schedule | Task | Research

**Tab 1: Overview**
- Top row KPI cards (4 cards):
  - Active Sessions (from /api/sessions — count active in last 60min)
  - Cron Jobs (from /api/crons — count total enabled)
  - Tasks In Progress (from /api/tasks — count status = in_progress)
  - Memory Files (from /api/memory/stats — dailyLogs count)
- Activity feed: last 5 session messages + last 3 cron runs (combine, sort by time)
- Quick status row: OpenClaw ✅ | Ollama ✅ | Gateway ✅

**Tab 2: System**
- CPU gauge (circular progress)
- Memory usage bar
- Disk usage bar
- Service status cards: OpenClaw, Ollama (http://localhost:11434), Gateway (http://localhost:18789)
- Last health check timestamp
- Alert list (from /api/health)

**Tab 3: Schedule**
- Cron jobs timeline — today's jobs highlighted
- Table: Name | Schedule | Last Run | Next Run | Status | Target
- Filter: All / Today / This Week
- Run Now button per job

**Tab 4: Task**
- ClickUp task board view
- Filter: All | To Do | In Progress | Done | Overdue
- Task cards: name, status badge, priority, assignee, due date
- Create task quick-form (opens dialog)
- Click task → opens detail panel

**Tab 5: Research**
- Stats cards: Total Research Sessions | Memory Files | DB Size | Last Research
- Knowledge base growth chart (mock line chart if no real time-series data available)
- Recent research topics list (from memory file names in /memory/*.md)
- Active research agents indicator

---

## Settings Page (Priority #2)

Sections:
1. **System Info** — OpenClaw version, gateway port, workspace path, model defaults
2. **Agent Configuration** — list all agents with their model, tools profile (read-only view from openclaw.json)
3. **Channel Settings** — Slack channels configured, allowFrom list (masked) 
4. **Memory System** — DB path, size, sync interval, embedding model, index stats
5. **Cron Management** — same as Scheduler tab but with enable/disable toggles
6. **Model Defaults** — channel model overrides (nat-1: opus, nat-2: sonnet, etc.)

---

## Other Pages (placeholder stubs for now)
- Office → "Email & Documents — Coming Soon" placeholder with briefcase icon
- Agent → List view of configured agents from /api/agents with model, status, emoji
- Research → "Research Center — Coming Soon" placeholder
- Task → Full ClickUp task list (same data as Dashboard Task tab, expanded)
- Calendar → "Calendar — Coming Soon" placeholder
- Scheduler → Full cron jobs table (same as Dashboard Schedule tab, expanded)
- File → Basic file browser for workspace directory

---

## Design
- Keep Lepōs dark navy (#022F44) sidebar, cyan (#00BCD4) accents
- Portal header: "Nat Li Portal" branding (or use "Nat Lee" with logo)
- User avatar: "NL" initials in cyan

## Tech Stack Additions
- `express` + `cors` backend server
- `node-fetch` or native fetch for ClickUp API calls
- `concurrently` to run Vite + Express together in `npm run dev`
- `.env` file for sensitive tokens (DO NOT hardcode in frontend)

## Environment Variables (.env file)
```
VITE_API_BASE=/api
CLICKUP_TOKEN=pk_107639602_Q8PJNSBF1MGMW9QA0UROQ3B1OIYKPJP6
CLICKUP_TASK_LIST=901815865909
OPENCLAW_WORKSPACE=/Users/natlee/.openclaw/workspace
```

## package.json scripts
```json
{
  "dev": "concurrently \"vite\" \"tsx server/index.ts\"",
  "build": "tsc -b && vite build",
  "preview": "vite preview"
}
```

## When Done
1. Run `npm run build` to verify clean build
2. Commit all changes: `git add -A && git commit -m "feat: Nat Li Portal - Dashboard + Settings with live data backend"`
3. Push: `git push`
4. Run: `openclaw system event --text "natli-portal: Dashboard + Settings complete. Live data backend running. Ready for review." --mode now`
