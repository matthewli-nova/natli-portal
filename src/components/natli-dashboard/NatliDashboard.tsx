import { useState, useEffect, useCallback, lazy, Suspense } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';
import { OverviewTab } from './overview/OverviewTab';

const LazyNatliSchedulerPage = lazy(() => import('../natli-scheduler/NatliSchedulerPage').then(m => ({ default: m.NatliSchedulerPage })));
const LazySessionsTab = lazy(() => import('./sessions/SessionsTab').then(m => ({ default: m.SessionsTab })));
const LazyModelTab = lazy(() => import('./model/ModelTab').then(m => ({ default: m.ModelTab })));
import { MemoryTab } from './memory/MemoryTab';

import {
  Activity,
  Bot,
  Clock,
  Database,
  HardDrive,
  RefreshCw,
  Server,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ListTodo,
  Brain,
  FileText,
  Power,
} from 'lucide-react';
import { Button } from '../ui/button';
import { QuickChatPanel } from './chat/QuickChatPanel';
import { GlobalSearch } from './search/GlobalSearch';

// ─── Types ───────────────────────────────────────────────────

interface HealthData {
  status: string;
  timestamp: string;
  alerts: Array<{ level: 'warning' | 'critical' | 'info'; type: string; message: string; timestamp: string }>;
  cpu: number; memory: number; disk: number;
  memTotalGb: number; memUsedGb: number; memAvailGb: number;
  cpuTemp: number; gpuTemp: number; socTemp: number;
  cpuPowerW: number; systemPowerW: number;
  gpuPercent: number; gpuFreqMhz: number;
  netInKbps: number; netOutKbps: number;
  diskReadKbps: number; diskWriteKbps: number;
  thermalState: string; socModel: string;
  coreCount: number; eCores: number; pCores: number;
  services: { openclaw: boolean; ollama: boolean; gateway: boolean };
  topProcesses: Array<{ pid: number; command: string; cpu_percent: number; memory_percent: number; gpu_ms_per_sec?: number }>;
  // Cat 1: Gateway & Sessions
  gatewayReachable: boolean; gatewayLatencyMs: number; gatewayVersion: string; gatewayHost: string;
  gatewayServiceRunning: boolean; gatewayPid: number; gatewayStartTime: string;
  primaryModel: string; totalSessions: number;
  // Cat 2: Memory & Knowledge
  memoryFiles: number; memoryChunks: number; memoryDirty: boolean; memoryDbPath: string;
  ollamaModel: string; cacheEntries: number; vectorEnabled: boolean; ftsEnabled: boolean;
  memoryMdLines: number; memoryMdCap: number; memoryDailyLogs: number; memoryArchiveCount: number;
  memoryDbSizeMb: number; lastMemorySyncTime: string;
  p0Sections: number; p1Sections: number; p2Sections: number;
}

interface CronJob {
  name: string;
  schedule: string;
  last_run?: string;
  next_run?: string;
  enabled?: boolean;
  target?: string;
  status?: string;
}

interface ClickUpTask {
  id: string;
  name: string;
  status: { status: string; color: string };
  priority?: { priority: string; color: string } | null;
  assignees?: Array<{ username: string }>;
  due_date?: string | null;
  date_created?: string;
}

interface MemoryStats {
  dailyLogs: number;
  archived: number;
  dbSizeMb: number;
  totalFiles: number;
  lastUpdated: string;
}

interface SessionEntry {
  agent?: string;
  started?: string;
  last_active?: string;
  messages?: number;
  status?: string;
}

interface ModelConfig {
  primary: string;
  fallbacks: string[];
  availableModels: Array<{ id: string; alias: string; label: string }>;
}

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

