import express from 'express';
import cors from 'cors';
import { exec, spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import multer from 'multer';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN || 'pk_107639602_Q8PJNSBF1MGMW9QA0UROQ3B1OIYKPJP6';
const CLICKUP_TASK_LIST = process.env.CLICKUP_TASK_LIST || '901815865909';
const OPENCLAW_WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/Users/natlee/.openclaw/workspace';

// ─── File Upload Config ──────────────────────────────────────────────────────
const UPLOAD_DIR = '/Users/natlee/.openclaw/workspace/uploads/chat';
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(() => {});

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.png', '.jpg', '.jpeg', '.heic'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

function execCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: 15000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Health
// Format alert timestamp as ddmmyy hhmmss
function fmtAlertTime(d: Date = new Date()): string {
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2,'0');
  const min = String(d.getMinutes()).padStart(2,'0');
  const ss = String(d.getSeconds()).padStart(2,'0');
  return `${dd}${mm}${yy} ${hh}${min}${ss}`;
}

interface Alert { level: 'warning' | 'critical' | 'info'; type: string; message: string; timestamp: string; }

app.get('/api/health', async (_req, res) => {
  try {
    const now = new Date();
    const alerts: Alert[] = [];

    // Run mactop + openclaw status + filesystem reads in parallel
    const [mactopResult, openclawStatusResult, fsStatsResult] = await Promise.all([
      // 1. mactop
      (async () => {
        try {
          const out = await execCommand('PATH=/usr/sbin:/sbin:/usr/bin:/bin:$PATH mactop --headless --count 1 --format json');
          const parsed = JSON.parse(out);
          return Array.isArray(parsed) ? parsed[0] : parsed;
        } catch { return null; }
      })(),
      // 2. openclaw status --json
      (async () => {
        try {
          const out = await execCommand('openclaw status --json');
          return JSON.parse(out) as Record<string, unknown>;
        } catch { return null; }
      })(),
      // 3. Filesystem stats
      (async () => {
        const memoryMdPath = path.join(OPENCLAW_WORKSPACE, 'MEMORY.md');
        const memoryDir = path.join(OPENCLAW_WORKSPACE, 'memory');
        const archiveDir = path.join(OPENCLAW_WORKSPACE, 'memory', 'archive');
        const dbPath = '/Users/natlee/.openclaw/memory/main.sqlite';

        const [mdLines, dailyLogs, archiveCount, dbSize, dbMtime, p0, p1, p2] = await Promise.all([
          execCommand(`wc -l < "${memoryMdPath}"`).then(s => parseInt(s.trim(), 10)).catch(() => 0),
          fs.readdir(memoryDir).then(f => f.filter(x => x.endsWith('.md')).length).catch(() => 0),
          fs.readdir(archiveDir).then(f => f.length).catch(() => 0),
          execCommand(`du -sk "${dbPath}"`).then(s => Math.round((parseInt(s.split('\t')[0], 10) / 1024) * 100) / 100).catch(() => 0),
          fs.stat(dbPath).then(s => s.mtime.toISOString()).catch(() => ''),
          execCommand(`grep -c '## \\[P0\\]' "${memoryMdPath}"`).then(s => parseInt(s.trim(), 10)).catch(() => 0),
          execCommand(`grep -c '## \\[P1\\]' "${memoryMdPath}"`).then(s => parseInt(s.trim(), 10)).catch(() => 0),
          execCommand(`grep -c '## \\[P2\\]' "${memoryMdPath}"`).then(s => parseInt(s.trim(), 10)).catch(() => 0),
        ]);
        return { memoryMdLines: mdLines, memoryMdCap: 150, memoryDailyLogs: dailyLogs, memoryArchiveCount: archiveCount, memoryDbSizeMb: dbSize, lastMemorySyncTime: dbMtime, p0Sections: p0, p1Sections: p1, p2Sections: p2 };
      })(),
    ]);

    const mactopData = mactopResult as Record<string, unknown> | null;

    // Extract openclaw status fields
    let gatewayReachable = false, gatewayLatencyMs = 0, gatewayVersion = '', gatewayHost = '';
    let gatewayServiceRunning = false, gatewayPid = 0, gatewayStartTime = '';
    let primaryModel = '', totalSessions = 0;
    let memoryFiles = 0, memoryChunks = 0, memoryDirty = false, memoryDbPath = '';
    let ollamaModel = '', cacheEntries = 0, vectorEnabled = false, ftsEnabled = false;

    if (openclawStatusResult) {
      const gw = openclawStatusResult.gateway as Record<string, unknown> ?? {};
      const gwSelf = gw.self as Record<string, string> ?? {};
      const gwSvc = openclawStatusResult.gatewayService as Record<string, string> ?? {};
      const sess = openclawStatusResult.sessions as Record<string, unknown> ?? {};
      const sessDefaults = sess.defaults as Record<string, string> ?? {};
      const mem = openclawStatusResult.memory as Record<string, unknown> ?? {};
      const cache = mem.cache as Record<string, unknown> ?? {};
      const vec = mem.vector as Record<string, unknown> ?? {};
      const fts = mem.fts as Record<string, unknown> ?? {};
      const agents = openclawStatusResult.agents as Record<string, unknown> ?? {};

      gatewayReachable = !!gw.reachable;
      gatewayLatencyMs = (gw.connectLatencyMs as number) ?? 0;
      gatewayVersion = gwSelf.version ?? '';
      gatewayHost = gwSelf.host ?? '';
      gatewayServiceRunning = ((gwSvc.runtimeShort ?? '') as string).includes('running');
      const pidMatch = ((gwSvc.runtimeShort ?? '') as string).match(/pid (\d+)/);
      gatewayPid = pidMatch ? parseInt(pidMatch[1], 10) : 0;
      primaryModel = sessDefaults.model ?? '';
      totalSessions = (agents.totalSessions as number) ?? (sess.count as number) ?? 0;
      memoryFiles = (mem.files as number) ?? 0;
      memoryChunks = (mem.chunks as number) ?? 0;
      memoryDirty = !!mem.dirty;
      memoryDbPath = (mem.dbPath as string) ?? '';
      ollamaModel = (mem.model as string) ?? '';
      cacheEntries = (cache.entries as number) ?? 0;
      vectorEnabled = !!vec.available;
      ftsEnabled = !!fts.available;

      // Get gateway start time from PID
      if (gatewayPid > 0) {
        try {
          gatewayStartTime = (await execCommand(`ps -p ${gatewayPid} -o lstart=`)).trim();
        } catch { /* process may have restarted */ }
      }
    }

    // Extract mactop metrics
    let cpuPercent = 0, memPercent = 0, diskPercent = 0;
    let memTotalGb = 0, memUsedGb = 0, memAvailGb = 0;
    let cpuTemp = 0, gpuTemp = 0, socTemp = 0;
    let cpuPowerW = 0, systemPowerW = 0;
    let gpuPercent = 0, gpuFreqMhz = 0;
    let netInKbps = 0, netOutKbps = 0;
    let diskReadKbps = 0, diskWriteKbps = 0;
    let thermalState = 'Normal';
    let socModel = 'Unknown';
    let coreCount = 0, eCores = 0, pCores = 0;
    let topProcesses: unknown[] = [];

    if (mactopData) {
      const soc = mactopData.soc_metrics as Record<string,number> ?? {};
      const mem = mactopData.memory as Record<string,number> ?? {};
      const net = mactopData.net_disk as Record<string,number> ?? {};
      const info = mactopData.system_info as Record<string,unknown> ?? {};

      cpuPercent = Math.round((mactopData.cpu_usage as number) ?? 0);
      gpuPercent = Math.round((mactopData.gpu_usage as number) ?? 0);
      gpuFreqMhz = Math.round(soc.gpu_freq_mhz ?? 0);
      cpuTemp = Math.round(soc.cpu_temp ?? soc.soc_temp ?? 0);
      gpuTemp = Math.round(soc.gpu_temp ?? 0);
      socTemp = Math.round(soc.soc_temp ?? 0);
      cpuPowerW = Math.round((soc.cpu_power ?? 0) * 10) / 10;
      systemPowerW = Math.round((soc.system_power ?? 0) * 10) / 10;
      thermalState = (mactopData.thermal_state as string) ?? 'Normal';
      socModel = (info.name as string) ?? 'Apple Silicon';
      coreCount = (info.core_count as number) ?? 0;
      eCores = (info.e_core_count as number) ?? 0;
      pCores = (info.p_core_count as number) ?? 0;

      const totalMem = mem.total ?? 0;
      const usedMem = mem.used ?? 0;
      const availMem = mem.available ?? 0;
      memPercent = totalMem > 0 ? Math.round((usedMem / totalMem) * 100) : 0;
      memTotalGb = Math.round((totalMem / 1073741824) * 10) / 10;
      memUsedGb = Math.round((usedMem / 1073741824) * 10) / 10;
      memAvailGb = Math.round((availMem / 1073741824) * 10) / 10;

      netInKbps = Math.round((net.in_bytes_per_sec ?? 0) / 1024);
      netOutKbps = Math.round((net.out_bytes_per_sec ?? 0) / 1024);
      diskReadKbps = Math.round(net.read_kbytes_per_sec ?? 0);
      diskWriteKbps = Math.round(net.write_kbytes_per_sec ?? 0);

      topProcesses = ((mactopData.processes as unknown[]) ?? []).slice(0, 8);
    } else {
      // Fallback: node os module
      const os = await import('os');
      const cpus = os.cpus();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      cpuPercent = Math.round(cpus.reduce((acc, cpu) => {
        const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
        return acc + ((total - cpu.times.idle) / total) * 100;
      }, 0) / cpus.length);
      memPercent = Math.round(((totalMem - freeMem) / totalMem) * 100);
      memTotalGb = Math.round((totalMem / 1073741824) * 10) / 10;
      memUsedGb = Math.round(((totalMem - freeMem) / 1073741824) * 10) / 10;
      memAvailGb = Math.round((freeMem / 1073741824) * 10) / 10;
    }

    // Disk usage via df
    try {
      const dfOut = await execCommand("/bin/df -k / | tail -1");
      const parts = dfOut.trim().split(/\s+/);
      const used = parseInt(parts[2], 10);
      const avail = parseInt(parts[3], 10);
      const total = used + avail;
      diskPercent = total > 0 ? Math.round((used / total) * 100) : 0;
    } catch { diskPercent = 0; }

    // Service health checks
    let openclawOk = false, ollamaOk = false, gatewayOk = false;
    openclawOk = gatewayServiceRunning;
    try { const r = await fetch('http://localhost:11434/api/tags', {signal: AbortSignal.timeout(3000)}); ollamaOk = r.ok; } catch { /* down */ }
    gatewayOk = gatewayReachable;

    // Build alerts with level, type, timestamp (ddmmyy hhmmss)
    if (cpuPercent > 85) alerts.push({ level: 'critical', type: 'CPU', message: `CPU usage critical: ${cpuPercent}%`, timestamp: fmtAlertTime(now) });
    else if (cpuPercent > 70) alerts.push({ level: 'warning', type: 'CPU', message: `CPU usage high: ${cpuPercent}%`, timestamp: fmtAlertTime(now) });
    if (memPercent > 90) alerts.push({ level: 'critical', type: 'Memory', message: `Memory critical: ${memPercent}% used (${memUsedGb}GB / ${memTotalGb}GB)`, timestamp: fmtAlertTime(now) });
    else if (memPercent > 80) alerts.push({ level: 'warning', type: 'Memory', message: `Memory high: ${memPercent}% used`, timestamp: fmtAlertTime(now) });
    if (diskPercent > 90) alerts.push({ level: 'critical', type: 'Disk', message: `Disk critical: ${diskPercent}% used`, timestamp: fmtAlertTime(now) });
    else if (diskPercent > 75) alerts.push({ level: 'warning', type: 'Disk', message: `Disk usage high: ${diskPercent}%`, timestamp: fmtAlertTime(now) });
    if (cpuTemp > 80) alerts.push({ level: 'warning', type: 'Temperature', message: `CPU temp high: ${cpuTemp}°C`, timestamp: fmtAlertTime(now) });
    if (thermalState !== 'Normal') alerts.push({ level: 'warning', type: 'Thermal', message: `Thermal state: ${thermalState}`, timestamp: fmtAlertTime(now) });
    if (!openclawOk) alerts.push({ level: 'critical', type: 'Service', message: 'OpenClaw service not responding', timestamp: fmtAlertTime(now) });
    if (!ollamaOk) alerts.push({ level: 'warning', type: 'Service', message: 'Ollama not responding on :11434', timestamp: fmtAlertTime(now) });
    if (!gatewayOk) alerts.push({ level: 'warning', type: 'Service', message: 'Gateway not responding on :18789', timestamp: fmtAlertTime(now) });

    res.json({
      status: alerts.some(a => a.level === 'critical') ? 'critical' : alerts.length > 0 ? 'warning' : 'ok',
      timestamp: now.toISOString(),
      alerts,
      cpu: cpuPercent,
      memory: memPercent,
      disk: diskPercent,
      memTotalGb, memUsedGb, memAvailGb,
      cpuTemp, gpuTemp, socTemp,
      cpuPowerW, systemPowerW,
      gpuPercent, gpuFreqMhz,
      netInKbps, netOutKbps,
      diskReadKbps, diskWriteKbps,
      thermalState, socModel,
      coreCount, eCores, pCores,
      services: { openclaw: openclawOk, ollama: ollamaOk, gateway: gatewayOk },
      topProcesses,
      // Cat 1: Gateway & Sessions
      gatewayReachable, gatewayLatencyMs, gatewayVersion, gatewayHost,
      gatewayServiceRunning, gatewayPid, gatewayStartTime,
      primaryModel, totalSessions,
      // Cat 2: Memory & Knowledge
      memoryFiles, memoryChunks, memoryDirty, memoryDbPath,
      ollamaModel, cacheEntries, vectorEnabled, ftsEnabled,
      ...fsStatsResult,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// Cron Jobs
app.get('/api/crons', async (_req, res) => {
  try {
    const output = await execCommand('openclaw cron list --json');
    res.json(JSON.parse(output));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message, crons: [] });
  }
});

// ─── Cron Scheduler Endpoints ─────────────────────────────────────────────

function parseScheduleDescription(schedule: Record<string, unknown>): string {
  const kind = schedule.kind as string;
  if (kind === 'every') {
    const ms = schedule.everyMs as number;
    if (ms >= 86400000) return `Every ${Math.round(ms / 86400000)}d`;
    if (ms >= 3600000) return `Every ${Math.round(ms / 3600000)}h`;
    if (ms >= 60000) return `Every ${Math.round(ms / 60000)}m`;
    return `Every ${Math.round(ms / 1000)}s`;
  }
  if (kind === 'cron') {
    const expr = schedule.expr as string;
    const tz = (schedule.tz as string) || 'UTC';
    const tzLabel = tz.includes('Hong_Kong') ? 'HKT' : tz.replace(/.*\//, '');
    const parts = expr.split(' ');
    if (parts.length >= 5) {
      const [min, hour, dom, mon, dow] = parts;
      const timeStr = `${hour.padStart(2, '0')}:${min.padStart(2, '0')}`;
      if (dom === '*' && mon === '*') {
        if (dow === '*') return `Daily ${timeStr} ${tzLabel}`;
        if (dow === '1-5') return `Weekdays ${timeStr} ${tzLabel}`;
        if (dow === '0,6') return `Weekends ${timeStr} ${tzLabel}`;
        if (dow === '0') return `Sundays ${timeStr} ${tzLabel}`;
        if (dow === '1') return `Mondays ${timeStr} ${tzLabel}`;
        return `${dow} ${timeStr} ${tzLabel}`;
      }
    }
    return `Cron: ${expr}`;
  }
  if (kind === 'at') {
    const at = schedule.at as number;
    return `One-shot ${new Date(at).toISOString()}`;
  }
  return 'Unknown';
}

// GET /api/cron/jobs — all jobs with parsed schedule
app.get('/api/cron/jobs', async (_req, res) => {
  try {
    const output = await execCommand('openclaw cron list --json');
    const data = JSON.parse(output);
    const jobs = (data.jobs || []).map((job: Record<string, unknown>) => ({
      ...job,
      scheduleDescription: parseScheduleDescription(job.schedule as Record<string, unknown>),
    }));
    res.json({ jobs, total: data.total ?? jobs.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message, jobs: [] });
  }
});

// GET /api/cron/jobs/token-summary — last run token usage + est daily spend for each job
app.get('/api/cron/jobs/token-summary', async (_req, res) => {
  try {
    const listOut = await execCommand('openclaw cron list --json');
    const data = JSON.parse(listOut);
    const jobs: Record<string, unknown>[] = data.jobs || [];

    const summary: Record<string, { lastRunTokens: number; estDailyTokens: number }> = {};

    await Promise.all(
      jobs.map(async (job) => {
        const id = job.id as string;
        try {
          const runOut = await execCommand(`openclaw cron runs --id ${id} --limit 3`);
          const runData = JSON.parse(runOut);
          const entries: Record<string, unknown>[] = runData.entries || runData.runs || [];
          const last = entries[0];
          if (!last) return;
          const usage = last.usage as Record<string, number> | undefined;
          const lastRunTokens = usage?.total_tokens || 0;

          // Estimate daily runs from schedule
          const schedule = job.schedule as Record<string, unknown>;
          let runsPerDay = 1;
          if (schedule?.kind === 'every') {
            const everyMs = Number(schedule.everyMs || 86400000);
            runsPerDay = (24 * 3600 * 1000) / everyMs;
          } else if (schedule?.kind === 'cron') {
            // Rough estimate: count fields to guess frequency
            const expr = String(schedule.expr || '0 0 * * *');
            const parts = expr.trim().split(/\s+/);
            const dayPart = parts[4] || '*';
            const hourPart = parts[1] || '*';
            if (dayPart !== '*') runsPerDay = 1 / 7; // weekly
            else if (hourPart === '*') runsPerDay = 24;
            else runsPerDay = 1;
          }

          summary[id] = {
            lastRunTokens,
            estDailyTokens: Math.round(lastRunTokens * Math.min(runsPerDay, 24)),
          };
        } catch {
          // ignore per-job errors
        }
      })
    );

    res.json({ summary });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message, summary: {} });
  }
});

// GET /api/cron/jobs/:id/runs — run history
app.get('/api/cron/jobs/:id/runs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const output = await execCommand(`openclaw cron runs --id ${req.params.id} --limit ${limit}`);
    res.json(JSON.parse(output));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message, entries: [] });
  }
});

