# natli-portal Audit Report

**Date:** 2026-03-07
**Auditor:** Claude Sonnet (acting as DeepSeek R1 proxy — DeepSeek hit 64K context limit)
**Summary:** The portal is well-architected with impressive real-time features (SSE, live health, model telemetry, skill management) and a clean React 19 + Tailwind v4 stack. However, several critical security vulnerabilities — including a hardcoded ClickUp API key, open CORS, command injection risk, and zero authentication — must be addressed before this can be considered production-safe, even for internal use.

---

## 🔴 Critical Issues

### 1. Hardcoded ClickUp API Token in Source Code
**File:** `server/index.ts` line 16
```typescript
const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN || 'pk_107639602_Q8PJNSBF1MGMW9QA0UROQ3B1OIYKPJP6';
```
**Problem:** Real API key committed in code. Anyone with repo access has full ClickUp API access.
**Fix:** Remove the hardcoded fallback entirely. Make `CLICKUP_TOKEN` required:
```typescript
const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN;
if (!CLICKUP_TOKEN) throw new Error('CLICKUP_TOKEN env var required');
```

---

### 2. Command Injection in Cron Create/Edit Endpoints
**File:** `server/index.ts` lines 627–650 (POST `/api/cron/jobs`), lines 660–680 (PUT `/api/cron/jobs/:id`)
```typescript
parts.push(`--name "${name}"`);
parts.push(`--message "${message.replace(/"/g, '\\"')}"`);
```
**Problem:** The escaping only handles `"` — an attacker can still inject via backticks, `$(command)`, newlines, or semicolons in `name`, `cronExpr`, `message`, or `model` fields. This allows arbitrary shell command execution on the server machine.
**Fix:** Use `spawn()` with array arguments instead of string interpolation, or validate inputs strictly with an allowlist regex before using `exec()`. Do not use user input directly in shell strings.

---

### 3. Zero Authentication on All API Endpoints
**File:** `server/index.ts` — entire file
**Problem:** Server binds to `0.0.0.0:3001` with no authentication middleware whatsoever. Any device on the local network can:
- Read full MEMORY.md contents (`GET /api/memory/file`)
- Write/overwrite MEMORY.md (`PUT /api/memory/file`)
- Read all API keys from `openclaw.json` (`GET /api/config/keys/:provider/value`)
- Write new API keys (`PUT /api/config/keys/:provider`)
- Execute arbitrary cron jobs (`POST /api/cron/jobs/:id/run`)
- Restart the gateway (`POST /api/gateway/restart`)
**Fix:** Add a shared secret middleware (even a simple bearer token check against an env var) for all mutating endpoints. For a personal local tool, an `X-Portal-Token` header check is sufficient.

---

### 4. Wide-Open CORS — No Origin Restriction
**File:** `server/index.ts` line 13
```typescript
app.use(cors());
```
**Problem:** Accepts requests from any origin. Combined with the lack of authentication, this means any website the user visits could make API calls to the portal and read/write sensitive data (SSRF-lite attack vector).
**Fix:**
```typescript
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
```

---

### 5. TasksCard "View All" Navigates to Non-Existent Tab
**File:** `src/components/natli-dashboard/overview/OverviewTab.tsx` — `TasksCard` component
```typescript
<ViewAllLink onClick={() => onNavigateTo('task')} />
```
**Problem:** The tab value `'task'` does not exist. Available tabs are: `overview, system, model, sessions, memory, schedule, skill`. Clicking "View All" on the Tasks card silently fails — the tab switcher sets `activeTab='task'` but no `TabsContent` matches, rendering nothing.
**Fix:** Either remove the Tasks card's "View All" link, navigate to an external ClickUp URL, or add a tasks tab. Quick fix: `onNavigateTo('overview')` or open ClickUp in new tab.

---

## 🟡 Important Issues

### 6. Multiple Hardcoded Absolute Paths (`/Users/natlee/`)
**File:** `server/index.ts` lines 21, 148, 833, 882, 896, 912, 942, 960, 1902, 1985, 2188, 2278
```typescript
const UPLOAD_DIR = '/Users/natlee/.openclaw/workspace/uploads/chat';
const dbPath = '/Users/natlee/.openclaw/memory/main.sqlite';
const avatarPath = '/Users/natlee/.openclaw/workspace/assets/images/nat-lee-profile.jpg';
```
**Problem:** `OPENCLAW_WORKSPACE` env var exists but 6-7 paths bypass it, hardcoding natlee's username. Breaks if run as a different user or on a different machine.
**Fix:** Derive all paths from `OPENCLAW_WORKSPACE` or `os.homedir()`:
```typescript
const OPENCLAW_DIR = path.join(os.homedir(), '.openclaw');
const UPLOAD_DIR = path.join(OPENCLAW_DIR, 'workspace/uploads/chat');
```

