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
} from 'lucide-react';
import { Button } from '../ui/button';

// ─── Types ───────────────────────────────────────────────────

interface HealthData {
  status: string;
  alerts: string[];
  cpu?: number;
  memory?: number;
  disk?: number;
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
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-[#023F59]/5">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#023F59] data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-[#023F59] data-[state=active]:text-white">System</TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-[#023F59] data-[state=active]:text-white">Schedule</TabsTrigger>
          <TabsTrigger value="task" className="data-[state=active]:bg-[#023F59] data-[state=active]:text-white">Task</TabsTrigger>
          <TabsTrigger value="research" className="data-[state=active]:bg-[#023F59] data-[state=active]:text-white">Research</TabsTrigger>
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
                <Badge className="bg-[#31D7DB]/20 text-[#107DAC] border-0 hover:bg-[#31D7DB]/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Online
                </Badge>
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
                  status={health?.status === 'ok' ? 'online' : 'unknown'}
                />
                <ServiceStatusRow name="Ollama" status="unknown" port={11434} />
                <ServiceStatusRow name="Gateway" status="unknown" port={18789} />
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
        <TabsContent value="system" className="space-y-4">
          {/* Active Model Config Status */}
          <Card className="border-[#31D7DB]/30 bg-gradient-to-r from-[#023F59]/5 to-[#31D7DB]/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-[#21262A] flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#31D7DB]" />
                Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Primary Model</p>
                  <p className="text-lg font-bold text-[#107DAC]">
                    {modelConfig ? resolveModelLabel(modelConfig.primary) : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Failover Chain</p>
                  <div className="flex flex-wrap gap-1.5">
                    {modelConfig && modelConfig.fallbacks.length > 0 ? (
                      modelConfig.fallbacks.map((f, i) => (
                        <Badge key={i} className="bg-[#31D7DB]/20 text-[#107DAC] border-0 hover:bg-[#31D7DB]/30 text-xs">
                          {resolveModelLabel(f)}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No failover configured</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <GaugeCard label="CPU" value={health?.cpu ?? 0} icon={<Cpu className="w-4 h-4 text-[#31D7DB]" />} />
            <GaugeCard label="Memory" value={health?.memory ?? 0} icon={<MemoryStick className="w-4 h-4 text-[#31D7DB]" />} />
            <GaugeCard label="Disk" value={health?.disk ?? 0} icon={<HardDrive className="w-4 h-4 text-[#31D7DB]" />} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ServiceCard name="OpenClaw" status={health?.status === 'ok' ? 'online' : 'offline'} />
            <ServiceCard name="Ollama" status="unknown" endpoint="localhost:11434" />
            <ServiceCard name="Gateway" status="unknown" endpoint="localhost:18789" />
          </div>

          {health && health.alerts.length > 0 && (
            <Card className="border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-[#21262A] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {health.alerts.map((alert, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-red-700">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {alert}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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

function GaugeCard({ label, value, icon }: {
  label: string;
  value: number;
  icon: React.ReactNode;
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
      </CardContent>
    </Card>
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
