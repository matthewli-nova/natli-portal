import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import {
  Brain,
  Zap,
  ListTodo,
  FileText,
  Timer,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ModelIcon, getModelShortName } from '../../../lib/model-icons';

// ─── Types (mirrored from parent / sibling tabs) ────────────

interface HealthData {
  status: string;
  cpu: number;
  memory: number;
  disk: number;
  memTotalGb: number;
  memUsedGb: number;
  cpuTemp: number;
  services: { openclaw: boolean; ollama: boolean; gateway: boolean };
  gatewayReachable: boolean;
  gatewayStartTime: string;
  primaryModel: string;
  totalSessions: number;
  memoryFiles: number;
  memoryChunks: number;
  vectorEnabled: boolean;
  ftsEnabled: boolean;
  memoryMdLines: number;
  memoryMdCap: number;
  memoryDailyLogs: number;
  memoryArchiveCount: number;
  memoryDbSizeMb: number;
  [key: string]: unknown;
}

interface EnrichedSession {
  key: string;
  updatedAt: number;
  ageMs: number;
  model: string;
  agentId: string;
  totalTokens: number | null;
  sessionType: string;
  label: string;
  isActive: boolean;
  isRecent: boolean;
  [key: string]: unknown;
}

interface CronJobState {
  nextRunAtMs?: number;
  lastRunAtMs?: number;
  lastStatus?: string;
  consecutiveErrors: number;
  [key: string]: unknown;
}

interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: unknown;
  state: CronJobState;
  [key: string]: unknown;
}

interface ClickUpTask {
  id: string;
  name: string;
  status: { status: string; color: string };
  priority?: { priority: string; color: string } | null;
  [key: string]: unknown;
}

interface ModelConfig {
  primary: string;
  fallbacks: string[];
  availableModels: Array<{ id: string; alias: string; label: string }>;
}

interface MemoryStats {
  dailyLogs: number;
  archived: number;
  dbSizeMb: number;
  totalFiles: number;
  [key: string]: unknown;
}