---

### 7. SSE Poller Uses Wrong Command
**File:** `server/index.ts` lines 85–86
```typescript
const [cronOut, sessionOut] = await Promise.all([
  execCommand('openclaw cron list --json').catch(() => '[]'),
  execCommand('openclaw session list --json').catch(() => '[]'), // ← WRONG
]);
```
**Problem:** The `/api/sessions` endpoint uses `openclaw sessions --json --all-agents` but the SSE poller uses `openclaw session list --json` (different command). The pulse SSE event likely broadcasts empty or wrong session data, making the real-time session count in the sidebar unreliable.
**Fix:** Change to `openclaw sessions --json --all-agents` to match the REST endpoint.

---

### 8. `handleSend` in QuickChatPanel Has Stale Closure Bug
**File:** `src/components/natli-dashboard/chat/QuickChatPanel.tsx` — `handleSend` useCallback
```typescript
const handleSend = useCallback(async (text?: string) => {
  // ...
  const history = messages.filter(...) // ← uses messages from closure
}, [input, selectedFile, selectedModel, typewriterEffect]); // messages NOT in deps
```
**Problem:** `messages` is not in the dependency array. After multiple messages, the history sent to the API will be stale (always from the first render's message state). Users will see Nat Lee lose conversation context mid-chat.
**Fix:** Add `messages` to the useCallback dependency array. Consider using a `useRef` for messages if you want to avoid unnecessary re-creates.

---

### 9. `require()` Calls in ESM Module
**File:** `server/index.ts` lines ~2050–2070
```typescript
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const XLSX = require('xlsx');
```
**Problem:** The project uses `"type": "module"` in `package.json`, making all `.ts` files ESM. Calling `require()` inside async functions is a CommonJS pattern that may cause issues. Currently works only because `tsx` patches it, but could break with stricter ESM runtimes.
**Fix:** Use `await import('pdf-parse')` etc. or move to top-level ES imports with `createRequire` for CJS-only packages.

---

### 10. Entire "Work" Platform Is a Placeholder
**File:** `src/App.tsx` lines ~380–385
```typescript
} : platform === 'work' ? (
  <PagePlaceholder />
)
```
**Problem:** Clicking the "Work" tab in the sidebar renders `<PagePlaceholder />` for all items. The `workMenuItems` list shows navigation items, but all content is unimplemented. This could confuse users who see the navigation but no content.
**Fix:** Either hide the "Work" tab with a "Coming Soon" indicator or implement the first page (work-dashboard).

---

### 11. Lepōs Work Dashboard Uses 100% Mock Data
**Files:** `src/components/dashboard/mock-data.ts`, `sales-mock-data.ts`, `payment-mock-data.ts`, `product-mock-data.ts`
**Problem:** The "Template" platform's dashboard (`Dashboard.tsx` and all sub-components) imports exclusively from `*-mock-data.ts` files. All revenue charts, KPIs, payment data, and product tables are static fake numbers. No API calls are made to a real Lepōs backend.
**Fix:** This is a known design decision (template stage), but the files should be clearly marked as `// MOCK DATA - REPLACE WITH API` comments, and a `PORTAL_SPEC.md` issue should be filed for each data source.

---

### 12. Fake 2-Second Sidebar Loading Simulation
**File:** `src/App.tsx` lines ~350–356
```typescript
useEffect(() => {
  setIsSidebarLoading(true);
  const timer = setTimeout(() => {
    setIsSidebarLoading(false);
  }, 2000); // ← purely cosmetic delay
```
**Problem:** The sidebar menu items come from a static import (`menu-data.ts`), not an API. The 2-second skeleton loading state is entirely cosmetic, adding 2 seconds of unnecessary wait time on every page load.
**Fix:** Remove the fake loading or replace with a real data-fetch (e.g., load skills count, session count from API before showing menu).

---

### 13. Dead Code — Unused Component Definitions
**File:** `src/components/natli-dashboard/NatliDashboard.tsx`
The following components are defined but never rendered:
- `KPICard`
- `ServiceStatusRow`
- `StatusDot`
- `TaskTab`

**Problem:** Increases bundle size and creates maintenance overhead. These appear to be leftovers from an earlier iteration.
**Fix:** Delete the four unused components. Run `tsc --noUnusedLocals` to catch more.

---

### 14. Model Pricing Table Has Inconsistent Key Format
**File:** `server/index.ts` `MODEL_PRICING` table
```typescript
const MODEL_PRICING: Record<string, ...> = {
  'claude-opus-4-6': { input: 15.0, output: 75.0 },  // no prefix
  'google/gemini-2.5-pro': { input: 1.25, output: 10.0 }, // with prefix
```
**Problem:** Some keys have provider prefixes (`google/gemini-2.5-pro`), some don't (`claude-opus-4-6`). The `getModelPrice` function attempts fallback by stripping prefix, but the order of checks may give wrong prices for some models.
**Fix:** Standardize all keys to `provider/model-id` format matching how models are stored in `openclaw.json`. Update `getModelPrice` accordingly.

---

### 15. MemoryTab Type Missing `p1Sections` and `p2Sections`
**File:** `src/components/natli-dashboard/memory/MemoryTab.tsx`
```typescript
interface MemoryTabProps {
  health: {
    p0Sections: number;
    // p1Sections and p2Sections MISSING from interface
```
**Problem:** The API returns `p0Sections`, `p1Sections`, `p2Sections` (used in `NatliDashboard.tsx`'s `HealthData` type) but `MemoryTab`'s health prop interface only declares `p0Sections`. TypeScript won't catch usage of missing fields.
**Fix:** Add `p1Sections: number; p2Sections: number;` to the `MemoryTabProps.health` interface.

---

### 16. No `.env.example` File
**File:** Project root — missing
**Problem:** There is no `.env.example` documenting required environment variables. A developer setting up the project has no way to know what env vars are needed.
**Required vars are:** `CLICKUP_TOKEN`, `CLICKUP_TASK_LIST`, `OPENCLAW_WORKSPACE`
**Fix:** Create `.env.example`:
```
CLICKUP_TOKEN=pk_xxx_your_token_here
CLICKUP_TASK_LIST=901815865909
OPENCLAW_WORKSPACE=/Users/yourname/.openclaw/workspace
```

---

### 17. `/api/config/keys/:provider/value` Exposes Full API Keys Over HTTP
**File:** `server/index.ts` lines ~1140–1150
```typescript
app.get('/api/config/keys/:provider/value', async (req, res) => {
  // ...returns full plaintext API key
  res.json({ apiKey });
});
```
**Problem:** Combined with open CORS and no auth, any page can exfiltrate full API keys (OpenRouter, Moonshot) with a simple GET request.
**Fix:** This endpoint is most critical to protect. At minimum, add an `X-Portal-Token` bearer check before any key-revealing endpoint.

---

## 🟢 Minor Issues / Suggestions

1. **`server/index.ts` is 2,300+ lines** — should be split into route modules: `routes/health.ts`, `routes/crons.ts`, `routes/sessions.ts`, `routes/skills.ts`, `routes/chat.ts`, etc.

2. **`formatUptime` duplicated** — identical function exists in both `NatliDashboard.tsx` and `OverviewTab.tsx`. Extract to a shared `src/lib/formatters.ts`.

3. **`formatTokens` duplicated** — same pattern in `NatliDashboard.tsx`, `OverviewTab.tsx`, and `SessionsTab.tsx`.

4. **Chat panel has fixed pixel sizes** — `w-[600px] h-[500px]` / `w-[720px] h-[700px]` will overflow on 768px-wide screens. Use `max-w-[min(600px,90vw)]` instead.

5. **Vite `allowedHosts: true`** in `vite.config.ts` — slightly loose for dev server; any hostname resolving to the machine can serve the app. Fine for local dev, but document this.

6. **`/api/search/memory` is naive string search** — only searches MEMORY.md via simple `toLowerCase().includes()`. Despite the SQLite vector DB being available, the portal search doesn't use it. Consider using `openclaw memory search` CLI via the backend.

7. **Hardcoded "Welcome, Matthew Li"** in `QuickChatPanel.tsx` — not parameterized from user context. If other users access the portal, they'll see the wrong name.

8. **`xlsx` package version `^0.18.5`** is outdated — the package has since been rebranded to `SheetJS` and `0.18.x` has known CVEs. Update to `xlsx@0.20.x` or use `exceljs` as an alternative.

9. **No error boundary around the chat panel** — if `QuickChatPanel` throws, the entire dashboard crashes silently. Wrap in `<ErrorBoundary>`.

10. **`openclaw cron runs` response shape assumed** — in `token-summary` endpoint, code assumes `runData.entries || runData.runs` but doesn't handle `runData.runs` being a flat array. Add defensive fallback logging.

11. **Platform switch in `App.tsx` always triggers 800ms fake loading** — even when switching back to the same platform.

12. **`workMenuItems` navigation goes nowhere** — all `work` platform menu items set `activeItem` but render `<PagePlaceholder />`. The sidebar shows 6+ items that all look active but do nothing.

13. **No toast/feedback for Gateway restart failure** — if `POST /api/gateway/restart` returns an error, `handleGatewayRestart` silently proceeds and calls `loadData()` 5 seconds later. User sees "Restarting…" then it just stops. Add `toast.error()` on failure.

14. **`App.tsx` SSEProvider placement** — `SSEProvider` wraps `SidebarProvider` and the entire App. This is correct, but the `useSSEContext()` call inside `App()` is outside `SSEProvider` (it's used in the same component that renders `SSEProvider`). Verify that context is properly available — in React, the Provider must be a *parent* of the consumer, not a sibling. In this case `App` renders the Provider and also calls `useSSEContext()` — this will return the default context (connected: false) always.

    **This is a bug.** Fix: Move `useSSEContext()` call into `AppContent` component rendered inside `<SSEProvider>`.

15. **`NatliSchedulerPage` prop `embedded` not in type definition** — `LazyNatliSchedulerPage` is called with `embedded={true}` prop but the component's TypeScript interface may not declare it. Check for TS errors.

---

## 🏆 Top 5 Priority Fixes

| Rank | Issue | Rationale |
|------|-------|-----------|
| **#1** | **Remove hardcoded ClickUp API key** (Critical §1) | Real credential in source. Risk: account compromise, data leak. 5-minute fix. |
| **#2** | **Add authentication middleware** (Critical §3) | Server bound to 0.0.0.0 with zero auth means any LAN device can read/write MEMORY.md, exfiltrate API keys, and trigger system commands. |
| **#3** | **Fix `useSSEContext()` in App.tsx** (Minor §14) | SSE connected indicator is always "offline" — the real-time features that make this dashboard valuable are silently broken. Verify and fix. |
| **#4** | **Fix `handleSend` stale closure** (Important §8) | Chat history is always from first render. Nat Lee "forgets" previous messages in the same session. Core feature broken. |
| **#5** | **Fix Tasks "View All" navigates to non-existent tab** (Critical §5) | Silent navigation failure on the Overview page's most prominent card. |

---

## ✅ What's Working Well

- **SSE architecture is excellent** — single shared EventSource via `SSEContext`, fan-out via `listenersRef` Map, auto-reconnect with 5s backoff. Clean and efficient.
- **`/api/health` endpoint is impressively comprehensive** — mactop integration for Apple Silicon metrics (CPU, GPU, temps, power draw), openclaw status, memory stats, SQLite DB tracking, all in one parallel fetch.
- **Lazy loading with Suspense** is properly implemented for all heavy tabs (Scheduler, Sessions, Model, SkillTracker).
- **ErrorBoundary wrapping** on major tab content — good defensive practice.
- **Skill discovery system** is well-designed — filesystem walk with YAML frontmatter + Markdown H1 fallback parsing, supports symlinks, handles custom/system/managed skill dirs.
- **Chat panel** has solid UX: typewriter effect, drag-and-drop file upload, HEIC conversion, abort controller for timeouts, model selector, context-aware suggestions per tab.
- **Session classification** (`classifySession()`) cleanly maps session keys to human-readable labels.
- **Model pricing and cost estimation** — comprehensive pricing table with per-model input/output rates for cost transparency.
- **`discoverSkills()` is portable** — scans multiple dirs, handles broken symlinks gracefully, degrades cleanly.
- **CORS proxy in Vite config** — clean separation between frontend port 5173 and API port 3001.

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-03-07 | Initial audit — full codebase review |
