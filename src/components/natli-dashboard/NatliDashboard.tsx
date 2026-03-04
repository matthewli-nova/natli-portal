import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Activity,
  Clock,
  Cpu,
  Database,
  HardDrive,
  MemoryStick,
  Play,
  RefreshCw,
  Server,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ListTodo,
  Brain,
  FileText,
  Zap,
  ArrowDown,
  ArrowUp,
  Monitor,
  Thermometer,
  Search,
  Hash,
  Archive,
  BookOpen,
} from 'lucide-react';
import { Button } from '../ui/button';

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
    setCrons(Array.isArray(c) ? c : c?.crons ?? []);
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

  if (loading) return <DashboardSkeleton />;

  const activeSessions = sessions.filter(s => {
    if (s.status === 'active') return true;
    if (s.last_active) {
      const diff = Date.now() - new Date(s.last_active).getTime();
      return diff < 60 * 60 * 1000;
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
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full overflow-x-auto bg-[#023F59]/5 h-auto flex-nowrap justify-start gap-0.5 px-1 py-1">
          <TabsTrigger value="overview" className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">Overview</TabsTrigger>
          <TabsTrigger value="system" className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">System Health</TabsTrigger>
          <TabsTrigger value="memory" className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">Memory & Knowledge</TabsTrigger>
          <TabsTrigger value="schedule" className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">Schedule</TabsTrigger>
          <TabsTrigger value="task" className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">Task</TabsTrigger>
          <TabsTrigger value="research" className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">Research</TabsTrigger>
        </TabsList>

        {/* ─── Overview Tab ──────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-4">
          {/* Active Model Banner */}
          <Card className="border-[#31D7DB]/30 bg-gradient-to-r from-[#023F59]/5 to-[#31D7DB]/5">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#023F59]/10">
                  <Brain className="w-6 h-6 text-[#31D7DB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Model</p>
                  <p className="text-xl font-bold text-[#107DAC]">
                    {modelConfig ? resolveModelLabel(modelConfig.primary) : '—'}
                  </p>
                  {modelConfig && modelConfig.fallbacks.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Failover: {modelConfig.fallbacks.map(f => resolveModelLabel(f)).join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshModel}
                    disabled={refreshingModel}
                    className="h-7 w-7 p-0 hover:bg-[#023F59]/10"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#107DAC] ${refreshingModel ? 'animate-spin' : ''}`} />
                  </Button>
                  <Badge className="bg-[#31D7DB]/20 text-[#107DAC] border-0 hover:bg-[#31D7DB]/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Online
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Active Sessions"
              value={activeSessions}
              icon={<Activity className="w-4 h-4 text-[#31D7DB]" />}
              description="Last 60 minutes"
            />
            <KPICard
              title="Cron Jobs"
              value={enabledCrons}
              icon={<Timer className="w-4 h-4 text-[#31D7DB]" />}
              description={`${crons.length} total`}
            />
            <KPICard
              title="Tasks In Progress"
              value={inProgressTasks}
              icon={<ListTodo className="w-4 h-4 text-[#31D7DB]" />}
              description={`${tasks.length} total tasks`}
            />
            <KPICard
              title="Memory Files"
              value={memory?.dailyLogs ?? 0}
              icon={<Brain className="w-4 h-4 text-[#31D7DB]" />}
              description={`${memory?.dbSizeMb ?? 0} MB database`}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Activity Feed */}
            <Card className="border-[#023F59]/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-[#21262A]">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sessions.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <Activity className="w-3.5 h-3.5 mt-0.5 text-[#31D7DB] shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{s.agent || 'Session'}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.last_active ? new Date(s.last_active).toLocaleString() : 'Unknown'}
                        {s.messages ? ` · ${s.messages} messages` : ''}
                      </p>
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent sessions</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Status */}
            <Card className="border-[#023F59]/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-[#21262A]">Service Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ServiceStatusRow
                  name="OpenClaw"
                  status={health?.services?.openclaw ? 'online' : health ? 'offline' : 'unknown'}
                />
                <ServiceStatusRow name="Ollama" status={health?.services?.ollama ? 'online' : health ? 'offline' : 'unknown'} port={11434} />
                <ServiceStatusRow name="Gateway" status={health?.services?.gateway ? 'online' : health ? 'offline' : 'unknown'} port={18789} />
                <Separator className="my-2" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>System: CPU {health?.cpu ?? '—'}% · Memory {health?.memory ?? '—'}% · Disk {health?.disk ?? '—'}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── System Tab ────────────────────────────────────── */}
        <TabsContent value="system" className="space-y-6">
          {/* ════════════════════════════════════════════════════ */}
          {/* SECTION 1: System Status                            */}
          {/* ════════════════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
              <span className="text-lg font-bold text-[#21262A]">
                {health?.gatewayReachable && health?.gatewayServiceRunning ? '\u{1F7E2}' : health?.gatewayServiceRunning ? '\u{1F7E1}' : '\u{1F534}'} System Status
              </span>
            </div>

            {/* Top Status Bar — pill badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={`px-3 py-1 text-xs font-semibold border-0 ${health?.gatewayReachable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                Gateway: {health?.gatewayReachable ? 'ONLINE' : 'OFFLINE'}
              </Badge>
              <Badge className="px-3 py-1 text-xs font-semibold bg-[#31D7DB]/20 text-[#107DAC] border-0">
                {health?.primaryModel || '—'}
              </Badge>
              <Badge className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 border-0">
                <Clock className="w-3 h-3 mr-1" />
                {health?.gatewayStartTime ? formatUptime(health.gatewayStartTime) : '—'}
              </Badge>
              <Badge className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 border-0">
                <Activity className="w-3 h-3 mr-1" />
                {health?.totalSessions ?? 0} sessions
              </Badge>
            </div>

            {/* Status Grid — 2-column cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Card 1: Gateway */}
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
                    <div className="text-muted-foreground">Host</div>
                    <div className="font-mono text-[#21262A] truncate">{health?.gatewayHost || '—'}</div>
                    <div className="text-muted-foreground">Latency</div>
                    <div className="font-mono text-[#21262A]">{health?.gatewayLatencyMs ?? 0} ms</div>
                    <div className="text-muted-foreground">PID</div>
                    <div className="font-mono text-[#21262A]">{health?.gatewayPid || '—'}</div>
                    <div className="text-muted-foreground">Started</div>
                    <div className="font-mono text-[#21262A] text-xs">{health?.gatewayStartTime || '—'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Current Model */}
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-semibold text-[#21262A]">Current Model</span>
                  </div>
                  <p className="text-2xl font-bold text-[#107DAC]">
                    {health?.primaryModel ? resolveModelLabel(health.primaryModel) : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{health?.primaryModel || ''}</p>
                </CardContent>
              </Card>

              {/* Card 3: Active Sessions */}
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-semibold text-[#21262A]">Active Sessions</span>
                  </div>
                  <p className="text-3xl font-bold text-[#107DAC]">{health?.totalSessions ?? 0}</p>
                  <p className="text-xs text-muted-foreground">total sessions</p>
                </CardContent>
              </Card>

              {/* Card 4: Mac mini Health (compact) */}
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-semibold text-[#21262A]">Mac mini Health</span>
                  </div>
                  <div className="space-y-2.5">
                    <MiniBar label="CPU" value={health?.cpu ?? 0} />
                    <MiniBar label="RAM" value={health?.memory ?? 0} />
                    <MiniBar label="Disk" value={health?.disk ?? 0} />
                  </div>
                </CardContent>
              </Card>

              {/* Card 5: Ollama Status */}
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#31D7DB]" />
                      <span className="text-sm font-semibold text-[#21262A]">Ollama</span>
                    </div>
                    <Badge className={`text-[10px] font-bold px-2 py-0.5 border-0 ${health?.services?.ollama ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {health?.services?.ollama ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <div className="text-muted-foreground">Model</div>
                    <div className="font-mono text-[#21262A]">{health?.ollamaModel || '—'}</div>
                    <div className="text-muted-foreground">Dims</div>
                    <div className="font-mono text-[#21262A]">768</div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 6: Last Active */}
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-semibold text-[#21262A]">Last Active</span>
                  </div>
                  <p className="text-2xl font-bold text-[#107DAC]">
                    {health?.timestamp ? formatTimeAgo(health.timestamp) : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : ''}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════ */}
          {/* OpenClaw Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
              <span className="text-lg font-bold text-[#21262A]">⚙️ OpenClaw Health</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Gateway Service */}
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#31D7DB]" />
                      <span className="text-sm font-semibold text-[#21262A]">Gateway Service</span>
                    </div>
                    <Badge className={`text-[10px] font-bold px-2 py-0.5 border-0 ${health?.gatewayServiceRunning ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {health?.gatewayServiceRunning ? 'Running' : 'Stopped'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <div className="text-muted-foreground">Version</div>
                    <div className="font-mono text-[#21262A]">{health?.gatewayVersion || '—'}</div>
                    <div className="text-muted-foreground">PID</div>
                    <div className="font-mono text-[#21262A]">{health?.gatewayPid || '—'}</div>
                    <div className="text-muted-foreground">Latency</div>
                    <div className="font-mono text-[#21262A]">{health?.gatewayLatencyMs ?? 0} ms</div>
                    <div className="text-muted-foreground">Uptime</div>
                    <div className="font-mono text-[#21262A]">{health?.gatewayStartTime ? formatUptime(health.gatewayStartTime) : '—'}</div>
                    <div className="text-muted-foreground">Host</div>
                    <div className="font-mono text-[#21262A] truncate text-xs">{health?.gatewayHost || '—'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Model */}
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-semibold text-[#21262A]">Active Model</span>
                  </div>
                  <p className="text-xl font-bold text-[#107DAC] leading-tight">
                    {health?.primaryModel ? resolveModelLabel(health.primaryModel) : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{health?.primaryModel || ''}</p>
                  <div className="mt-3 pt-3 border-t border-[#023F59]/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sessions</span>
                      <span className="font-bold text-[#107DAC]">{health?.totalSessions ?? 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Channels & Services */}
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-semibold text-[#21262A]">Services</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Gateway :18789', ok: health?.gatewayReachable },
                      { label: 'Ollama :11434', ok: health?.services?.ollama },
                      { label: 'Slack Channel', ok: true },
                    ].map(({ label, ok }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
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

          {/* ════════════════════════════════════════════════════ */}
          {/* Alerts */}
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
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md border ${
                        alert.level === 'critical'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}
                    >
                      <Badge className={`text-[10px] uppercase font-bold px-1.5 py-0 ${
                        alert.level === 'critical' ? 'bg-red-600 text-white border-0' : 'bg-amber-500 text-white border-0'
                      }`}>
                        {alert.level}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] uppercase font-medium px-1.5 py-0 border-[#31D7DB] text-[#107DAC]">
                        {alert.type}
                      </Badge>
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
        <TabsContent value="memory" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
              <span className="text-lg font-bold text-[#21262A]">🧠 Memory & Knowledge</span>
            </div>

            {/* MEMORY.md Health Card */}
            <Card className="border-[#023F59]/20">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-semibold text-[#21262A]">MEMORY.md Health</span>
                  </div>
                  {(health?.memoryMdLines ?? 0) >= 145 && (
                    <Badge className="bg-red-100 text-red-700 border-0 text-[10px] font-bold">NEAR CAP</Badge>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        {health?.memoryMdLines ?? 0} / {health?.memoryMdCap ?? 150} lines used
                      </span>
                      <span className="font-semibold text-[#21262A]">
                        {health?.memoryMdCap ? Math.round(((health?.memoryMdLines ?? 0) / health.memoryMdCap) * 100) : 0}%
                      </span>
                    </div>
                    <Progress
                      value={health?.memoryMdCap ? ((health?.memoryMdLines ?? 0) / health.memoryMdCap) * 100 : 0}
                      className={`h-2.5 ${
                        (health?.memoryMdLines ?? 0) >= 145
                          ? '[&>div]:bg-red-500'
                          : (health?.memoryMdLines ?? 0) >= 120
                          ? '[&>div]:bg-amber-500'
                          : '[&>div]:bg-emerald-500'
                      }`}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-red-100 text-red-700 border-0 text-xs">P0: {health?.p0Sections ?? 0} sections</Badge>
                    <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">P1: {health?.p1Sections ?? 0} sections</Badge>
                    <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">P2: {health?.p2Sections ?? 0} sections</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Base Grid — 4 stat cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KPICard title="Chunks Indexed" value={health?.memoryChunks ?? 0} icon={<Hash className="w-4 h-4 text-[#31D7DB]" />} description="memory chunks" />
              <KPICard title="Files Indexed" value={health?.memoryFiles ?? 0} icon={<FileText className="w-4 h-4 text-[#31D7DB]" />} description="source files" />
              <KPICard title="Cache Entries" value={health?.cacheEntries ?? 0} icon={<Database className="w-4 h-4 text-[#31D7DB]" />} description="embedding cache" />
              <KPICard title="SQLite DB" value={`${health?.memoryDbSizeMb ?? 0}`} icon={<HardDrive className="w-4 h-4 text-[#31D7DB]" />} description="MB" />
            </div>

            {/* Memory System Status */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4 flex items-center gap-3">
                  <Search className="w-5 h-5 text-[#31D7DB]" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[#21262A]">Vector Search</p>
                    <p className="text-xs text-muted-foreground">768 dims · nomic-embed-text</p>
                  </div>
                  <Badge className={`text-xs font-bold border-0 ${health?.vectorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {health?.vectorEnabled ? '✅ Ready' : '❌ Offline'}
                  </Badge>
                </CardContent>
              </Card>
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4 flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#31D7DB]" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[#21262A]">Full-text Search</p>
                    <p className="text-xs text-muted-foreground">FTS5 index</p>
                  </div>
                  <Badge className={`text-xs font-bold border-0 ${health?.ftsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {health?.ftsEnabled ? '✅ Ready' : '❌ Offline'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Daily Log Stats + Last Sync */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-medium text-[#21262A]">Daily Logs</span>
                  </div>
                  <p className="text-2xl font-bold text-[#107DAC]">{health?.memoryDailyLogs ?? 0}</p>
                  <p className="text-xs text-muted-foreground">files</p>
                </CardContent>
              </Card>
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Archive className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-medium text-[#21262A]">Archive</span>
                  </div>
                  <p className="text-2xl font-bold text-[#107DAC]">{health?.memoryArchiveCount ?? 0}</p>
                  <p className="text-xs text-muted-foreground">files</p>
                </CardContent>
              </Card>
              <Card className="border-[#023F59]/20">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#31D7DB]" />
                    <span className="text-sm font-medium text-[#21262A]">Last Sync</span>
                  </div>
                  <p className="text-sm font-mono text-[#107DAC]">
                    {health?.lastMemorySyncTime ? new Date(health.lastMemorySyncTime).toLocaleString() : '—'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ─── Schedule Tab ──────────────────────────────────── */}
        <TabsContent value="schedule" className="space-y-4">
          <Card className="border-[#023F59]/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-[#21262A]">Cron Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {crons.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No cron jobs found. Run `openclaw cron list --json` to verify.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#023F59]/10">
                      <TableHead>Name</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead>Next Run</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {crons.map((cron, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{cron.name}</TableCell>
                        <TableCell className="font-mono text-xs">{cron.schedule}</TableCell>
                        <TableCell className="text-xs">
                          {cron.last_run ? new Date(cron.last_run).toLocaleString() : '—'}
                        </TableCell>
                        <TableCell className="text-xs">
                          {cron.next_run ? new Date(cron.next_run).toLocaleString() : '—'}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            cron.enabled !== false
                              ? 'bg-[#31D7DB]/20 text-[#107DAC] border-0 hover:bg-[#31D7DB]/30'
                              : 'bg-gray-100 text-gray-500 border-0'
                          }>
                            {cron.enabled !== false ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="hover:text-[#31D7DB]">
                            <Play className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Task Tab ──────────────────────────────────────── */}
        <TabsContent value="task" className="space-y-4">
          <TaskTab tasks={tasks} />
        </TabsContent>

        {/* ─── Research Tab ──────────────────────────────────── */}
        <TabsContent value="research" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <KPICard
              title="Sessions"
              value={sessions.length}
              icon={<Activity className="w-4 h-4 text-[#31D7DB]" />}
              description="Total sessions"
            />
            <KPICard
              title="Memory Files"
              value={memory?.totalFiles ?? 0}
              icon={<FileText className="w-4 h-4 text-[#31D7DB]" />}
              description={`${memory?.dailyLogs ?? 0} daily logs`}
            />
            <KPICard
              title="DB Size"
              value={`${memory?.dbSizeMb ?? 0}`}
              icon={<Database className="w-4 h-4 text-[#31D7DB]" />}
              description="MB SQLite"
            />
            <KPICard
              title="Archived"
              value={memory?.archived ?? 0}
              icon={<Brain className="w-4 h-4 text-[#31D7DB]" />}
              description="Archived memories"
            />
          </div>

          <Card className="border-[#023F59]/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-[#21262A]">Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                <div className="text-center space-y-2">
                  <Brain className="w-8 h-8 mx-auto text-[#31D7DB] opacity-50" />
                  <p>Knowledge growth chart will display here with time-series data</p>
                  {memory?.lastUpdated && (
                    <p className="text-xs">
                      Last updated: {new Date(memory.lastUpdated).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
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

function MiniBar({ label, value }: { label: string; value: number }) {
  const color = value > 80 ? '[&>div]:bg-red-500' : value > 60 ? '[&>div]:bg-amber-500' : '[&>div]:bg-[#31D7DB]';
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-8">{label}</span>
      <Progress value={value} className={`h-1.5 flex-1 ${color}`} />
      <span className="text-xs font-mono text-[#21262A] w-8 text-right">{value}%</span>
    </div>
  );
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

function GaugeCard({ label, value, icon, subtitle }: {
  label: string;
  value: number;
  icon: React.ReactNode;
  subtitle?: string;
}) {
  const color = value > 80 ? 'text-red-500' : value > 60 ? 'text-amber-500' : 'text-[#107DAC]';
  return (
    <Card className="border-[#023F59]/20">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium text-[#21262A]">{label}</span>
          </div>
          <span className={`text-2xl font-bold ${color}`}>{value}%</span>
        </div>
        <Progress value={value} className="h-2 [&>div]:bg-[#31D7DB]" />
        {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

function TempIndicator({ label, value }: { label: string; value: number }) {
  const color = value > 75 ? 'text-red-500' : value > 60 ? 'text-amber-500' : 'text-emerald-500';
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}<span className="text-sm font-normal">°C</span></p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ServiceCard({ name, status, endpoint }: {
  name: string;
  status: 'online' | 'offline' | 'unknown';
  endpoint?: string;
}) {
  return (
    <Card className="border-[#023F59]/20">
      <CardContent className="pt-6 flex items-center gap-3">
        <Server className="w-5 h-5 text-[#31D7DB]" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-[#21262A]">{name}</p>
          {endpoint && <p className="text-xs text-muted-foreground">{endpoint}</p>}
        </div>
        <StatusDot status={status} />
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