// POST /api/cron/jobs/:id/run — trigger now
app.post('/api/cron/jobs/:id/run', async (req, res) => {
  try {
    const output = await execCommand(`openclaw cron run ${req.params.id}`);
    res.json({ ok: true, output });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// PATCH /api/cron/jobs/:id — enable/disable toggle
app.patch('/api/cron/jobs/:id', async (req, res) => {
  try {
    const { enabled } = req.body as { enabled: boolean };
    const cmd = enabled ? 'enable' : 'disable';
    const output = await execCommand(`openclaw cron ${cmd} ${req.params.id}`);
    res.json({ ok: true, output });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// GET /api/cron/timeline — past+upcoming firings, accepts ?hours=N (default 24)
app.get('/api/cron/timeline', async (req, res) => {
  try {
    const output = await execCommand('openclaw cron list --json');
    const data = JSON.parse(output);
    const now = Date.now();
    const hoursParam = parseInt(req.query.hours as string) || 24;
    const halfWindowMs = (hoursParam / 2) * 60 * 60 * 1000;
    const startMs = now - halfWindowMs;
    const endMs = now + halfWindowMs;
    const timeline: Array<{ jobId: string; jobName: string; firedAtMs: number; status: string }> = [];

    for (const job of data.jobs || []) {
      if (!job.enabled) continue;
      const sched = job.schedule as Record<string, unknown>;
      const state = job.state as Record<string, unknown>;

      // Add last run if within window
      if (state.lastRunAtMs && (state.lastRunAtMs as number) >= startMs && (state.lastRunAtMs as number) <= endMs) {
        timeline.push({
          jobId: job.id,
          jobName: job.name,
          firedAtMs: state.lastRunAtMs as number,
          status: (state.lastStatus as string) || 'unknown',
        });
      }

      // Add next run if within window
      if (state.nextRunAtMs && (state.nextRunAtMs as number) >= startMs && (state.nextRunAtMs as number) <= endMs) {
        timeline.push({
          jobId: job.id,
          jobName: job.name,
          firedAtMs: state.nextRunAtMs as number,
          status: 'scheduled',
        });
      }

      // For 'every' kind, compute firings within window by walking from anchor
      if (sched.kind === 'every') {
        const everyMs = sched.everyMs as number;
        const anchorMs = (sched.anchorMs as number) || (state.lastRunAtMs as number) || now;
        if (everyMs > 0 && everyMs < halfWindowMs * 4) {
          // Find first firing at or after startMs
          const elapsed = startMs - anchorMs;
          const periods = Math.ceil(elapsed / everyMs);
          let t = anchorMs + periods * everyMs;
          // Cap iterations to avoid infinite loops for very small intervals
          let maxIter = 2000;
          while (t <= endMs && maxIter-- > 0) {
            const existing = timeline.find(e => e.jobId === job.id && Math.abs(e.firedAtMs - t) < 60000);
            if (!existing) {
              timeline.push({
                jobId: job.id,
                jobName: job.name,
                firedAtMs: t,
                status: t <= now ? 'ok' : 'scheduled',
              });
            }
            t += everyMs;
          }
        }
      }

      // For 'cron' kind, approximate past firings by backward walk from lastRunAtMs
      // This helps weekly/monthly views show historical entries
      if (sched.kind === 'cron' && state.lastRunAtMs) {
        const lastRun = state.lastRunAtMs as number;
        // Estimate interval from cron expression (rough heuristic)
        const expr = (sched.expr as string) || '';
        const parts = expr.split(' ');
        let estimatedIntervalMs = 24 * 3600000; // default 1 day
        if (parts.length >= 5) {
          const [, hour, dom, , dow] = parts;
          if (dom !== '*' && dom !== '?') {
            estimatedIntervalMs = 30 * 24 * 3600000; // monthly
          } else if (dow !== '*' && dow !== '?') {
            // count days in dow
            const dowParts = dow.split(',');
            estimatedIntervalMs = Math.round((7 / dowParts.length) * 24 * 3600000);
          } else if (hour !== '*') {
            estimatedIntervalMs = 24 * 3600000; // daily
          } else {
            estimatedIntervalMs = 3600000; // hourly
          }
        }
        // Walk backwards from lastRunAtMs
        let t = lastRun - estimatedIntervalMs;
        let steps = 0;
        const maxSteps = Math.min(60, Math.ceil(halfWindowMs * 2 / estimatedIntervalMs) + 2);
        while (t >= startMs && steps < maxSteps) {
          const existing = timeline.find(e => e.jobId === job.id && Math.abs(e.firedAtMs - t) < 60000);
          if (!existing && t <= now) {
            timeline.push({
              jobId: job.id,
              jobName: job.name,
              firedAtMs: t,
              status: 'ok',
            });
          }
          t -= estimatedIntervalMs;
          steps++;
        }
        // Also walk forward from lastRunAtMs for future scheduled entries
        t = lastRun + estimatedIntervalMs;
        steps = 0;
        while (t <= endMs && steps < maxSteps) {
          const existing = timeline.find(e => e.jobId === job.id && Math.abs(e.firedAtMs - t) < 60000);
          if (!existing && t > now) {
            timeline.push({
              jobId: job.id,
              jobName: job.name,
              firedAtMs: t,
              status: 'scheduled',
            });
          }
          t += estimatedIntervalMs;
          steps++;
        }
      }
    }

    timeline.sort((a, b) => a.firedAtMs - b.firedAtMs);
    res.json({ timeline, windowStartMs: startMs, windowEndMs: endMs, nowMs: now });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message, timeline: [] });
  }
});

// POST /api/cron/jobs — create new job
app.post('/api/cron/jobs', async (req, res) => {
  try {
    const { name, scheduleKind, every, cronExpr, message, model, sessionTarget, announce } = req.body as {
      name: string;
      scheduleKind: 'every' | 'cron';
      every?: string;
      cronExpr?: string;
      message: string;
      model?: string;
      sessionTarget?: string;
      announce?: boolean;
    };
    if (!name || !message) return res.status(400).json({ error: 'name and message are required' });

    const parts: string[] = ['openclaw cron add'];
    parts.push(`--name "${name}"`);
    if (scheduleKind === 'every' && every) parts.push(`--every "${every}"`);
    if (scheduleKind === 'cron' && cronExpr) parts.push(`--cron "${cronExpr}"`);
    parts.push(`--message "${message.replace(/"/g, '\\"')}"`);
    if (model) parts.push(`--model "${model}"`);
    parts.push(`--session "${sessionTarget || 'isolated'}"`);
    if (announce) parts.push('--announce');
    parts.push('--json');

    const output = await execCommand(parts.join(' '));
    res.json({ ok: true, result: JSON.parse(output) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// PUT /api/cron/jobs/:id — edit job (name, schedule, message, model)
app.put('/api/cron/jobs/:id', async (req, res) => {
  try {
    const { name, scheduleKind, every, cronExpr, message, model, sessionTarget } = req.body as {
      name?: string;
      scheduleKind?: 'every' | 'cron';
      every?: string;
      cronExpr?: string;
      message?: string;
      model?: string;
      sessionTarget?: string;
    };
    const parts: string[] = [`openclaw cron edit ${req.params.id}`];
    if (name) parts.push(`--name "${name}"`);
    if (scheduleKind === 'every' && every) parts.push(`--every "${every}"`);
    if (scheduleKind === 'cron' && cronExpr) parts.push(`--cron "${cronExpr}"`);
    if (message) parts.push(`--message "${message.replace(/"/g, '\\"')}"`);
    if (model) parts.push(`--model "${model}"`);
    if (sessionTarget) parts.push(`--session "${sessionTarget}"`);

    const output = await execCommand(parts.join(' '));
    res.json({ ok: true, output });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// ─── Model History (Token Consumption) ───────────────────────

app.get('/api/model/history', async (req, res) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days as string) || 30, 1), 365);
    const output = await execCommand('openclaw sessions --json --all-agents');
    const parsed = JSON.parse(output);
    const rawSessions: Array<Record<string, unknown>> = parsed.sessions || [];

    const cutoffMs = Date.now() - days * 86400000;
    const dayMap: Record<string, { total: number; byModel: Record<string, number> }> = {};

    for (const s of rawSessions) {
      const updatedAt = Number(s.updatedAt || 0);
      if (updatedAt < cutoffMs) continue;
      const tokens = Number(s.totalTokens || 0);
      if (tokens <= 0) continue;
      const model = String(s.model || 'unknown');
      const date = new Date(updatedAt).toISOString().split('T')[0];

      if (!dayMap[date]) dayMap[date] = { total: 0, byModel: {} };
      dayMap[date].total += tokens;
      dayMap[date].byModel[model] = (dayMap[date].byModel[model] || 0) + tokens;
    }

    const result = Object.entries(dayMap)
      .map(([date, data]) => ({ date, total: data.total, byModel: data.byModel }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({ days: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message, days: [] });
  }
});

// Sessions (enriched)
const CHANNEL_NAME_MAP: Record<string, string> = {
  'c0aes69kg2d': '#nat-2_nat-portal',
  'c0ae9smqt8d': '#nat-1_clawbot-system',
  'c0aea7jbgkx': '#nat-4_deep_research',
  'c0ae78n7gsf': '#nat-5_personal-assistant',
  'c0ady6su1c7': '#nat-3',
  'c0absgutgb1': '#team_openclaw',
};

function classifySession(key: string): { sessionType: string; label: string } {
  if (/^agent:[^:]+:slack:channel:/.test(key)) {
    const chanId = key.split(':').pop() || '';
    const name = CHANNEL_NAME_MAP[chanId] || `#${chanId}`;
    return { sessionType: 'slack-channel', label: name };
  }
  if (/^agent:[^:]+:slack:dm:/.test(key)) {
    const dmId = key.split(':').pop() || '';
    return { sessionType: 'slack-dm', label: `DM: ${dmId}` };
  }
  if (/^agent:[^:]+:subagent:/.test(key)) {
    const parts = key.split(':');
    const agentId = parts[1] || 'unknown';
    return { sessionType: 'subagent', label: `Sub-agent: ${agentId}` };
  }
  if (/^agent:[^:]+:cron:/.test(key)) {
    const cronName = key.split(':').slice(3).join(':') || 'unknown';
    return { sessionType: 'cron', label: `Cron: ${cronName}` };
  }
  if (/^agent:[^:]+:main$/.test(key)) {
    const agentId = key.split(':')[1] || 'main';
    return { sessionType: 'main', label: `Main: ${agentId}` };
  }
  return { sessionType: 'other', label: key };
}

app.get('/api/sessions', async (_req, res) => {
  try {
    const output = await execCommand('openclaw sessions --json --all-agents');
    const parsed = JSON.parse(output);
    const rawSessions: Array<Record<string, unknown>> = parsed.sessions || [];

    const sessions = rawSessions.map((s) => {
      const key = String(s.key || '');
      const ageMs = Number(s.ageMs || 0);
      const { sessionType, label } = classifySession(key);
      return {
        ...s,
        sessionType,
        label,
        isActive: ageMs < 300000,
        isRecent: ageMs < 3600000,
      };
    });

    // Stats
    const totalTokens = sessions.reduce((sum, s) => sum + Number(s.totalTokens || 0), 0);
    const active = sessions.filter((s) => s.isActive).length;
    const recentHour = sessions.filter((s) => s.isRecent).length;

    const byModel: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byAgent: Record<string, { count: number; tokens: number }> = {};
    const tokensByModel: Record<string, number> = {};
    const tokensByType: Record<string, number> = {};

    for (const s of sessions) {
      const model = String(s.model || 'unknown');
      const tokens = Number(s.totalTokens || 0);
      byModel[model] = (byModel[model] || 0) + 1;
      tokensByModel[model] = (tokensByModel[model] || 0) + tokens;

      const st = String(s.sessionType);
      byType[st] = (byType[st] || 0) + 1;
      tokensByType[st] = (tokensByType[st] || 0) + tokens;

      const agent = String(s.agentId || 'unknown');
      if (!byAgent[agent]) byAgent[agent] = { count: 0, tokens: 0 };
      byAgent[agent].count++;
      byAgent[agent].tokens += tokens;
    }

    res.json({
      sessions,
      stats: { total: sessions.length, active, recentHour, totalTokens, byModel, byType, byAgent, tokensByModel, tokensByType },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message, sessions: [], stats: {} });
  }
});

// ClickUp Tasks
app.get('/api/tasks', async (_req, res) => {
  try {
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${CLICKUP_TASK_LIST}/task?subtasks=true&include_closed=true`,
      { headers: { Authorization: CLICKUP_TOKEN } }
    );
    const data = await response.json();
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message, tasks: [] });
  }
});

// Memory Stats
app.get('/api/memory/stats', async (_req, res) => {
  try {
    const memoryDir = path.join(OPENCLAW_WORKSPACE, 'memory');
    const archiveDir = path.join(OPENCLAW_WORKSPACE, 'memory', 'archive');
    const dbPath = '/Users/natlee/.openclaw/memory/main.sqlite';

    let dailyLogs = 0;
    let archived = 0;
    let dbSizeMb = 0;
    let totalFiles = 0;
    let lastUpdated = '';

    try {
      const files = await fs.readdir(memoryDir);
      dailyLogs = files.filter(f => f.endsWith('.md')).length;
      totalFiles = files.length;
      const stats = await fs.stat(memoryDir);
      lastUpdated = stats.mtime.toISOString();
    } catch { /* dir may not exist */ }

    try {
      const archiveFiles = await fs.readdir(archiveDir);
      archived = archiveFiles.length;
    } catch { /* dir may not exist */ }

    try {
      const dbStats = await fs.stat(dbPath);
      dbSizeMb = Math.round((dbStats.size / (1024 * 1024)) * 100) / 100;
    } catch { /* db may not exist */ }

    res.json({ dailyLogs, archived, dbSizeMb, totalFiles, lastUpdated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// Memory — Force Reindex
app.post('/api/memory/reindex', async (_req, res) => {
  try {
    const output = await execCommand(
      `PATH=/opt/homebrew/bin:$PATH openclaw memory index --force`
    );
    res.json({ ok: true, output });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    res.status(500).json({ ok: false, error: message });
  }
});

// Memory — Run Janitor
app.post('/api/memory/janitor', async (_req, res) => {
  try {
    const janitorPath = '/Users/natlee/.openclaw/workspace/scripts/memory-janitor.py';
    const output = await execCommand(
      `PATH=/opt/homebrew/bin:$PATH python3 "${janitorPath}"`
    );
    res.json({ ok: true, output });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    res.status(500).json({ ok: false, error: message });
  }
});

// Memory — Read MEMORY.md content
app.get('/api/memory/file', async (_req, res) => {
  try {
    const memPath = '/Users/natlee/.openclaw/workspace/MEMORY.md';
    const content = await fs.readFile(memPath, 'utf-8');
    res.json({ ok: true, content, path: memPath });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    res.status(500).json({ ok: false, error: message });
  }
});

// Memory — Save MEMORY.md content
app.put('/api/memory/file', async (req, res) => {
  try {
    const { content } = req.body as { content: string };
    if (typeof content !== 'string') {
      return res.status(400).json({ ok: false, error: 'content is required' });
    }
    const memPath = '/Users/natlee/.openclaw/workspace/MEMORY.md';
    // Backup before overwrite
    const backupPath = memPath + '.bak';
    try { await fs.copyFile(memPath, backupPath); } catch { /* ok if no existing file */ }
    await fs.writeFile(memPath, content, 'utf-8');
    const lines = content.split('\n').length;
    res.json({ ok: true, lines });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    res.status(500).json({ ok: false, error: message });
  }
});

// Gateway — Restart
app.post('/api/gateway/restart', async (_req, res) => {
  try {
    // Fire restart non-blocking — response goes out first, then gateway restarts
    setTimeout(() => {
      exec('PATH=/opt/homebrew/bin:$PATH openclaw gateway restart', { timeout: 10000 }, () => {});
    }, 500);
    res.json({ ok: true, message: 'Gateway restart initiated' });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    res.status(500).json({ ok: false, error: message });
  }
});

// Agents
app.get('/api/agents', async (_req, res) => {
  try {
    const configPath = '/Users/natlee/.openclaw/openclaw.json';
    const data = JSON.parse(await fs.readFile(configPath, 'utf-8'));
    const agents = (data.agents?.list || []).map((a: Record<string, unknown>) => ({
      name: a.name,
      model: a.model,
      emoji: a.emoji,
      description: a.description,
      tools: a.tools,
    }));
    res.json({ agents });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message, agents: [] });
  }
});

// ─── Model Config ────────────────────────────────────────────

const OPENCLAW_CONFIG_PATH = '/Users/natlee/.openclaw/openclaw.json';

function generateModelLabel(modelId: string): string {
  // Extract the last segment after all slashes (e.g. 'claude-sonnet-4-6', 'gemini-2.5-pro')
  const parts = modelId.split('/');
  const raw = parts[parts.length - 1];
  // Clean up common suffixes and format nicely
  return raw
    .replace(/:free$/, '')
    .replace(/-instruct$/, '')
    .split('-')
    .map(seg => {
      // Keep version numbers as-is
      if (/^\d/.test(seg)) return seg;
      // Capitalize known abbreviations
      if (seg.toLowerCase() === 'ai') return 'AI';
      if (seg.toLowerCase() === 'pro') return 'Pro';
      if (seg.toLowerCase() === 'flash') return 'Flash';
      if (seg.toLowerCase() === 'turbo') return 'Turbo';
      if (seg.toLowerCase() === 'latest') return 'Latest';
      if (seg.toLowerCase() === 'preview') return 'Preview';
      return seg.charAt(0).toUpperCase() + seg.slice(1);
    })
    .join(' ')
    // Collapse version patterns: "4 6" → "4.6", "2 5" → "2.5", "3 3" → "3.3"
    .replace(/(\d+)\s+(\d+)/g, '$1.$2');
}

async function getAvailableModels(): Promise<Array<{ id: string; alias: string; label: string }>> {
  const data = JSON.parse(await fs.readFile(OPENCLAW_CONFIG_PATH, 'utf-8'));
  const modelsMap = data.agents?.defaults?.models ?? {};
  return Object.entries(modelsMap).map(([id, val]) => ({
    id,
    alias: (val as Record<string, string>)?.alias ?? '',
    label: generateModelLabel(id),
  }));
}

app.get('/api/config/model', async (_req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(OPENCLAW_CONFIG_PATH, 'utf-8'));
    const modelDefaults = data.agents?.defaults?.model ?? {};
    const primary: string = modelDefaults.primary ?? '';
    const fallbacks: string[] = modelDefaults.fallbacks ?? [];
    const availableModels = await getAvailableModels();
    res.json({ primary, fallbacks, availableModels });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.get('/api/config/model/available', async (_req, res) => {
  try {
    const availableModels = await getAvailableModels();
    res.json({ models: availableModels });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.post('/api/config/model', async (req, res) => {
  try {
    const { primary, fallbacks } = req.body as { primary: string; fallbacks: string[] };
    if (!primary || !Array.isArray(fallbacks)) {
      res.status(400).json({ error: 'primary (string) and fallbacks (string[]) are required' });
      return;
    }
    const data = JSON.parse(await fs.readFile(OPENCLAW_CONFIG_PATH, 'utf-8'));
    if (!data.agents) data.agents = {};
    if (!data.agents.defaults) data.agents.defaults = {};
    if (!data.agents.defaults.model) data.agents.defaults.model = {};
    data.agents.defaults.model.primary = primary;
    data.agents.defaults.model.fallbacks = fallbacks;
    await fs.writeFile(OPENCLAW_CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// ─── Model Stats ─────────────────────────────────────────────

const MODEL_PRICING: Record<string, { input: number; output: number; free?: boolean }> = {
  'claude-opus-4-6':              { input: 15.0,  output: 75.0 },
  'claude-sonnet-4-6':            { input: 3.0,   output: 15.0 },
  'claude-haiku-4-5':             { input: 0.8,   output: 4.0  },
  'claude-opus-4-5':              { input: 15.0,  output: 75.0 },
  'claude-sonnet-4-5':            { input: 3.0,   output: 15.0 },
  'gemini-3-pro-preview':         { input: 1.25,  output: 10.0 },
  'google/gemini-2.5-pro':        { input: 1.25,  output: 10.0 },
  'google/gemini-2.5-flash':      { input: 0.15,  output: 0.60 },
  'google/gemini-3-pro-preview':  { input: 1.25,  output: 10.0 },
  'deepseek/deepseek-r1':         { input: 0.55,  output: 2.19 },
  'x-ai/grok-4':                  { input: 3.0,   output: 15.0 },
  'x-ai/grok-3':                  { input: 3.0,   output: 9.0  },
  'moonshot/kimi-latest':         { input: 0.14,  output: 0.56 },
  'moonshot/kimi-k2-thinking-turbo': { input: 0.14, output: 0.56 },
  'minimax/minimax-m2.5':         { input: 0.20,  output: 1.10 },
  'minimax/minimax-m1':           { input: 0.30,  output: 1.10 },
  'qwen/qwen3-coder:free':        { input: 0, output: 0, free: true },
  'meta-llama/llama-3.3-70b-instruct:free': { input: 0, output: 0, free: true },
  'google/gemma-3-27b-it:free':   { input: 0, output: 0, free: true },
};

function getModelPrice(modelId: string): { input: number; output: number; free?: boolean } {
  if (MODEL_PRICING[modelId]) return MODEL_PRICING[modelId];
  const short = modelId.split('/').slice(1).join('/');
  if (short && MODEL_PRICING[short]) return MODEL_PRICING[short];
  return { input: 3.0, output: 15.0 };
}

function estimateModelCost(tokens: number, modelId: string): number {
  const p = getModelPrice(modelId);
  return (tokens / 1_000_000) * (p.input * 0.8 + p.output * 0.2);
}

function getContextTokens(modelId: string): number {
  const lower = modelId.toLowerCase();
  if (lower.includes('claude')) return 200000;
  if (lower.includes('gemini-2.5') || lower.includes('gemini-3')) return 1048576;
  if (lower.includes('kimi')) return 131072;
  if (lower.includes('grok-4')) return 256000;
  if (lower.includes('grok-3')) return 131072;
  if (lower.includes('deepseek-r1')) return 163840;
  return 131072;
}

function getModelProvider(modelId: string): string {
  if (modelId.startsWith('anthropic/') || modelId.startsWith('claude')) return 'anthropic';
  if (modelId.startsWith('moonshot/')) return 'moonshot';
  return 'openrouter';
}

function getSubProvider(modelId: string): string {
  const parts = modelId.split('/');
  if (parts.length >= 2) {
    const prefix = parts[0].toLowerCase();
    if (['google', 'x-ai', 'deepseek', 'meta-llama', 'qwen', 'minimax'].includes(prefix)) return prefix;
  }
  return '';
}

app.get('/api/model/stats', async (_req, res) => {
  try {
    // 1. Get model config
    const data = JSON.parse(await fs.readFile(OPENCLAW_CONFIG_PATH, 'utf-8'));
    const modelDefaults = data.agents?.defaults?.model ?? {};
    const primary: string = modelDefaults.primary ?? '';
    const fallbacks: string[] = modelDefaults.fallbacks ?? [];
    const modelsMap: Record<string, Record<string, string>> = data.agents?.defaults?.models ?? {};

    // Build available models list
    const availableModels = Object.entries(modelsMap).map(([id, val]) => {
      const alias = val?.alias ?? '';
      const pricing = getModelPrice(id);
      const fallbackIdx = fallbacks.indexOf(id);
      return {
        id,
        alias,
        label: generateModelLabel(id),
        provider: getModelProvider(id),
        subProvider: getSubProvider(id),
        isPrimary: id === primary,
        isFallback: fallbackIdx >= 0,
        fallbackOrder: fallbackIdx >= 0 ? fallbackIdx + 1 : undefined,
        pricing: { input: pricing.input, output: pricing.output, free: !!pricing.free },
        contextTokens: getContextTokens(id),
      };
    });

    // 2. Get sessions data
    let sessions: Array<Record<string, unknown>> = [];
    try {
      const output = await execCommand('openclaw sessions --json --all-agents');
      const parsed = JSON.parse(output);
      sessions = parsed.sessions || [];
    } catch { /* empty sessions if command fails */ }

    // 3. Compute token breakdown per model
    const byModelMap: Record<string, { sessions: number; tokens: number }> = {};
    for (const s of sessions) {
      const model = String(s.model || 'unknown');
      const tokens = Number(s.totalTokens || 0);
      if (!byModelMap[model]) byModelMap[model] = { sessions: 0, tokens: 0 };
      byModelMap[model].sessions++;
      byModelMap[model].tokens += tokens;
    }

    const totalTokens = sessions.reduce((sum, s) => sum + Number(s.totalTokens || 0), 0);
    const totalCostEstimate = Object.entries(byModelMap).reduce((sum, [modelId, d]) => {
      return sum + estimateModelCost(d.tokens, modelId);
    }, 0);

    const byModel = Object.entries(byModelMap)
      .map(([modelId, d]) => ({
        modelId,
        label: generateModelLabel(modelId),
        provider: getModelProvider(modelId),
        sessions: d.sessions,
        tokens: d.tokens,
        pct: totalTokens > 0 ? (d.tokens / totalTokens) * 100 : 0,
        costEstimate: estimateModelCost(d.tokens, modelId),
      }))
      .sort((a, b) => b.tokens - a.tokens);

    // 4. Top sessions by token usage
    const topSessions = sessions
      .map((s) => {
        const key = String(s.key || '');
        const { sessionType, label } = classifySession(key);
        const model = String(s.model || 'unknown');
        const tokens = Number(s.totalTokens || 0);
        return {
          label,
          model,
          tokens,
          costEstimate: estimateModelCost(tokens, model),
          ageMs: Number(s.ageMs || 0),
          sessionType,
        };
      })
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 10);

    res.json({
      config: { primary, fallbacks },
      availableModels,
      tokenStats: { total: totalTokens, totalCostEstimate, byModel },
      topSessions,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// ─── API Keys Management ─────────────────────────────────────

function maskKey(key: string): string {
  if (!key || key.length < 12) return '••••';
  return key.slice(0, 8) + '...' + key.slice(-4);
}

app.get('/api/config/keys', async (_req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(OPENCLAW_CONFIG_PATH, 'utf-8'));
    const providers: Record<string, Record<string, unknown>> = data.models?.providers ?? {};

    const keys = Object.entries(providers).map(([provider, config]) => {
      const apiKey = (config.apiKey as string) || '';
      const updatedAt = (config._keyUpdatedAt as string) || null;
      return {
        provider,
        label: ({ openrouter: 'OpenRouter', moonshot: 'Moonshot (Kimi)', anthropic: 'Anthropic' } as Record<string,string>)[provider] ?? (provider.charAt(0).toUpperCase() + provider.slice(1)),
        keyPreview: apiKey ? maskKey(apiKey) : '',
        keyLength: apiKey.length,
        hasKey: !!apiKey,
        updatedAt,
      };
    });

    // Add managed Anthropic entry
    keys.unshift({
      provider: 'anthropic',
      label: 'Anthropic (Claude)',
      keyPreview: '(managed via system keychain)',
      keyLength: 0,
      hasKey: true,
      managed: true,
    } as typeof keys[number] & { managed: boolean });

    res.json({ keys });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.put('/api/config/keys/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const { apiKey } = req.body as { apiKey: string };
    if (!apiKey) {
      res.status(400).json({ error: 'apiKey is required' });
      return;
    }
    const data = JSON.parse(await fs.readFile(OPENCLAW_CONFIG_PATH, 'utf-8'));
    if (!data.models) data.models = {};
    if (!data.models.providers) data.models.providers = {};
    if (!data.models.providers[provider]) data.models.providers[provider] = {};
    data.models.providers[provider].apiKey = apiKey;
    data.models.providers[provider]._keyUpdatedAt = new Date().toISOString();
    await fs.writeFile(OPENCLAW_CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// Return full key for copy (owner-only local portal)
app.get('/api/config/keys/:provider/value', async (req, res) => {
  try {
    const { provider } = req.params;
    const data = JSON.parse(await fs.readFile(OPENCLAW_CONFIG_PATH, 'utf-8'));
    const apiKey = data.models?.providers?.[provider]?.apiKey || '';
    if (!apiKey) { res.status(404).json({ error: 'No key set' }); return; }
    res.json({ apiKey });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.delete('/api/config/keys/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const data = JSON.parse(await fs.readFile(OPENCLAW_CONFIG_PATH, 'utf-8'));
    if (data.models?.providers?.[provider]) {
      data.models.providers[provider].apiKey = '';
    }
    await fs.writeFile(OPENCLAW_CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// Restart gateway
app.post('/api/config/restart', (_req, res) => {
  try {
    const child = spawn('openclaw', ['gateway', 'restart'], {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
    res.json({ ok: true, message: 'Restart initiated' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// Files listing
app.get('/api/files', async (req, res) => {
  try {
    const requestedPath = (req.query.path as string) || OPENCLAW_WORKSPACE;
    const resolved = path.resolve(requestedPath);
    if (!resolved.startsWith(OPENCLAW_WORKSPACE)) {
      res.status(403).json({ error: 'Access restricted to workspace directory' });
      return;
    }
    const entries = await fs.readdir(resolved, { withFileTypes: true });
    const files = entries.map(e => ({
      name: e.name,
      type: e.isDirectory() ? 'directory' : 'file',
      path: path.join(resolved, e.name),
    }));
    res.json({ path: resolved, files });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// File content
app.get('/api/files/content', async (req, res) => {
  try {
    const filePath = req.query.path as string;
    if (!filePath) {
      res.status(400).json({ error: 'path query parameter required' });
      return;
    }
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(OPENCLAW_WORKSPACE)) {
      res.status(403).json({ error: 'Access restricted to workspace directory' });
      return;
    }
    const stats = await fs.stat(resolved);
    if (stats.size > 100 * 1024) {
      res.status(413).json({ error: 'File too large (max 100KB)' });
      return;
    }
    const content = await fs.readFile(resolved, 'utf-8');
    res.json({ path: resolved, content, size: stats.size });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS API
// ─────────────────────────────────────────────────────────────────────────────

const CUSTOM_SKILLS_DIR = path.join(OPENCLAW_WORKSPACE, 'skills', 'skills');
const ALT_SKILLS_DIR    = path.join(OPENCLAW_WORKSPACE, 'skills');
const SYSTEM_SKILLS_DIR = '/opt/homebrew/lib/node_modules/openclaw/skills';
const SKILLS_REGISTRY   = path.join(OPENCLAW_WORKSPACE, 'SKILLS-REGISTRY.md');

type SkillType   = 'custom' | 'system';
type SkillStatus = 'ready' | 'needs-setup' | 'disabled';

interface SkillMeta {
  id: string;
  name: string;
  emoji: string;
  description: string;
  path: string;
  type: SkillType;
  status: SkillStatus;
  category: string;
  tags: string[];
  hasContract: boolean;
  addedDate?: string;
  version?: string;
}

// Parse first 30 lines of a SKILL.md for metadata
async function parseSkillMeta(skillPath: string): Promise<Partial<SkillMeta>> {
  try {
    const content = await fs.readFile(skillPath, 'utf-8');
    const lines = content.split('\n').slice(0, 40);
    const meta: Partial<SkillMeta> = {};

    // Title from H1
    const h1 = lines.find(l => l.startsWith('# '));
    if (h1) {
      const title = h1.slice(2).trim();
      // Extract emoji if present
      const emojiMatch = title.match(/^([\u{1F300}-\u{1FFFF}\u{2600}-\u{26FF}☁️🍎⚙️🔷📡🏗️🗄️📋💬💼✍️📧📰💻💰📊🎼🛠️🤖🔒📬🎬♊️🍌📦🌤️])/u);
      if (emojiMatch) {
        meta.emoji = emojiMatch[1];
        meta.name = title.slice(emojiMatch[1].length).trim();
      } else {
        meta.name = title;
      }
    }

    // Version
    const versionLine = lines.find(l => l.toLowerCase().startsWith('**version:**'));
    if (versionLine) {
      meta.version = versionLine.replace(/\*\*version:\*\*/i, '').trim();
    }

    // Has contract
    meta.hasContract = content.includes('## Contract');

    // Description from first non-empty paragraph after metadata
    const overviewIdx = lines.findIndex(l => l.startsWith('## Overview') || l.startsWith('## Description'));
    if (overviewIdx > -1) {
      const descLine = lines.slice(overviewIdx + 1).find(l => l.trim() && !l.startsWith('#'));
      if (descLine) meta.description = descLine.trim().slice(0, 120);
    }

    return meta;
  } catch {
    return {};
  }
}

// Discover all skills from filesystem
async function discoverSkills(): Promise<SkillMeta[]> {
  const skills: SkillMeta[] = [];

  // Helper: scan a directory for SKILL.md files
  async function scanDir(dir: string, type: SkillType, category: string): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const skillMdPath = path.join(dir, entry.name, 'SKILL.md');
        try {
          await fs.access(skillMdPath);
          const parsedMeta = await parseSkillMeta(skillMdPath);
          const stat = await fs.stat(skillMdPath);
          skills.push({
            id: entry.name,
            name: parsedMeta.name ?? entry.name,
            emoji: parsedMeta.emoji ?? '🛠️',
            description: parsedMeta.description ?? '',
            path: skillMdPath,
            type,
            status: 'ready',
            category,
            tags: [entry.name],
            hasContract: parsedMeta.hasContract ?? false,
            version: parsedMeta.version,
            addedDate: stat.birthtime.toISOString().split('T')[0],
          });
        } catch {
          // no SKILL.md — skip
        }
      }
    } catch {
      // dir doesn't exist — skip
    }
  }

  await Promise.all([
    scanDir(CUSTOM_SKILLS_DIR, 'custom', 'Custom'),
    scanDir(SYSTEM_SKILLS_DIR, 'system', 'System'),
  ]);

  // Also scan alt custom skill dirs (skills/linkedin, skills/google-workspace, etc.)
  try {
    const altEntries = await fs.readdir(ALT_SKILLS_DIR, { withFileTypes: true });
    for (const entry of altEntries) {
      if (!entry.isDirectory() || entry.name === 'skills') continue;
      const skillMdPath = path.join(ALT_SKILLS_DIR, entry.name, 'SKILL.md');
      try {
        await fs.access(skillMdPath);
        // Only add if not already in list
        if (!skills.find(s => s.id === entry.name)) {
          const parsedMeta = await parseSkillMeta(skillMdPath);
          const stat = await fs.stat(skillMdPath);
          skills.push({
            id: entry.name,
            name: parsedMeta.name ?? entry.name,
            emoji: parsedMeta.emoji ?? '🛠️',
            description: parsedMeta.description ?? '',
            path: skillMdPath,
            type: 'custom',
            status: 'ready',
            category: 'Business Operations',
            tags: [entry.name],
            hasContract: parsedMeta.hasContract ?? false,
            version: parsedMeta.version,
            addedDate: stat.birthtime.toISOString().split('T')[0],
          });
        }
      } catch { /* skip */ }
    }
  } catch { /* skip */ }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

// GET /api/skills — list all skills
app.get('/api/skills', async (_req, res) => {
  try {
    const skills = await discoverSkills();
    const total = skills.length;
    const custom = skills.filter(s => s.type === 'custom').length;
    const system = skills.filter(s => s.type === 'system').length;
    const ready = skills.filter(s => s.status === 'ready').length;
    const withContract = skills.filter(s => s.hasContract).length;
    res.json({
      skills,
      stats: { total, custom, system, ready, needsSetup: total - ready, withContract },
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// GET /api/skills/:id — skill metadata only
app.get('/api/skills/:id', async (req, res) => {
  try {
    const skills = await discoverSkills();
    const skill = skills.find(s => s.id === req.params.id);
    if (!skill) { res.status(404).json({ error: 'Skill not found' }); return; }
    res.json(skill);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// GET /api/skills/:id/content — read SKILL.md content
app.get('/api/skills/:id/content', async (req, res) => {
  try {
    const skills = await discoverSkills();
    const skill = skills.find(s => s.id === req.params.id);
    if (!skill) { res.status(404).json({ error: 'Skill not found' }); return; }

    const stat = await fs.stat(skill.path);
    if (stat.size > 200 * 1024) {
      res.status(413).json({ error: 'Skill file too large (max 200KB)' });
      return;
    }
    const content = await fs.readFile(skill.path, 'utf-8');
    res.json({
      id: skill.id,
      path: skill.path,
      content,
      size: stat.size,
      lastModified: stat.mtime.toISOString(),
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// PUT /api/skills/:id/content — write SKILL.md content (custom skills only)
app.put('/api/skills/:id/content', async (req, res) => {
  try {
    const { content } = req.body as { content: string };
    if (typeof content !== 'string') {
      res.status(400).json({ error: 'content (string) is required in body' });
      return;
    }
    if (content.length > 200 * 1024) {
      res.status(413).json({ error: 'Content too large (max 200KB)' });
      return;
    }

    const skills = await discoverSkills();
    const skill = skills.find(s => s.id === req.params.id);
    if (!skill) { res.status(404).json({ error: 'Skill not found' }); return; }
    if (skill.type === 'system') {
      res.status(403).json({ error: 'System skills are read-only' });
      return;
    }

    // Write file
    await fs.writeFile(skill.path, content, 'utf-8');
    const stat = await fs.stat(skill.path);
    res.json({
      ok: true,
      id: skill.id,
      path: skill.path,
      size: stat.size,
      lastModified: stat.mtime.toISOString(),
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// POST /api/skills — create new skill
app.post('/api/skills', async (req, res) => {
  try {
    const { id, name, emoji, description, category, tags, content } = req.body as {
      id: string; name: string; emoji?: string; description: string;
      category?: string; tags?: string[]; content?: string;
    };

    if (!id || !name || !description) {
      res.status(400).json({ error: 'id, name, and description are required' });
      return;
    }

    // Validate id (slug format)
    if (!/^[a-z0-9-]+$/.test(id)) {
      res.status(400).json({ error: 'id must be lowercase letters, numbers, and hyphens only' });
      return;
    }

    const skillDir = path.join(CUSTOM_SKILLS_DIR, id);
    const skillMdPath = path.join(skillDir, 'SKILL.md');

    // Check if already exists
    try {
      await fs.access(skillMdPath);
      res.status(409).json({ error: `Skill '${id}' already exists at ${skillMdPath}` });
      return;
    } catch { /* good — doesn't exist yet */ }

    // Create directory and SKILL.md
    await fs.mkdir(skillDir, { recursive: true });

    const skillContent = content ?? `# ${emoji ?? '🛠️'} ${name}

**Version:** 1.0
**Last Updated:** ${new Date().toISOString().split('T')[0]}
**Tags:** ${(tags ?? [id]).join(', ')}

---

## Overview

${description}

---

## Contract

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| \`input\` | string | ✅ | — | Primary input |

### Output

Description of output.

### Errors

| Code | Condition | Recovery |
|------|-----------|---------|
| ERR_001 | Missing input | Provide required parameter |

### Example

\`\`\`
Example usage of ${name}
\`\`\`

---

## Instructions

1. Step one
2. Step two
3. Step three

---

## Notes

- Category: ${category ?? 'Business Operations'}
- Added: ${new Date().toISOString().split('T')[0]}

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | ${new Date().toISOString().split('T')[0]} | Initial creation |
`;

    await fs.writeFile(skillMdPath, skillContent, 'utf-8');

    // Append to SKILLS-REGISTRY.md
    try {
      const registry = await fs.readFile(SKILLS_REGISTRY, 'utf-8');
      const entry = `| ${emoji ?? '🛠️'} ${id} | ${description.slice(0, 80)} | \`skills/skills/${id}/SKILL.md\` | ⏸ Needs Setup |\n`;
      // Insert before system skills section or at end
      const insertBefore = '## System Skills';
      const updatedRegistry = registry.includes(insertBefore)
        ? registry.replace(insertBefore, `${entry}\n${insertBefore}`)
        : registry + '\n' + entry;
      await fs.writeFile(SKILLS_REGISTRY, updatedRegistry, 'utf-8');
    } catch { /* registry update is best-effort */ }

    res.status(201).json({
      ok: true,
      skill: {
        id, name,
        emoji: emoji ?? '🛠️',
        description,
        path: skillMdPath,
        type: 'custom',
        status: 'needs-setup',
        category: category ?? 'Business Operations',
        tags: tags ?? [id],
        hasContract: true, // template includes contract
        version: '1.0',
        addedDate: new Date().toISOString().split('T')[0],
      },
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// DELETE /api/skills/:id — delete custom skill (moves to trash, not permanent)
app.delete('/api/skills/:id', async (req, res) => {
  try {
    const skills = await discoverSkills();
    const skill = skills.find(s => s.id === req.params.id);
    if (!skill) { res.status(404).json({ error: 'Skill not found' }); return; }
    if (skill.type === 'system') {
      res.status(403).json({ error: 'Cannot delete system skills' });
      return;
    }

    // Move to trash instead of delete
    const trashDir = path.join(OPENCLAW_WORKSPACE, 'skills', '.trash');
    await fs.mkdir(trashDir, { recursive: true });
    const skillDir = path.dirname(skill.path);
    const trashDest = path.join(trashDir, `${req.params.id}-${Date.now()}`);
    await fs.rename(skillDir, trashDest);

    res.json({ ok: true, message: `Skill '${req.params.id}' moved to trash at ${trashDest}` });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// GET /api/skills/stats — usage stats (from memory search)
app.get('/api/skills/stats', async (_req, res) => {
  try {
    const skills = await discoverSkills();
    const registryContent = await fs.readFile(SKILLS_REGISTRY, 'utf-8').catch(() => '');

    // Count registry entries per status
    const readyCount    = (registryContent.match(/✓ Ready/g) ?? []).length;
    const setupCount    = (registryContent.match(/⏸ Needs Setup/g) ?? []).length;
    const contractCount = skills.filter(s => s.hasContract).length;
    const customSkills  = skills.filter(s => s.type === 'custom');

    res.json({
      total: skills.length,
      custom: customSkills.length,
      system: skills.filter(s => s.type === 'system').length,
      ready: readyCount,
      needsSetup: setupCount,
      contractCoverage: customSkills.length
        ? Math.round((contractCount / customSkills.length) * 100)
        : 0,
      withContract: contractCount,
      recentlyAdded: skills
        .filter(s => s.type === 'custom' && s.addedDate)
        .sort((a, b) => (b.addedDate ?? '').localeCompare(a.addedDate ?? ''))
        .slice(0, 5),
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── Chat — Send message to Nat Lee via openclaw agent CLI ───────────────────

function execCommandWithTimeout(cmd: string, timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: timeoutMs, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// ─── Nat Lee Avatar ──────────────────────────────────────────────────────────
app.get('/api/assets/nat-lee-avatar', async (_req, res) => {
  try {
    const avatarPath = '/Users/natlee/.openclaw/workspace/assets/images/nat-lee-profile.jpg';
    const data = await fs.readFile(avatarPath);
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(data);
  } catch {
    res.status(404).json({ error: 'Avatar not found' });
  }
});

// ─── File Upload ─────────────────────────────────────────────────────────────
app.post('/api/chat/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const ext = path.extname(req.file.originalname).toLowerCase();
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const destPath = path.join(UPLOAD_DIR, `${Date.now()}-${safeName}`);

    await fs.copyFile(req.file.path, destPath);

    let extractedText = '';
    let preview = '';

    try {
      if (ext === '.pdf') {
        const pdfParse = require('pdf-parse');
        const buf = await fs.readFile(req.file.path);
        const data = await pdfParse(buf);
        extractedText = data.text;
        preview = extractedText.slice(0, 500);
      } else if (ext === '.docx' || ext === '.doc') {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ path: req.file.path });
        extractedText = result.value;
        preview = extractedText.slice(0, 500);
      } else if (ext === '.xlsx' || ext === '.xls') {
        const XLSX = require('xlsx');
        const wb = XLSX.readFile(req.file.path);
        const sheets = wb.SheetNames.map((name: string) => {
          const ws = wb.Sheets[name];
          return `[Sheet: ${name}]\n${XLSX.utils.sheet_to_csv(ws)}`;
        });
        extractedText = sheets.join('\n\n');
        preview = extractedText.slice(0, 500);
      } else if (ext === '.csv') {
        extractedText = await fs.readFile(req.file.path, 'utf8');
        preview = extractedText.slice(0, 500);
      } else {
        extractedText = `[Image file: ${req.file.originalname}]`;
        preview = extractedText;
      }
    } catch {
      extractedText = `[File uploaded: ${req.file.originalname} — could not extract text]`;
      preview = extractedText;
    }

    await fs.unlink(req.file.path).catch(() => {});

    res.json({
      filename: req.file.originalname,
      savedAs: path.basename(destPath),
      extractedText: extractedText.slice(0, 8000),
      preview,
      size: req.file.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    res.status(500).json({ error: message });
  }
});

// ─── Chat Send ───────────────────────────────────────────────────────────────
app.post('/api/chat/send', async (req, res) => {
  try {
    const { message } = req.body as { message: string };
    if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

    const escaped = message.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const output = await execCommandWithTimeout(
      `openclaw agent --message "${escaped}" --json`,
      120000
    );

    let reply = 'Message sent to Nat Lee.';
    try {
      const parsed = JSON.parse(output);
      reply = parsed.reply || parsed.message || parsed.text || parsed.content || output.trim();
    } catch {
      if (output.trim()) reply = output.trim();
    }

    if (!reply || reply === 'Message sent to Nat Lee.') {
      reply = 'Message sent — Nat Lee is processing. Check Slack for the response.';
    }

    res.json({ reply, ts: Date.now() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// ─── Memory Search ────────────────────────────────────────────────────────────
app.get('/api/search/memory', async (req, res) => {
  try {
    const q = (req.query.q as string || '').toLowerCase().trim();
    const memPath = '/Users/natlee/.openclaw/workspace/MEMORY.md';
    const content = await fs.readFile(memPath, 'utf8');

    const sections = content.split(/^## /m).filter(Boolean);

    const results = sections
      .filter(s => !q || s.toLowerCase().includes(q))
      .slice(0, 5)
      .map(s => {
        const lines = s.trim().split('\n');
        const title = lines[0].replace(/^\[P[012]\]\s*/, '').trim();
        const snippet = lines.slice(1).join(' ').trim().slice(0, 100);
        return { title, snippet };
      });

    res.json({ results });
  } catch {
    res.json({ results: [] });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nat Li API server running on http://0.0.0.0:${PORT}`);
});