interface OverviewTabProps {
  health: HealthData | null;
  sessions: EnrichedSession[];
  crons: CronJob[];
  tasks: ClickUpTask[];
  modelConfig: ModelConfig | null;
  memory: MemoryStats | null;
  onNavigateTo: (tab: string) => void;
  sseConnected?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────

function formatTokens(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatUptime(startTimeStr: string): string {
  try {
    const start = new Date(startTimeStr);
    if (isNaN(start.getTime())) return '—';
    const diff = Date.now() - start.getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${mins}m`;
  } catch {
    return '—';
  }
}

function timeUntil(ms: number): string {
  const diff = ms - Date.now();
  if (diff <= 0) return 'now';
  if (diff < 60_000) return `${Math.ceil(diff / 1000)}s`;
  if (diff < 3_600_000) {
    const mins = Math.floor(diff / 60_000);
    return `${mins}m`;
  }
  if (diff < 86_400_000) {
    const hrs = Math.floor(diff / 3_600_000);
    const mins = Math.floor((diff % 3_600_000) / 60_000);
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  return `${Math.floor(diff / 86_400_000)}d`;
}

function relativeTime(ageMs: number): string {
  if (ageMs < 30_000) return 'just now';
  if (ageMs < 60_000) return `${Math.floor(ageMs / 1000)}s ago`;
  if (ageMs < 3_600_000) return `${Math.floor(ageMs / 60_000)}m ago`;
  if (ageMs < 86_400_000) return `${Math.floor(ageMs / 3_600_000)}h ago`;
  return `${Math.floor(ageMs / 86_400_000)}d ago`;
}

function estimateCost(tokens: number): string {
  const cost = (tokens / 1_000_000) * 15;
  if (cost < 0.01) return '<$0.01';
  return `~$${cost.toFixed(2)}`;
}

// ─── View All Link ───────────────────────────────────────────

function ViewAllLink({ onClick, label = 'View All →' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="text-xs text-[#107DAC] hover:underline cursor-pointer font-medium"
    >
      {label}
    </button>
  );
}

// ─── Section [A]: System Status Bar ──────────────────────────

function SystemStatusBar({ health }: { health: HealthData | null }) {
  if (!health) {
    return (
      <div className="bg-[#023F59]/5 rounded-lg px-4 py-2.5 flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading system status…</span>
      </div>
    );
  }

  const services = [
    { name: 'Gateway', online: health.gatewayReachable },
    { name: 'Ollama', online: health.services?.ollama },
    { name: 'Vector DB', online: health.vectorEnabled },
  ];

  return (
    <div className="bg-[#023F59]/5 rounded-lg px-4 py-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
      {services.map(s => (
        <span key={s.name} className="flex items-center gap-1.5 shrink-0">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              s.online ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          <span className="text-[#21262A] font-medium">{s.name}</span>
          <span className={`text-xs ${s.online ? 'text-emerald-600' : 'text-red-600'}`}>
            {s.online ? 'ONLINE' : 'OFFLINE'}
          </span>
        </span>
      ))}

      <span className="text-[#21262A]/60">·</span>
      <span className="text-[#21262A]">CPU {health.cpu}%</span>
      <span className="text-[#21262A]/60">·</span>
      <span className="text-[#21262A]">{health.cpuTemp}°C</span>
      <span className="text-[#21262A]/60">·</span>
      <span className="text-[#21262A]">RAM {health.memUsedGb}/{health.memTotalGb}GB</span>
      <span className="text-[#21262A]/60">·</span>
      <span className="text-[#21262A]">Disk {health.disk}%</span>
      <span className="text-[#21262A]/60">·</span>
      <span className="text-[#21262A]">Uptime {formatUptime(health.gatewayStartTime)}</span>
    </div>
  );
}

// ─── Section [B]: KPI Strip ──────────────────────────────────

function KPIStrip({
  health,
  sessions,
  tasks,
  crons,
  modelConfig,
}: {
  health: HealthData | null;
  sessions: EnrichedSession[];
  tasks: ClickUpTask[];
  crons: CronJob[];
  modelConfig: ModelConfig | null;
}) {
  const activeSessions = sessions.filter(s => s.isActive).length;
  const totalSessions = health?.totalSessions ?? sessions.length;

  const openTasks = tasks.filter(t => {
    const s = t.status?.status?.toLowerCase() ?? '';
    return s !== 'complete' && s !== 'closed' && s !== 'done';
  });
  const sprintTasks = tasks.filter(t => {
    const s = t.status?.status?.toLowerCase() ?? '';
    return s.includes('progress') || s === 'in progress';
  });

  const memLines = health?.memoryMdLines ?? 0;
  const memCap = health?.memoryMdCap ?? 150;
  const memAtCap = memLines >= memCap - 5;

  const enabledCrons = crons.filter(c => c.enabled);
  const nextCron = enabledCrons
    .filter(c => c.state.nextRunAtMs && c.state.nextRunAtMs > Date.now())
    .sort((a, b) => (a.state.nextRunAtMs ?? 0) - (b.state.nextRunAtMs ?? 0))[0];

  const primaryId = modelConfig?.primary ?? health?.primaryModel ?? '';
  const primaryLabel = modelConfig
    ? modelConfig.availableModels.find(m => m.id === modelConfig.primary)?.label ?? getModelShortName(modelConfig.primary)
    : health?.primaryModel
      ? getModelShortName(health.primaryModel)
      : '—';

  const kpis = [
    {
      icon: primaryId ? <ModelIcon modelId={primaryId} size="sm" /> : <Brain className="w-4 h-4 text-[#31D7DB]" />,
      label: 'Active Model',
      value: primaryLabel,
      subtitle: modelConfig ? `${modelConfig.fallbacks.length} failover${modelConfig.fallbacks.length !== 1 ? 's' : ''}` : '',
      badgeColor: 'bg-[#31D7DB]/20 text-[#107DAC]',
      badge: 'Online',
    },
    {
      icon: <Zap className="w-4 h-4 text-emerald-500" />,
      label: 'Active Sessions',
      value: String(activeSessions),
      subtitle: `of ${totalSessions} total`,
      badgeColor: activeSessions > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600',
      badge: activeSessions > 0 ? 'Active' : 'Idle',
    },
    {
      icon: <ListTodo className="w-4 h-4 text-amber-500" />,
      label: 'Open Tasks',
      value: String(openTasks.length),
      subtitle: `${sprintTasks.length} in sprint`,
      badgeColor: openTasks.length > 3 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700',
      badge: openTasks.length > 3 ? 'Busy' : 'OK',
    },
    {
      icon: <FileText className="w-4 h-4" style={{ color: memAtCap ? '#ef4444' : '#31D7DB' }} />,
      label: 'MEMORY.md',
      value: `${memLines}/${memCap}`,
      subtitle: memAtCap ? 'AT CAP' : 'Healthy',
      badgeColor: memAtCap ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700',
      badge: memAtCap ? 'Full' : 'OK',
    },
    {
      icon: <Timer className="w-4 h-4 text-[#107DAC]" />,
      label: 'Next Cron',
      value: nextCron ? timeUntil(nextCron.state.nextRunAtMs!) : 'None scheduled',
      subtitle: nextCron ? nextCron.name.slice(0, 20) + (nextCron.name.length > 20 ? '…' : '') : 'No crons pending',
      badgeColor: 'bg-gray-100 text-gray-600',
      badge: null,
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {kpis.map(kpi => (
        <Card
          key={kpi.label}
          className="border-[#023F59]/20 hover:shadow-md transition-shadow relative"
        >
          <CardContent className="pt-4 pb-3 px-4">
            {kpi.badge && (
              <Badge
                className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-1.5 py-0 border-0 ${kpi.badgeColor}`}
              >
                {kpi.badge}
              </Badge>
            )}
            <div className="flex items-center gap-2 mb-1.5">{kpi.icon}</div>
            <p className="text-2xl font-bold text-[#107DAC] leading-tight truncate">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{kpi.label}</p>
            <p className="text-xs text-muted-foreground truncate">{kpi.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Section [C]: Agent Activity + Cron Health ───────────────

function AgentActivityCard({
  sessions,
  onNavigateTo,
}: {
  sessions: EnrichedSession[];
  onNavigateTo: (tab: string) => void;
}) {
  const recent = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6);

  return (
    <Card className="border-[#023F59]/25 shadow-sm col-span-1 lg:col-span-2">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-[#21262A]">Agent Activity</CardTitle>
        <ViewAllLink onClick={() => onNavigateTo('sessions')} />
      </CardHeader>
      <CardContent className="pt-0">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No recent sessions</p>
        ) : (
          <div className="divide-y divide-[#023F59]/10">
            {recent.map(s => {
              const isLive = s.ageMs < 300_000;
              const isWarm = s.ageMs < 3_600_000;
              return (
                <div
                  key={s.key}
                  className="flex items-center gap-3 py-2 hover:bg-[#023F59]/[0.02] rounded px-1 -mx-1"
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        isLive ? 'bg-emerald-500' : isWarm ? 'bg-amber-400' : 'bg-gray-300'
                      }`}
                    />
                    {isLive && (
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                    )}
                  </span>

                  <span className="text-sm text-[#21262A] truncate flex-1 min-w-0">
                    {s.label || s.key}
                  </span>

                  <Badge className="text-[10px] font-medium px-1.5 py-0 border-0 bg-[#023F59]/8 text-[#21262A] shrink-0">
                    {s.agentId || 'main'}
                  </Badge>

                  <span className="shrink-0 hidden sm:inline">
                    <ModelIcon modelId={s.model} size="xs" showLabel />
                  </span>

                  <span className="text-xs font-mono text-[#107DAC] shrink-0 w-14 text-right">
                    {s.totalTokens ? formatTokens(s.totalTokens) : '—'}
                  </span>

                  <span className="text-xs text-muted-foreground shrink-0 w-16 text-right">
                    {relativeTime(s.ageMs)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CronHealthCard({
  crons,
  onNavigateTo,
}: {
  crons: CronJob[];
  onNavigateTo: (tab: string) => void;
}) {
  const enabled = crons.filter(c => c.enabled);
  const failing = enabled.filter(c => c.state.consecutiveErrors > 0);
  const nextFiring = enabled
    .filter(c => c.state.nextRunAtMs && c.state.nextRunAtMs > Date.now())
    .sort((a, b) => (a.state.nextRunAtMs ?? 0) - (b.state.nextRunAtMs ?? 0))
    .slice(0, 3);

  return (
    <Card className="border-[#023F59]/25 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-[#21262A]">Cron Health</CardTitle>
        <ViewAllLink onClick={() => onNavigateTo('schedule')} />
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-[#21262A]">
          <span className="font-bold text-[#107DAC]">{enabled.length}</span>
          <span className="text-muted-foreground"> enabled / {crons.length} total</span>
        </p>

        {failing.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md px-3 py-1.5 text-xs text-red-700 font-medium">
            {failing.length} job{failing.length !== 1 ? 's' : ''} failing
          </div>
        )}

        {nextFiring.length > 0 ? (
          <div className="space-y-2">
            {nextFiring.map(c => (
              <div key={c.id} className="flex items-center justify-between py-1.5 border-b border-[#023F59]/5 last:border-0">
                <span className="truncate text-[#21262A] text-sm flex-1 min-w-0 mr-2">{c.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[#107DAC] font-medium">
                    {timeUntil(c.state.nextRunAtMs!)}
                  </span>
                  {c.state.lastStatus === 'ok' || c.state.lastStatus === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : c.state.lastStatus ? (
                    <XCircle className="w-3.5 h-3.5 text-red-500" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-200 inline-block" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No upcoming crons</p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Section [D]: Tasks, Memory, Model ───────────────────────

function TasksCard({
  tasks,
  onNavigateTo,
}: {
  tasks: ClickUpTask[];
  onNavigateTo: (tab: string) => void;
}) {
  const statusCounts = { open: 0, sprint: 0, completed: 0 };
  const openTasks: ClickUpTask[] = [];

  tasks.forEach(t => {
    const s = t.status?.status?.toLowerCase() ?? '';
    if (s === 'complete' || s === 'closed' || s === 'done') {
      statusCounts.completed++;
    } else if (s.includes('progress') || s === 'in progress') {
      statusCounts.sprint++;
      openTasks.push(t);
    } else {
      statusCounts.open++;
      openTasks.push(t);
    }
  });

  const priorityColor = (p?: string | null) => {
    if (!p) return 'bg-gray-400';
    const pl = p.toLowerCase();
    if (pl === 'urgent') return 'bg-red-500';
    if (pl === 'high') return 'bg-amber-500';
    if (pl === 'normal') return 'bg-[#107DAC]';
    return 'bg-gray-400';
  };

  return (
    <Card className="border-[#023F59]/25 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-[#21262A]">Tasks</CardTitle>
        <ViewAllLink onClick={() => onNavigateTo('task')} />
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>Open <strong className="text-[#21262A]">{statusCounts.open}</strong></span>
          <span>·</span>
          <span>Sprint <strong className="text-[#21262A]">{statusCounts.sprint}</strong></span>
          <span>·</span>
          <span>Done <strong className="text-[#21262A]">{statusCounts.completed}</strong></span>
        </div>
        <div className="space-y-1.5">
          {openTasks.slice(0, 4).map(t => (
            <div key={t.id} className="flex items-center gap-2 text-sm py-1.5 border-b border-[#023F59]/5 last:border-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${priorityColor(t.priority?.priority)}`}
              />
              <span className="truncate text-[#21262A]">{t.name}</span>
            </div>
          ))}
          {openTasks.length === 0 && (
            <p className="text-xs text-muted-foreground">No open tasks</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MemoryCard({
  health,
  memory,
  onNavigateTo,
}: {
  health: HealthData | null;
  memory: MemoryStats | null;
  onNavigateTo: (tab: string) => void;
}) {
  const lines = health?.memoryMdLines ?? 0;
  const cap = health?.memoryMdCap ?? 150;
  const pct = cap > 0 ? Math.round((lines / cap) * 100) : 0;

  const dailyLogs = health?.memoryDailyLogs ?? memory?.dailyLogs ?? 0;
  const archived = health?.memoryArchiveCount ?? memory?.archived ?? 0;
  const dbSize = health?.memoryDbSizeMb ?? memory?.dbSizeMb ?? 0;
  const files = health?.memoryFiles ?? memory?.totalFiles ?? 0;
  const chunks = health?.memoryChunks ?? 0;
  const vector = health?.vectorEnabled ?? false;
  const fts = health?.ftsEnabled ?? false;

  return (
    <Card className="border-[#023F59]/25 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-[#21262A]">Memory</CardTitle>
        <ViewAllLink onClick={() => onNavigateTo('memory')} />
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">MEMORY.md</span>
            <span className={`font-mono font-medium ${pct >= 97 ? 'text-red-600' : pct >= 90 ? 'text-amber-600' : 'text-[#107DAC]'}`}>
              {lines}/{cap}
            </span>
          </div>
          <Progress
            value={pct}
            className={`h-2 ${pct >= 97 ? '[&>div]:bg-red-500' : pct >= 90 ? '[&>div]:bg-amber-500' : '[&>div]:bg-[#31D7DB]'}`}
          />
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>Daily Logs <strong className="text-[#21262A]">{dailyLogs}</strong></span>
          <span>·</span>
          <span>Archive <strong className="text-[#21262A]">{archived}</strong></span>
          <span>·</span>
          <span>DB <strong className="text-[#21262A]">{dbSize}MB</strong></span>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>Files <strong className="text-[#21262A]">{files.toLocaleString()}</strong></span>
          <span>·</span>
          <span>Chunks <strong className="text-[#21262A]">{chunks.toLocaleString()}</strong></span>
        </div>

        <div className="flex gap-2">
          <Badge className={`text-[10px] px-1.5 py-0 border-0 ${vector ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
            Vector {vector ? '✓' : '✗'}
          </Badge>
          <Badge className={`text-[10px] px-1.5 py-0 border-0 ${fts ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
            FTS {fts ? '✓' : '✗'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function ModelUsageCard({
  sessions,
  modelConfig,
  onNavigateTo,
}: {
  sessions: EnrichedSession[];
  modelConfig: ModelConfig | null;
  onNavigateTo: (tab: string) => void;
}) {
  const totalTokens = sessions.reduce((sum, s) => sum + (s.totalTokens ?? 0), 0);

  const byModel: Record<string, number> = {};
  sessions.forEach(s => {
    if (s.model && s.totalTokens) {
      byModel[s.model] = (byModel[s.model] ?? 0) + s.totalTokens;
    }
  });
  const topModels = Object.entries(byModel)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
  const maxModelTokens = topModels.length > 0 ? topModels[0][1] : 1;

  const primaryLabel = modelConfig
    ? modelConfig.availableModels.find(m => m.id === modelConfig.primary)?.label ?? getModelShortName(modelConfig.primary)
    : '—';

  return (
    <Card className="border-[#023F59]/25 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-[#21262A]">Model Usage</CardTitle>
        <ViewAllLink onClick={() => onNavigateTo('model')} />
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2">
          {modelConfig?.primary && <ModelIcon modelId={modelConfig.primary} size="sm" />}
          <span className="text-sm font-medium text-[#21262A]">{primaryLabel}</span>
          <Badge className="text-[10px] px-1.5 py-0 border-0 bg-[#31D7DB]/20 text-[#107DAC]">
            Primary
          </Badge>
        </div>

        <div>
          <p className="text-2xl font-bold text-[#107DAC]">{formatTokens(totalTokens)}</p>
          <p className="text-xs text-muted-foreground">total tokens</p>
        </div>

        <p className="text-sm font-medium text-amber-600">{estimateCost(totalTokens)}</p>

        {topModels.length > 0 && (
          <div className="space-y-1.5">
            {topModels.map(([model, tokens]) => (
              <div key={model}>
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <ModelIcon modelId={model} size="xs" />
                    <span className="text-muted-foreground truncate">{getModelShortName(model)}</span>
                  </div>
                  <span className="text-[#21262A] font-mono">{formatTokens(tokens)}</span>
                </div>
                <div className="h-1.5 bg-[#023F59]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#31D7DB] rounded-full"
                    style={{ width: `${Math.round((tokens / maxModelTokens) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Export ─────────────────────────────────────────────

export function OverviewTab({
  health,
  sessions,
  crons,
  tasks,
  modelConfig,
  memory,
  onNavigateTo,
  sseConnected,
}: OverviewTabProps) {
  return (
    <div className="space-y-4">
      {/* [A] System Status Bar */}
      <SystemStatusBar health={health} />

      {/* [B] KPI Strip */}
      <KPIStrip
        health={health}
        sessions={sessions}
        tasks={tasks}
        crons={crons}
        modelConfig={modelConfig}
      />

      {/* [C] Agent Activity + Cron Health */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <AgentActivityCard sessions={sessions} onNavigateTo={onNavigateTo} />
        <CronHealthCard crons={crons} onNavigateTo={onNavigateTo} />
      </div>

      {/* [D] Tasks + Memory + Model */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <TasksCard tasks={tasks} onNavigateTo={onNavigateTo} />
        <MemoryCard health={health} memory={memory} onNavigateTo={onNavigateTo} />
        <ModelUsageCard sessions={sessions} modelConfig={modelConfig} onNavigateTo={onNavigateTo} />
      </div>
    </div>
  );
}
