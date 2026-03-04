import express from 'express';
import cors from 'cors';
import { exec, spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN || 'pk_107639602_Q8PJNSBF1MGMW9QA0UROQ3B1OIYKPJP6';
const CLICKUP_TASK_LIST = process.env.CLICKUP_TASK_LIST || '901815865909';
const OPENCLAW_WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/Users/natlee/.openclaw/workspace';

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

    // Run mactop for rich system data
    let mactopData: Record<string, unknown> | null = null;
    try {
      const mactopOut = await execCommand('PATH=/usr/sbin:/sbin:/usr/bin:/bin:$PATH mactop --headless --count 1 --format json');
      const parsed = JSON.parse(mactopOut);
      mactopData = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch { /* fallback to os module */ }

    // Extract metrics
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
    try { await execCommand('openclaw gateway status'); openclawOk = true; } catch { /* down */ }
    try { const r = await fetch('http://localhost:11434/api/tags', {signal: AbortSignal.timeout(3000)}); ollamaOk = r.ok; } catch { /* down */ }
    try { const r = await fetch('http://localhost:18789/', {signal: AbortSignal.timeout(3000)}); gatewayOk = r.ok || r.status < 500; } catch { /* down */ }

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

// Sessions
app.get('/api/sessions', async (_req, res) => {
  try {
    const output = await execCommand('openclaw sessions --json --all-agents');
    res.json(JSON.parse(output));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message, sessions: [] });
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nat Li API server running on http://0.0.0.0:${PORT}`);
});
