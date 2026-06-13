import { useState, useEffect, useCallback } from 'react';
import { HeaderCenter } from '../../lib/header-slot-context';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';
import { OverviewTab } from './overview/OverviewTab';
import { useSSEContext } from '../../lib/sse-context';

import {
  Activity,
  Clock,
  HardDrive,
  RefreshCw,
  Server,
  AlertTriangle,
  Brain,
  Power,
  Cpu,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { GlobalSearch } from './search/GlobalSearch';
import { PortalPage, SectionHeader, StatusPill } from '../../lib/portal-ui';

// ─── Types ───────────────────────────────────────────────────

import type { HealthData, CronJob, ClickUpTask, MemoryStats, SessionEntry, ModelConfig } from '../../lib/portal-types';
import { formatUptime } from '../../lib/formatters';
import { formatTimeAgo } from '../../lib/portal-utils';

// Map OverviewTab "view all" targets → sidebar portal item ids
const NAV_MAP: Record<string, string> = {
  sessions: 'natli-sessions',
  schedule: 'natli-scheduler',
  memory: 'natli-memory',
  model: 'natli-model',
};

// ─── API Fetching ────────────────────────────────────────────

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Main Component ──────────────────────────────────────────

export function NatliDashboard({ onNavigate }: { onNavigate?: (itemId: string) => void }) {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [crons, setCrons] = useState<CronJob[]>([]);
  const [tasks, setTasks] = useState<ClickUpTask[]>([]);
  const [memory, setMemory] = useState<MemoryStats | null>(null);
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [gatewayRestarting, setGatewayRestarting] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const { subscribe: sseSubscribe, connected: sseConnected } = useSSEContext();

  const loadData = useCallback(async () => {
    const [h, c, t, m, s, mc] = await Promise.all([
      fetchApi<HealthData>('/api/health'),
      fetchApi<CronJob[] | { crons: CronJob[] }>('/api/crons'),
      fetchApi<{ tasks: ClickUpTask[] }>('/api/tasks'),
      fetchApi<MemoryStats>('/api/memory/stats'),
      fetchApi<SessionEntry[] | { sessions: SessionEntry[] }>('/api/sessions'),
      fetchApi<ModelConfig>('/api/config/model'),
    ]);
    setHealth(h);
    setCrons(Array.isArray(c) ? c : (c as { jobs?: CronJob[]; crons?: CronJob[] })?.jobs ?? (c as { crons?: CronJob[] })?.crons ?? []);
    setTasks(t?.tasks ?? []);
    setMemory(m);
    setSessions(Array.isArray(s) ? s : s?.sessions ?? []);
    setModelConfig(mc);
    setLoading(false);
    setRefreshing(false);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── Polling fallback (60s — SSE handles real-time) ──────────────────────
  useEffect(() => {
    const interval = setInterval(loadData, 60_000);
    return () => clearInterval(interval);
  }, [loadData]);

  // ─── SSE real-time pulse (shared connection via SSEContext) ──────────────
  useEffect(() => {
    const unsubPulse = sseSubscribe('pulse', () => {
      Promise.all([
        fetchApi<CronJob[] | { jobs: CronJob[]; crons: CronJob[] }>('/api/crons'),
        fetchApi<SessionEntry[] | { sessions: SessionEntry[] }>('/api/sessions'),
      ]).then(([c, s]) => {
        setCrons(Array.isArray(c) ? c : (c as { jobs?: CronJob[]; crons?: CronJob[] })?.jobs ?? (c as { crons?: CronJob[] })?.crons ?? []);
        setSessions(Array.isArray(s) ? s : (s as { sessions?: SessionEntry[] })?.sessions ?? []);
        setLastUpdated(new Date().toLocaleTimeString());
      });
    });
    const unsubHealth = sseSubscribe('health', (data) => {
      if (data) {
        setHealth(data as HealthData);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    });
    return () => { unsubPulse(); unsubHealth(); };
  }, [sseSubscribe]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleGatewayRestart = async () => {
    setShowRestartConfirm(false);
    setGatewayRestarting(true);
    try {
      await fetch('/api/gateway/restart', { method: 'POST' });
    } catch { /* gateway will restart — connection drop is expected */ }
    setTimeout(() => {
      setGatewayRestarting(false);
      loadData();
    }, 5000);
  };

  if (loading) return <DashboardSkeleton />;

  const resolveModelLabel = (id: string) => {
    const model = modelConfig?.availableModels.find(m => m.id === id);
    return model?.label ?? id;
  };

  const navigate = (target: string) => onNavigate?.(NAV_MAP[target] ?? target);

  return (
    <PortalPage
      icon={Activity}
      title="Overview"
      subtitle="Live monitoring for Nat Lee AI operations"
      badge={<StatusPill tone={sseConnected ? 'online' : 'idle'} pulse={sseConnected}>{sseConnected ? 'Live' : 'Polling'}</StatusPill>}
      actions={
        <>
          {lastUpdated && <span className="hidden text-xs text-muted-foreground sm:inline">Updated {lastUpdated}</span>}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}
            className="border-primary/30 hover:bg-primary hover:text-white">
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowRestartConfirm(true)} disabled={gatewayRestarting}
            className="border-red-300 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white">
            <Power className={`mr-1.5 h-3.5 w-3.5 ${gatewayRestarting ? 'animate-pulse' : ''}`} />
            {gatewayRestarting ? 'Restarting…' : 'Restart Gateway'}
          </Button>
        </>
      }
    >
      <HeaderCenter>
        <GlobalSearch
          onNavigate={(tab) => navigate(tab)}
          sessions={sessions as Array<Record<string, unknown>>}
          cronJobs={crons as unknown as Array<Record<string, unknown>>}
        />
      </HeaderCenter>

      {/* Restart Confirm Dialog */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-xl bg-card p-6 shadow-2xl ring-1 ring-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
                <Power className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Restart Gateway?</p>
                <p className="mt-0.5 text-xs text-muted-foreground">All active sessions will be briefly interrupted. Takes ~5 seconds.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setShowRestartConfirm(false)} className="border-primary/25 shadow-sm">Cancel</Button>
              <Button size="sm" onClick={handleGatewayRestart} className="bg-red-600 text-white hover:bg-red-700">
                <Power className="mr-1.5 h-3.5 w-3.5" />
                Yes, Restart
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Overview summary cards */}
      <ErrorBoundary label="Overview">
        <OverviewTab
          health={health}
          sessions={sessions as never}
          crons={crons as never}
          tasks={tasks}
          modelConfig={modelConfig}
          memory={memory}
          onNavigateTo={navigate}
          sseConnected={sseConnected}
        />
      </ErrorBoundary>

      {/* System Health detail */}
      <SystemHealthSection health={health} resolveModelLabel={resolveModelLabel} />
    </PortalPage>
  );
}

// ─── System Health detail section ────────────────────────────

function SystemHealthSection({ health, resolveModelLabel }: { health: HealthData | null; resolveModelLabel: (id: string) => string }) {
  return (
    <div className="space-y-6">
      {/* Hermes Claw Health */}
      <div className="space-y-3">
        <SectionHeader
          icon={Server}
          title="Hermes Claw Health"
          description="Gateway, model routing, and service availability"
          actions={<StatusPill tone={health?.gatewayReachable ? 'online' : 'offline'} pulse={health?.gatewayReachable}>{health?.gatewayReachable ? 'Gateway Online' : 'Gateway Offline'}</StatusPill>}
        />

        <div className="flex flex-wrap gap-2">
          <Badge className="border-0 bg-secondary/20 px-3 py-1 text-xs font-semibold text-lepos-cyan-text">
            <Brain className="mr-1 h-3 w-3" />
            {health?.primaryModel || '—'}
          </Badge>
          <Badge className="border-0 bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {health?.gatewayStartTime ? formatUptime(health.gatewayStartTime) : '—'}
          </Badge>
          <Badge className="border-0 bg-secondary/15 px-3 py-1 text-xs font-semibold text-lepos-cyan-text">
            <Activity className="mr-1 h-3 w-3" />
            {health?.totalSessions ?? 0} sessions
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Gateway */}
          <Card className="border-border card-modern">
            <CardContent className="pb-4 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-semibold text-foreground">Gateway</span>
                </div>
                <StatusPill tone={health?.gatewayReachable ? 'online' : 'offline'}>{health?.gatewayReachable ? 'Online' : 'Offline'}</StatusPill>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                <div className="text-muted-foreground">Version</div>
                <div className="font-mono text-foreground">{health?.gatewayVersion || '—'}</div>
                <div className="text-muted-foreground">PID</div>
                <div className="font-mono text-foreground">{health?.gatewayPid || '—'}</div>
                <div className="text-muted-foreground">Uptime</div>
                <div className="font-mono text-foreground">{health?.gatewayStartTime ? formatUptime(health.gatewayStartTime) : '—'}</div>
                <div className="text-muted-foreground">Latency</div>
                <div className="font-mono text-foreground">{health?.gatewayLatencyMs ?? 0} ms</div>
                <div className="text-muted-foreground">Host</div>
                <div className="col-span-1 truncate font-mono text-xs text-foreground">{health?.gatewayHost || '—'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Model & Sessions */}
          <Card className="border-border card-modern">
            <CardContent className="pb-4 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-foreground">AI Model & Sessions</span>
              </div>
              <p className="text-xl font-bold leading-tight text-lepos-cyan-text">
                {health?.primaryModel ? resolveModelLabel(health.primaryModel) : '—'}
              </p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">{health?.primaryModel || ''}</p>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-border pt-3 text-sm">
                <div className="text-muted-foreground">Sessions</div>
                <div className="font-bold text-lepos-cyan-text">{health?.totalSessions ?? 0}</div>
                <div className="text-muted-foreground">Last active</div>
                <div className="font-mono text-foreground">{health?.timestamp ? formatTimeAgo(health.timestamp) : '—'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="border-border card-modern">
            <CardContent className="pb-4 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-foreground">Services</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Gateway :18789', ok: health?.gatewayReachable },
                  { label: 'Ollama :11434', ok: health?.services?.ollama, sub: health?.ollamaModel },
                  { label: 'Hermes Claw', ok: health?.services?.openclaw, sub: 'gateway service' },
                ].map(({ label, ok, sub }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-foreground">{label}</span>
                      {sub && <span className="ml-1.5 font-mono text-xs text-muted-foreground">{sub}</span>}
                    </div>
                    <StatusPill tone={ok ? 'online' : 'offline'}>{ok ? 'Online' : 'Offline'}</StatusPill>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mac mini Hardware */}
      <div className="space-y-3">
        <SectionHeader
          icon={Cpu}
          title="Mac mini Hardware"
          description={health?.socModel ? `${health.socModel} · ${health.coreCount} cores (${health.eCores}E + ${health.pCores}P) · ${health.thermalState}` : 'Local compute metrics'}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'CPU', value: health?.cpu ?? 0, sub: `${health?.cpuTemp ?? 0}°C · ${health?.cpuPowerW ?? 0}W` },
            { label: 'Memory', value: health?.memory ?? 0, sub: `${health?.memUsedGb ?? 0} / ${health?.memTotalGb ?? 0} GB` },
            { label: 'Disk', value: health?.disk ?? 0, sub: 'system volume' },
            { label: 'GPU', value: health?.gpuPercent ?? 0, sub: `${health?.gpuFreqMhz ?? 0} MHz · ${health?.gpuTemp ?? 0}°C` },
          ].map(({ label, value, sub }) => (
            <Card key={label} className="border-border card-modern">
              <CardContent className="pb-4 pt-4">
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                  <span className={`text-lg font-bold ${value > 85 ? 'text-red-500' : value > 70 ? 'text-amber-500' : 'text-lepos-cyan-text'}`}>{value}%</span>
                </div>
                <Progress value={value} className={`mb-1.5 h-2 ${value > 85 ? '[&>div]:bg-red-500' : value > 70 ? '[&>div]:bg-amber-500' : '[&>div]:bg-secondary'}`} />
                <p className="text-xs text-muted-foreground">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border card-modern">
            <CardContent className="pb-4 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-foreground">Network</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-500">↓</span>
                  <div>
                    <p className="font-mono font-bold text-lepos-cyan-text">{health?.netInKbps ?? 0} KB/s</p>
                    <p className="text-xs text-muted-foreground">Inbound</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lepos-cyan-text">↑</span>
                  <div>
                    <p className="font-mono font-bold text-lepos-cyan-text">{health?.netOutKbps ?? 0} KB/s</p>
                    <p className="text-xs text-muted-foreground">Outbound</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border card-modern">
            <CardContent className="pb-4 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-foreground">Disk I/O</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-mono font-bold text-lepos-cyan-text">{health?.diskReadKbps ?? 0} KB/s</p>
                  <p className="text-xs text-muted-foreground">Read</p>
                </div>
                <div>
                  <p className="font-mono font-bold text-lepos-cyan-text">{health?.diskWriteKbps ?? 0} KB/s</p>
                  <p className="text-xs text-muted-foreground">Write</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Processes */}
        {health?.topProcesses && health.topProcesses.length > 0 && (
          <Card className="border-border card-modern">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">Top Processes</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto scroll-slim">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="py-1.5 pr-3 text-left font-medium">PID</th>
                      <th className="py-1.5 pr-3 text-left font-medium">Process</th>
                      <th className="py-1.5 pr-3 text-right font-medium">CPU%</th>
                      <th className="py-1.5 pr-3 text-right font-medium">Mem%</th>
                      <th className="py-1.5 text-right font-medium">GPU ms/s</th>
                    </tr>
                  </thead>
                  <tbody>
                    {health.topProcesses.map((p: { pid: number; command: string; cpu_percent: number; memory_percent: number; gpu_ms_per_sec?: number }, i: number) => (
                      <tr key={i} className={`border-b border-border/50 ${p.cpu_percent > 10 ? 'bg-amber-500/5' : ''}`}>
                        <td className="py-1.5 pr-3 font-mono text-xs text-muted-foreground">{p.pid}</td>
                        <td className="max-w-[140px] truncate py-1.5 pr-3 font-mono text-xs">{p.command}</td>
                        <td className={`py-1.5 pr-3 text-right font-mono text-xs font-semibold ${p.cpu_percent > 10 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>{p.cpu_percent.toFixed(1)}</td>
                        <td className="py-1.5 pr-3 text-right font-mono text-xs text-foreground">{(p.memory_percent * 100).toFixed(1)}</td>
                        <td className="py-1.5 text-right font-mono text-xs text-muted-foreground">{(p.gpu_ms_per_sec ?? 0).toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Alerts */}
      {health && health.alerts.length > 0 && (
        <Card className="border-red-500/30 card-modern">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {health.alerts.map((alert, i) => (
                <div key={i} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${alert.level === 'critical' ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300'}`}>
                  <Badge className={`px-1.5 py-0 text-[10px] font-bold uppercase ${alert.level === 'critical' ? 'border-0 bg-red-600 text-white' : 'border-0 bg-amber-500 text-white'}`}>{alert.level}</Badge>
                  <Badge variant="outline" className="border-secondary px-1.5 py-0 text-[10px] font-medium uppercase text-lepos-cyan-text">{alert.type}</Badge>
                  <span className="shrink-0 text-xs text-muted-foreground">{alert.timestamp}</span>
                  <span className="flex-1">{alert.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 w-full rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
      </div>
    </div>
  );
}
