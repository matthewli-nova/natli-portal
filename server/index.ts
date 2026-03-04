import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
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
app.get('/api/health', async (_req, res) => {
  try {
    const healthScript = '/Users/natlee/.openclaw/workspace/scripts/system_health.py';
    let health: { status: string; alerts: string[]; cpu?: number; memory?: number; disk?: number } = { status: 'ok', alerts: [] };

    try {
      const output = await execCommand(`python3 "${healthScript}"`);
      if (output.toLowerCase().includes('no alerts')) {
        health = { status: 'ok', alerts: [] };
      } else {
        health = { status: 'warning', alerts: output.split('\n').filter(Boolean) };
      }
    } catch {
      health = { status: 'unknown', alerts: ['Health script not available'] };
    }

    // System stats via node os
    const os = await import('os');
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    health.cpu = Math.round(cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      return acc + ((total - cpu.times.idle) / total) * 100;
    }, 0) / cpus.length);
    health.memory = Math.round(((totalMem - freeMem) / totalMem) * 100);

    try {
      const diskOutput = await execCommand("df -h / | tail -1 | awk '{print $5}'");
      health.disk = parseInt(diskOutput.replace('%', ''), 10);
    } catch {
      health.disk = 0;
    }

    res.json(health);
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

const AVAILABLE_MODELS = [
  { id: 'anthropic/claude-opus-4-6', alias: 'opus', label: 'Claude Opus 4.6' },
  { id: 'anthropic/claude-sonnet-4-6', alias: 'sonnet', label: 'Claude Sonnet 4.6' },
  { id: 'anthropic/claude-haiku-4-5', alias: 'haiku', label: 'Claude Haiku 4.5' },
  { id: 'openrouter/google/gemini-2.5-pro', alias: 'gemini-pro', label: 'Gemini 2.5 Pro' },
  { id: 'openrouter/google/gemini-2.5-flash', alias: 'gemini-flash', label: 'Gemini 2.5 Flash' },
  { id: 'openrouter/google/gemini-3-pro-preview', alias: 'gemini3-pro', label: 'Gemini 3 Pro' },
  { id: 'openrouter/deepseek/deepseek-r1', alias: 'deepseek-r1', label: 'DeepSeek R1' },
  { id: 'openrouter/x-ai/grok-4', alias: 'grok4', label: 'Grok 4' },
  { id: 'openrouter/x-ai/grok-3', alias: 'grok3', label: 'Grok 3' },
  { id: 'moonshot/kimi-latest', alias: 'kimi', label: 'Kimi Latest' },
  { id: 'moonshot/kimi-k2-thinking-turbo', alias: 'kimi-thinking', label: 'Kimi K2 Thinking' },
  { id: 'openrouter/minimax/minimax-m2.5', alias: 'minimax', label: 'MiniMax M2.5' },
  { id: 'openrouter/minimax/minimax-m1', alias: 'minimax-m1', label: 'MiniMax M1' },
];

app.get('/api/config/model', async (_req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(OPENCLAW_CONFIG_PATH, 'utf-8'));
    const modelDefaults = data.agents?.defaults?.model ?? {};
    const primary: string = modelDefaults.primary ?? '';
    const fallbacks: string[] = modelDefaults.fallbacks ?? [];
    res.json({ primary, fallbacks, availableModels: AVAILABLE_MODELS });
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