export function NatliDashboard() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [crons, setCrons] = useState<CronJob[]>([]);
  const [tasks, setTasks] = useState<ClickUpTask[]>([]);
  const [memory, setMemory] = useState<MemoryStats | null>(null);
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingModel, setRefreshingModel] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [gatewayRestarting, setGatewayRestarting] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatActive] = useState(false);

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
    setCrons(Array.isArray(c) ? c : (c as any)?.jobs ?? (c as any)?.crons ?? []);
    setTasks(t?.tasks ?? []);
    setMemory(m);
    setSessions(Array.isArray(s) ? s : s?.sessions ?? []);
    setModelConfig(mc);
    setLoading(false);
    setRefreshing(false);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleRefreshModel = async () => {
    setRefreshingModel(true);
    const mc = await fetchApi<ModelConfig>('/api/config/model');
    setModelConfig(mc);
    setRefreshingModel(false);
  };

  const handleGatewayRestart = async () => {
    setShowRestartConfirm(false);
    setGatewayRestarting(true);
    try {
      await fetch('/api/gateway/restart', { method: 'POST' });
    } catch { /* gateway will restart — connection drop is expected */ }
    // Wait 5s for gateway to come back, then reload dashboard data
    setTimeout(() => {
      setGatewayRestarting(false);
      loadData();
    }, 5000);
  };

  if (loading) return <DashboardSkeleton />;

  const activeSessions = sessions.filter(s => {
    if ((s as any).isActive) return true;
    if ((s as any).ageMs != null) return (s as any).ageMs < 300_000;
    if (s.status === 'active') return true;
    if (s.last_active) {
      const diff = Date.now() - new Date(s.last_active).getTime();
      return diff < 300_000;
    }
    return false;
  }).length;

  const enabledCrons = crons.filter(c => c.enabled !== false).length;
  const inProgressTasks = tasks.filter(t =>
    t.status?.status?.toLowerCase().includes('progress') ||
    t.status?.status?.toLowerCase() === 'in progress'
  ).length;

  const resolveModelLabel = (id: string) => {
    const model = modelConfig?.availableModels.find(m => m.id === id);
    return model?.label ?? id;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Live monitoring for Nat Lee AI operations
        </p>

        {/* Global Search — Cmd+K */}
        <GlobalSearch
          onNavigate={(tab) => setActiveTab(tab)}
          sessions={sessions as Array<Record<string, unknown>>}
          cronJobs={crons as unknown as Array<Record<string, unknown>>}
        />

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">Last updated: {lastUpdated}</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-[#023F59]/30 hover:bg-[#023F59] hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRestartConfirm(true)}
            disabled={gatewayRestarting}
            className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
          >
            <Power className={`w-3.5 h-3.5 mr-1.5 ${gatewayRestarting ? 'animate-pulse' : ''}`} />
            {gatewayRestarting ? 'Restarting…' : 'Restart Gateway'}
          </Button>
          <Button
            onClick={() => setChatOpen(true)}
            className="h-8 w-8 p-0 rounded-full bg-[#023F59] hover:bg-[#107DAC] text-white shadow-md relative"
            title="Quick Chat with Nat Lee"
          >
            <Bot className="w-4 h-4" />
            {chatActive && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />}
          </Button>
        </div>

        {/* Restart Confirm Dialog */}
        {showRestartConfirm && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Power className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-[#21262A]">Restart Gateway?</p>
                  <p className="text-xs text-muted-foreground mt-0.5">All active sessions will be briefly interrupted. Takes ~5 seconds.</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => setShowRestartConfirm(false)} className="border-[#023F59]/20">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleGatewayRestart} className="bg-red-600 text-white hover:bg-red-700">
                  <Power className="w-3.5 h-3.5 mr-1.5" />
                  Yes, Restart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full overflow-x-auto bg-[#023F59]/5 h-auto flex-nowrap justify-start gap-0.5 px-1 py-1">
          <TabsTrigger value="overview"  className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">Overview</TabsTrigger>
          <TabsTrigger value="system"   className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">System Health</TabsTrigger>
          <TabsTrigger value="model"    className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">Model</TabsTrigger>
          <TabsTrigger value="sessions" className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">Session</TabsTrigger>
          <TabsTrigger value="memory"   className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">Memory</TabsTrigger>
          <TabsTrigger value="schedule" className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">Schedule</TabsTrigger>
          <TabsTrigger value="skill"    className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">Skill</TabsTrigger>

        </TabsList>

        {/* ─── Overview Tab ──────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab
            health={health}
            sessions={sessions as any}
            crons={crons as any}
            tasks={tasks}
            modelConfig={modelConfig}
            memory={memory}
            onNavigateTo={setActiveTab}
          />
        </TabsContent>

        {/* ─── System Tab ────────────────────────────────────── */}
        <TabsContent value="system" className="space-y-6">

          {/* ── SECTION 1: OpenClaw Health ─────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
              <span className="text-lg font-bold text-[#21262A]">
                {health?.gatewayReachable ? '🟢' : '🔴'} OpenClaw Health
              </span>
            </div>

            {/* Quick-glance pills */}
            <div className="flex flex-wrap gap-2">
              <Badge className={`px-3 py-1 text-xs font-semibold border-0 ${health?.gatewayReachable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                Gateway {health?.gatewayReachable ? 'ONLINE' : 'OFFLINE'}
              </Badge>
              <Badge className="px-3 py-1 text-xs font-semibold bg-[#31D7DB]/20 text-[#107DAC] border-0">
                <Brain className="w-3 h-3 mr-1" />
                {health?.primaryModel || '—'}
              </Badge>
              <Badge className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 border-0">
                <Clock className="w-3 h-3 mr-1" />
                {health?.gatewayStartTime ? formatUptime(health.gatewayStartTime) : '—'}
              </Badge>
              <Badge className="px-3 py-1 text-xs font-semibold bg-[#107DAC]/15 text-[#107DAC] border-0">
                <Activity className="w-3 h-3 mr-1" />
                {health?.totalSessions ?? 0} sessions
              </Badge>
            </div>

            {/* 3 cards: Gateway | Model + Sessions | Services */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Gateway */}
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#31D7DB]" />
                      <span className="text-sm font-semibold text-[#21262A]">Gateway</span>
                    </div>
                    <Badge className={`text-[10px] font-bold px-2 py-0.5 border-0 ${health?.gatewayReachable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {health?.gatewayReachable ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <div className="text-muted-foreground">Version</div>
                    <div className="font-mono text-[#21262A]">{health?.gatewayVersion || '—'}</div>
                    <div className="text-muted-foreground">PID</div>
                    <div className="font-mono text-[#21262A]">{health?.gatewayPid || '—'}</div>
                    <div className="text-muted-foreground">Uptime</div>
                    <div className="font-mono text-[#21262A]">{health?.gatewayStartTime ? formatUptime(health.gatewayStartTime) : '—'}</div>
                    <div className="text-muted-foreground">Latency</div>
                    <div className="font-mono text-[#21262A]">{health?.gatewayLatencyMs ?? 0} ms</div>
                    <div className="text-muted-foreground">Host</div>
                    <div className="font-mono text-[#21262A] truncate text-xs col-span-1">{health?.gatewayHost || '—'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Model & Sessions */}
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-semibold text-[#21262A]">AI Model & Sessions</span>
                  </div>
                  <p className="text-xl font-bold text-[#107DAC] leading-tight">
                    {health?.primaryModel ? resolveModelLabel(health.primaryModel) : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">{health?.primaryModel || ''}</p>
                  <div className="mt-3 pt-3 border-t border-[#023F59]/10 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <div className="text-muted-foreground">Sessions</div>
                    <div className="font-bold text-[#107DAC]">{health?.totalSessions ?? 0}</div>
                    <div className="text-muted-foreground">Last active</div>
                    <div className="font-mono text-[#21262A]">{health?.timestamp ? formatTimeAgo(health.timestamp) : '—'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-semibold text-[#21262A]">Services</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Gateway :18789', ok: health?.gatewayReachable },
                      { label: 'Ollama :11434', ok: health?.services?.ollama, sub: health?.ollamaModel },
                      { label: 'Slack', ok: health?.services?.openclaw, sub: 'via gateway' },
                    ].map(({ label, ok, sub }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-[#21262A]">{label}</span>
                          {sub && <span className="ml-1.5 text-xs text-muted-foreground font-mono">{sub}</span>}
                        </div>
                        <Badge className={`text-[10px] font-bold px-2 py-0 border-0 ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {ok ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ── SECTION 2: Mac mini Hardware ───────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
              <span className="text-lg font-bold text-[#21262A]">🖥️ Mac mini Hardware</span>
              {health?.socModel && (
                <span className="text-sm text-muted-foreground">
                  {health.socModel} · {health.coreCount} cores ({health.eCores}E + {health.pCores}P) ·{' '}
                  <span className={health.thermalState === 'Normal' ? 'text-emerald-600' : 'text-amber-600'}>{health.thermalState}</span>
                </span>
              )}
            </div>

            {/* Resource gauges — 4 across */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'CPU', value: health?.cpu ?? 0, sub: `${health?.cpuTemp ?? 0}°C · ${health?.cpuPowerW ?? 0}W` },
                { label: 'Memory', value: health?.memory ?? 0, sub: `${health?.memUsedGb ?? 0} / ${health?.memTotalGb ?? 0} GB` },
                { label: 'Disk', value: health?.disk ?? 0, sub: 'system volume' },
                { label: 'GPU', value: health?.gpuPercent ?? 0, sub: `${health?.gpuFreqMhz ?? 0} MHz · ${health?.gpuTemp ?? 0}°C` },
              ].map(({ label, value, sub }) => (
                <Card key={label} className="border-[#023F59]/20">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-sm font-semibold text-[#21262A]">{label}</span>
                      <span className={`text-lg font-bold ${value > 85 ? 'text-red-600' : value > 70 ? 'text-amber-600' : 'text-[#107DAC]'}`}>{value}%</span>
                    </div>
                    <Progress value={value} className={`h-2 mb-1.5 ${value > 85 ? '[&>div]:bg-red-500' : value > 70 ? '[&>div]:bg-amber-500' : '[&>div]:bg-[#31D7DB]'}`} />
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Network & Disk I/O */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-semibold text-[#21262A]">Network</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">↓</span>
                      <div>
                        <p className="font-mono font-bold text-[#107DAC]">{health?.netInKbps ?? 0} KB/s</p>
                        <p className="text-xs text-muted-foreground">Inbound</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#107DAC] font-bold">↑</span>
                      <div>
                        <p className="font-mono font-bold text-[#107DAC]">{health?.netOutKbps ?? 0} KB/s</p>
                        <p className="text-xs text-muted-foreground">Outbound</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <HardDrive className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-semibold text-[#21262A]">Disk I/O</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-mono font-bold text-[#107DAC]">{health?.diskReadKbps ?? 0} KB/s</p>
                      <p className="text-xs text-muted-foreground">Read</p>
                    </div>
                    <div>
                      <p className="font-mono font-bold text-[#107DAC]">{health?.diskWriteKbps ?? 0} KB/s</p>
                      <p className="text-xs text-muted-foreground">Write</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Processes */}
            {health?.topProcesses && health.topProcesses.length > 0 && (
              <Card className="border-[#023F59]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-[#21262A]">Top Processes</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#023F59]/10 text-xs text-muted-foreground">
                          <th className="text-left py-1.5 pr-3 font-medium">PID</th>
                          <th className="text-left py-1.5 pr-3 font-medium">Process</th>
                          <th className="text-right py-1.5 pr-3 font-medium">CPU%</th>
                          <th className="text-right py-1.5 pr-3 font-medium">Mem%</th>
                          <th className="text-right py-1.5 font-medium">GPU ms/s</th>
                        </tr>
                      </thead>
                      <tbody>
                        {health.topProcesses.map((p: {pid:number;command:string;cpu_percent:number;memory_percent:number;gpu_ms_per_sec?:number}, i: number) => (
                          <tr key={i} className={`border-b border-[#023F59]/5 ${p.cpu_percent > 10 ? 'bg-amber-50' : ''}`}>
                            <td className="py-1.5 pr-3 font-mono text-xs text-muted-foreground">{p.pid}</td>
                            <td className="py-1.5 pr-3 font-mono text-xs truncate max-w-[140px]">{p.command}</td>
                            <td className={`py-1.5 pr-3 text-right font-mono text-xs font-semibold ${p.cpu_percent > 10 ? 'text-amber-700' : 'text-[#21262A]'}`}>
                              {p.cpu_percent.toFixed(1)}
                            </td>
                            <td className="py-1.5 pr-3 text-right font-mono text-xs text-[#21262A]">{(p.memory_percent * 100).toFixed(1)}</td>
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

          {/* ── Alerts ──────────────────────────────────────── */}
          {health && health.alerts.length > 0 && (
            <Card className="border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-[#21262A] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {health.alerts.map((alert, i) => (
                    <div key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md border ${alert.level === 'critical' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                      <Badge className={`text-[10px] uppercase font-bold px-1.5 py-0 ${alert.level === 'critical' ? 'bg-red-600 text-white border-0' : 'bg-amber-500 text-white border-0'}`}>{alert.level}</Badge>
                      <Badge variant="outline" className="text-[10px] uppercase font-medium px-1.5 py-0 border-[#31D7DB] text-[#107DAC]">{alert.type}</Badge>
                      <span className="text-xs text-muted-foreground shrink-0">{alert.timestamp}</span>
                      <span className="flex-1">{alert.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ─── Memory & Knowledge Tab ────────────────────────── */}
        <TabsContent value="memory" className="space-y-4">
          <MemoryTab health={health} />
        </TabsContent>

        {/* ─── Schedule Tab ──────────────────────────────────── */}
        <TabsContent value="schedule" className="space-y-4">
          <Suspense fallback={<div className="text-muted-foreground text-sm p-8 text-center">Loading Scheduler…</div>}>
            <LazyNatliSchedulerPage embedded={true} />
          </Suspense>
        </TabsContent>

        {/* ─── Task Tab ──────────────────────────────────────── */}
        {/* ─── Model Tab ──────────────────────────────────── */}
        <TabsContent value="model" className="space-y-4">
          <Suspense fallback={<div className="text-muted-foreground text-sm p-8 text-center">Loading Model stats…</div>}>
            <LazyModelTab />
          </Suspense>
        </TabsContent>


        {/* ─── Skill Tab (Tracker, live data) ──────────────────── */}
        <TabsContent value="skill" className="space-y-4">
          <Suspense fallback={<div className="text-muted-foreground text-sm p-8 text-center">Loading Skill tracker…</div>}>
            <LiveSkillTracker />
          </Suspense>
        </TabsContent>

        {/* ─── Sessions Tab ──────────────────────────────────── */}
        <TabsContent value="sessions" className="space-y-4">
          <Suspense fallback={<div className="text-muted-foreground text-sm p-8 text-center">Loading Sessions…</div>}>
            <LazySessionsTab />
          </Suspense>
        </TabsContent>

      </Tabs>

      <QuickChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        activeTab={activeTab}
      />
    </div>
  );
}

// ─── Live Skill Tracker wrapper (fetches live API data) ──────────────────────
import { type Skill } from './skills/skills-data';
import { getSkillStats, ALL_SKILLS } from './skills/skills-data';
const SkillTrackerComponent = lazy(() => import('./skills/SkillTracker').then(m => ({ default: m.SkillTracker })));

function LiveSkillTracker() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getSkillStats> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then((data: { skills: Skill[]; stats: { total: number; custom: number; system: number; ready: number; needsSetup: number; withContract: number } }) => {
        setSkills(data.skills);
        // Build a stats shape compatible with SkillTracker
        const liveStats = getSkillStats(); // base shape
        liveStats.total = data.stats.total;
        liveStats.totalCustom = data.stats.custom;
        liveStats.totalSystem = data.stats.system;
        liveStats.ready = data.stats.ready;
        liveStats.needsSetup = data.stats.needsSetup;
        liveStats.withContract = data.stats.withContract;
        liveStats.contractCoverage = data.stats.custom > 0
          ? Math.round((data.stats.withContract / data.stats.custom) * 100)
          : 0;
        setStats(liveStats);
      })
      .catch(() => {
        // Fallback to static
        setSkills(ALL_SKILLS);
        setStats(getSkillStats());
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-muted-foreground text-sm p-8 text-center">Loading skills data…</div>;
  if (!stats) return null;

  return (
    <Suspense fallback={<div className="text-muted-foreground text-sm p-8 text-center">Loading…</div>}>
      <SkillTrackerComponent stats={stats} skills={skills} />
    </Suspense>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

function formatUptime(startTimeStr: string): string {
  try {
    const start = new Date(startTimeStr);
    if (isNaN(start.getTime())) return '—';
    const diff = Date.now() - start.getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${mins}m`;
  } catch { return '—'; }
}

function formatTimeAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  } catch { return '—'; }
}

// ─── Sub-Components ──────────────────────────────────────────

function KPICard({ title, value, icon, description }: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card className="border-[#023F59]/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-[#21262A]">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#107DAC]">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ServiceStatusRow({ name, status, port }: {
  name: string;
  status: 'online' | 'offline' | 'unknown';
  port?: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Server className="w-3.5 h-3.5 text-[#31D7DB]" />
        <span className="text-sm">{name}</span>
        {port && <span className="text-xs text-muted-foreground">:{port}</span>}
      </div>
      <StatusDot status={status} />
    </div>
  );
}

function StatusDot({ status }: { status: 'online' | 'offline' | 'unknown' }) {
  if (status === 'online') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === 'offline') return <XCircle className="w-4 h-4 text-red-500" />;
  return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
}

function TaskTab({ tasks }: { tasks: ClickUpTask[] }) {
  const [filter, setFilter] = useState('all');

  const filtered = tasks.filter(t => {
    if (filter === 'all') return true;
    const s = t.status?.status?.toLowerCase() ?? '';
    if (filter === 'todo') return s === 'to do' || s === 'open';
    if (filter === 'in_progress') return s.includes('progress');
    if (filter === 'done') return s === 'complete' || s === 'closed' || s === 'done';
    if (filter === 'overdue') {
      return t.due_date && new Date(parseInt(t.due_date)) < new Date();
    }
    return true;
  });

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
    { value: 'overdue', label: 'Overdue' },
  ];

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map(f => (
          <Button
            key={f.value}
            variant={filter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.value)}
            className={filter === f.value ? 'bg-[#023F59] hover:bg-[#022F44] text-white' : 'border-[#023F59]/30 hover:bg-[#023F59]/10'}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-[#023F59]/20">
          <CardContent className="py-8 text-center text-muted-foreground text-sm">
            No tasks found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(task => (
            <Card key={task.id} className="border-[#023F59]/20 hover:border-[#31D7DB]/50 transition-colors cursor-pointer">
              <CardContent className="pt-4 pb-3 space-y-2">
                <p className="font-medium text-sm leading-tight line-clamp-2 text-[#21262A]">{task.name}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={
                      task.status?.status?.toLowerCase().includes('progress')
                        ? 'bg-[#31D7DB]/20 text-[#107DAC] border-0'
                        : task.status?.status?.toLowerCase() === 'complete' || task.status?.status?.toLowerCase() === 'closed'
                        ? 'bg-emerald-100 text-emerald-700 border-0'
                        : 'bg-gray-100 text-gray-600 border-0'
                    }
                  >
                    {task.status?.status || 'Unknown'}
                  </Badge>
                  {task.priority?.priority && (
                    <Badge variant="outline" className="text-xs border-[#023F59]/20">
                      {task.priority.priority}
                    </Badge>
                  )}
                </div>
                {task.due_date && (
                  <p className="text-xs text-muted-foreground">
                    Due: {new Date(parseInt(task.due_date)).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="h-10 w-full" />
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
