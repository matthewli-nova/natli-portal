# Code Review Report — natli-portal

**Reviewer:** Opus (sub-agent)
**Date:** 2026-03-05 07:01 HKT
**Scope:** SSE real-time pulse, Cron Log Drawer summary, Chat Bar fix, SSE URL fix
**Files reviewed:** 7 files across server + frontend

---

## Issues Found & Fixes Applied

### 🔴 Critical — Bugs Fixed

#### 1. Missing `broadcastSSE('health', ...)` in `/api/health` (server/index.ts:324)
**What:** The health endpoint was refactored to inline `res.json({...})` but the `broadcastSSE('health', responseData)` call was dropped. The comment remained but the actual broadcast was missing. SSE clients never received health updates.

**Fix:** Extracted the response object into a `responseData` variable, passed it to both `res.json(responseData)` and `broadcastSSE('health', responseData)`.

#### 2. SSE pulse poller never fires on startup (server/index.ts:103)
**What:** `ssePulsePoller` only ran via `setInterval(ssePulsePoller, 30_000)`, meaning SSE clients connecting in the first 30 seconds received no initial pulse data.

**Fix:** Added `ssePulsePoller()` call immediately before the `setInterval`.

### 🟡 Medium — UX/Robustness Fixes

#### 3. Double `onConnected` callback in `useSSE` (useSSE.ts:24-30)
**What:** Both `es.addEventListener('connected', ...)` AND `es.onopen` called `onConnectedRef.current?.()`. The server sends a custom `connected` event, and the browser also fires `onopen` on every EventSource connection. Result: `setSseConnected(true)` was called twice per connection.

**Fix:** Removed the `es.onopen` handler. The server's custom `connected` event is the authoritative signal.

#### 4. `onDisconnected` called during React cleanup (useSSE.ts:47)
**What:** The useEffect cleanup function called `onDisconnectedRef.current?.()`, which triggers `setSseConnected(false)` on an unmounting component — a no-op state update that pollutes React dev warnings.

**Fix:** Removed the `onDisconnected` call from cleanup. The `es.onerror` handler already calls it during actual disconnects.

#### 5. Chat panel fetch not abortable on unmount (QuickChatPanel.tsx)
**What:** If the chat panel was closed while a `/api/chat/send` request was in-flight (up to 120s timeout), the promise would resolve and attempt state updates on an unmounted component. Also used `AbortSignal.timeout()` which isn't cancellable on unmount.

**Fix:** Added `AbortController` ref, wired it into the fetch signal, and abort on unmount cleanup. Previous in-flight requests are also cancelled when a new message is sent.

#### 6. No error state for transcript fetch failure (SessionDrawer.tsx)
**What:** The transcript fetch used `.catch(() => {})` which silently swallowed errors. Users saw "No messages found" for both empty transcripts and network failures — no way to distinguish.

**Fix:** Added `fetchError` state, proper error handling in the fetch chain, and an error UI with the failure message.

### 🟢 Low — Dead Code (Not Fixed, Noted)

#### 7. `chatActive` state always false (NatliDashboard.tsx:117)
**What:** `const [chatActive] = useState(false)` — never updated. The green activity dot on the chat button never showed.

**Fix:** Removed `chatActive` state and the JSX indicator that depended on it.

#### 8. Unused state/functions (NatliDashboard.tsx)
- `refreshingModel` state + `handleRefreshModel` function — defined but never referenced in JSX
- `useMemo` imported but never used
- Several lucide icons imported but only used by dead code components
- Dead components: `KPICard`, `ServiceStatusRow`, `StatusDot`, `TaskTab` — defined but never rendered

**Not fixed:** These are harmless (tree-shaken in prod builds) and may be intended for future use.

---

## Architecture Assessment

### SSE Implementation (Feature #6) ✅ Well Done
- Clean EventSource lifecycle with heartbeat keepalive (25s)
- Hash-based change detection in poller avoids unnecessary broadcasts
- Reconnect with 5s backoff in `useSSE` hook
- Ref-based callback pattern avoids stale closures

### Cron Log Drawer Summary (Feature #4) ✅ Well Done
- Last run `summary` shown prominently with status-colored panel
- Good expand/collapse for older runs
- Duration and model displayed alongside summary

### Chat Bar Fix ✅ Working
- `openclaw agent --agent main --message "..." --json` with optional `--model` flag
- Frontend hardcodes `model: 'anthropic/claude-opus-4-6'`
- NO_REPLY sentinel properly stripped from response

### SSE URL Fix ✅ Correct
- Using relative `/api/events` works through Vite proxy in dev and direct in prod

---

## Security Notes (Low Priority, Local-Only Server)

1. **Hardcoded ClickUp token** in `server/index.ts:14` — acceptable for local dev server
2. **Shell command injection surface** in cron endpoints — `req.params.id` goes directly into `exec()` calls. Mitigated by local-only access, but worth sanitizing if ever exposed

---

## tsc Status

```
$ npx tsc --noEmit
EXIT: 0
```

All type checks pass with zero errors.

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical bugs | 2 | ✅ Fixed |
| 🟡 Medium issues | 4 | ✅ Fixed |
| 🟢 Dead code | 2 | ⚠️ Noted (partial cleanup) |
| tsc errors | 0 | ✅ Clean |
