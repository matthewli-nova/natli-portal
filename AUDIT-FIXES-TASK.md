# Portal Audit Fix Task

Fix ALL of the following issues from the code audit. Read relevant files before editing. Do NOT skip any issue. Commit at the end.

## CRITICAL FIXES

### C1: Remove hardcoded ClickUp API key
File: server/index.ts ~line 16
Current: `const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN || 'pk_107639602_Q8PJNSBF1MGMW9QA0UROQ3B1OIYKPJP6';`
Fix: Remove the hardcoded fallback. If env var is missing, throw:
```typescript
const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN;
if (!CLICKUP_TOKEN) throw new Error('CLICKUP_TOKEN env var required');
```

### C2: Fix command injection in cron create/edit endpoints
File: server/index.ts — POST /api/cron/jobs and PUT /api/cron/jobs/:id
The shell string approach using exec() is unsafe. Fix: Add strict input validation — reject any input containing backticks, $(), semicolons, newlines, or pipe characters in name, cronExpr, message, or model fields — return 400 if found. Also switch to spawn() with array args for cron CLI calls where feasible.

### C3: Add authentication middleware
File: server/index.ts
Add PORTAL_TOKEN env var support:
```typescript
const PORTAL_TOKEN = process.env.PORTAL_TOKEN;
if (PORTAL_TOKEN) {
  app.use((req, res, next) => {
    const skip = req.path === '/api/health' || req.path.startsWith('/api/sse');
    if (skip) return next();
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${PORTAL_TOKEN}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  });
}
```
Place this AFTER cors() but BEFORE all route handlers.

### C4: Restrict CORS to localhost only
File: server/index.ts ~line 13
Current: `app.use(cors())`
Fix: `app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }))`

## IMPORTANT BUG FIXES

### I1: Fix hardcoded /Users/natlee/ absolute paths
File: server/index.ts
Import os at top: `import os from 'os';`
Define:
```typescript
const HOME = os.homedir();
const OPENCLAW_DIR = path.join(HOME, '.openclaw');
const WORKSPACE = process.env.OPENCLAW_WORKSPACE || path.join(OPENCLAW_DIR, 'workspace');
```
Replace ALL occurrences of `/Users/natlee/.openclaw/workspace` with `WORKSPACE` and `/Users/natlee/.openclaw/` with `OPENCLAW_DIR + '/'`. Check every hardcoded path.

### I2: Fix SSE poller wrong CLI command
File: server/index.ts — the SSE pulse/heartbeat handler
Current: `execCommand('openclaw session list --json')` (wrong)
Fix: Change to `execCommand('openclaw sessions --json --all-agents')`

### I3: Fix handleSend stale closure in QuickChatPanel
File: src/components/natli-dashboard/chat/QuickChatPanel.tsx (find it with: find src -name "QuickChatPanel*")
The handleSend useCallback is missing `messages` from its dependency array.
Fix: Add `messages` to the dependency array.

### I4: Fix require() in ESM module
File: server/index.ts
Find any `require('pdf-parse')`, `require('mammoth')`, `require('xlsx')` calls inside async functions.
Fix: Convert to dynamic ESM imports:
```typescript
const { default: pdfParse } = await import('pdf-parse');
const { default: mammoth } = await import('mammoth');
const XLSX = await import('xlsx');
```

### I5: Remove fake 2-second cosmetic sidebar loading delay
File: src/App.tsx
Find the useEffect that does setTimeout(() => setIsSidebarLoading(false), 2000).
Fix: Remove the setTimeout — call setIsSidebarLoading(false) immediately, or remove the loading state entirely if sidebar loads from static data.

### I6: Delete unused dead code components
File: src/components/natli-dashboard/NatliDashboard.tsx
First grep to confirm these are defined but never used outside the file:
- KPICard
- ServiceStatusRow
- StatusDot  
- TaskTab
If confirmed unused, delete those component definitions from the file.

### I7: Fix MemoryTab TypeScript interface
File: src/components/natli-dashboard/memory/MemoryTab.tsx (find it)
Add missing fields to the health prop interface:
```typescript
p1Sections: number;
p2Sections: number;
```

### I8: Fix model pricing table inconsistent key format
File: server/index.ts — MODEL_PRICING constant
Standardize all keys to NOT include provider prefix (just the model ID part after the slash). Update getModelPrice() so it strips provider prefix before lookup. Example: 'google/gemini-2.5-pro' → key should be 'gemini-2.5-pro'.

### I9: Protect the API keys value endpoint
File: server/index.ts — GET /api/config/keys/:provider/value
This endpoint returns full plaintext API keys. Add an explicit auth check on this route regardless of PORTAL_TOKEN being set:
```typescript
const auth = req.headers.authorization;
if (!auth || auth !== `Bearer ${PORTAL_TOKEN ?? ''}`) {
  return res.status(401).json({ error: 'Unauthorized — this endpoint requires PORTAL_TOKEN' });
}
```

## MINOR FIXES

### M1: Extract duplicate formatUptime and formatTokens functions
Create file: src/lib/formatters.ts
Add to it:
```typescript
export function formatUptime(seconds: number): string { /* extract the logic */ }
export function formatTokens(n: number): string { /* extract the logic */ }
```
Then find where these are defined in NatliDashboard.tsx, OverviewTab.tsx, SessionsTab.tsx — import from formatters.ts instead, remove duplicates.

### M2: Fix chat panel hardcoded widths for responsiveness
Find w-[600px] or w-[720px] in the chat panel component.
Fix: Change to max-w-[min(600px,90vw)] / max-w-[min(720px,92vw)]

### M3: Create .env.example
Create file at project root: .env.example
```
# Required
CLICKUP_TOKEN=pk_xxx_your_token_here
CLICKUP_TASK_LIST=901815865909
OPENCLAW_WORKSPACE=/Users/yourname/.openclaw/workspace

# Optional — adds bearer token auth to all API endpoints
PORTAL_TOKEN=your-secret-token-here
```

### M4: Add "Coming Soon" to Work platform placeholder
In src/App.tsx — where platform === 'work' renders PagePlaceholder — update to also display a "Work platform — coming soon" message or badge.

### M5: Add mock data comments
Find files matching *mock-data.ts in src/.
Add comment at top of each: `// MOCK DATA — Replace with real API calls before production use`

## AFTER ALL FIXES

1. Run: npm run build
2. Fix any TypeScript errors from your changes
3. Commit everything: git add -A && git commit -m "fix: portal audit fixes — security hardening, stale closures, dead code, type fixes"
4. Notify completion: openclaw system event --text "Portal audit fixes complete — committed to fix/portal-audit-20260307" --mode now
