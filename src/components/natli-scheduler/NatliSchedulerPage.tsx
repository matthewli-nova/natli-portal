import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Skeleton } from '../ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  Timer,
  Play,
  FileText,
  ChevronDown,
  ChevronRight,
  X,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Activity,
  Shield,
  Brain,
  Calendar,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────

interface CronJobSchedule {
  kind: string;
  everyMs?: number;
  expr?: string;
  at?: number;
  anchorMs?: number;
  tz?: string;
}

interface CronJobState {
  nextRunAtMs?: number;
  lastRunAtMs?: number;
  lastStatus?: string;
  lastDurationMs?: number;
  consecutiveErrors: number;
  lastRunStatus?: string;
  lastDeliveryStatus?: string;
  lastDelivered?: boolean;
}

interface CronJobPayload {
  kind: string;
  message?: string;
  model?: string;
}

interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: CronJobSchedule;
  scheduleDescription: string;
  sessionTarget: string;
  wakeMode?: string;
  payload: CronJobPayload;
  delivery?: { mode: string };
  state: CronJobState;
  createdAtMs: number;
  updatedAtMs: number;
}

interface TimelineEntry {
  jobId: string;
  jobName: string;
  firedAtMs: number;
  status: string;
}

interface RunEntry {
  ts: number;
  jobId: string;
  action: string;
  status: string;
  summary?: string;
  runAtMs?: number;
  durationMs?: number;
  nextRunAtMs?: number;
  model?: string;
  usage?: Record<string, unknown>;
  delivered?: boolean;
  sessionId?: string;
}

// ─── API ─────────────────────────────────────────────────────

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function postApi<T>(path: string, body?: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function patchApi<T>(path: string, body: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(path, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

// ─── Helpers ─────────────────────────────────────────────────

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'now';
  const totalSecs = Math.floor(ms / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function formatRelativeTime(ms: number): string {
  const diff = Date.now() - ms;
  if (diff < 0) return `in ${formatCountdown(-diff)}`;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

function formatModelShort(model?: string): string {
  if (!model) return '—';
  const last = model.split('/').pop() || model;
  return last.replace(/-/g, ' ').replace(/(\d+)\s+(\d+)/g, '$1.$2').split(' ').map(w =>
    /^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
}

// ─── Job Categorization ─────────────────────────────────────

interface JobGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  jobs: CronJob[];
}

function categorizeJobs(jobs: CronJob[]): JobGroup[] {
  const daily: CronJob[] = [];
  const memory: CronJob[] = [];
  const security: CronJob[] = [];
  const weekly: CronJob[] = [];
  const other: CronJob[] = [];

  for (const job of jobs) {
    const n = job.name.toLowerCase();
    if (n.startsWith('weekly_')) weekly.push(job);
    else if (n.startsWith('memory_')) memory.push(job);
    else if (n === 'openclaw_security_scan') security.push(job);
    else if (n.startsWith('daily_') || n === 'clickup_stuck_check' || n === 'weekend_morning_briefing') daily.push(job);
    else other.push(job);
  }

  const groups: JobGroup[] = [];
  if (daily.length) groups.push({ id: 'daily', label: '🔄 Daily Operations', icon: <Activity className="w-4 h-4" />, jobs: daily });
  if (memory.length) groups.push({ id: 'memory', label: '🧠 Memory & Maintenance', icon: <Brain className="w-4 h-4" />, jobs: memory });
  if (security.length) groups.push({ id: 'security', label: '🔒 Security', icon: <Shield className="w-4 h-4" />, jobs: security });
  if (weekly.length) groups.push({ id: 'weekly', label: '📅 Weekly', icon: <Calendar className="w-4 h-4" />, jobs: weekly });
  if (other.length) groups.push({ id: 'other', label: '📋 Other', icon: <FileText className="w-4 h-4" />, jobs: other });
  return groups;
}

// ─── Main Component ──────────────────────────────────────────

export function NatliSchedulerPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [logDrawerJobId, setLogDrawerJobId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [timelineZoom, setTimelineZoom] = useState<12 | 24>(24);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [jobsRes, tlRes] = await Promise.all([
      fetchApi<{ jobs: CronJob[] }>('/api/cron/jobs'),
      fetchApi<{ timeline: TimelineEntry[] }>('/api/cron/timeline'),
    ]);
    if (jobsRes) setJobs(jobsRes.jobs);
    if (tlRes) setTimeline(tlRes.timeline);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Auto-refresh every 60s
  useEffect(() => {
    const iv = setInterval(loadData, 60000);
    return () => clearInterval(iv);
  }, [loadData]);

  // Live clock every second
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const handleRefresh = () => { setRefreshing(true); loadData(); };

  const handleRunNow = async (jobId: string) => {
    setRunningJobId(jobId);
    await postApi(`/api/cron/jobs/${jobId}/run`);
    setTimeout(() => { setRunningJobId(null); loadData(); }, 2000);
  };

  const handleToggle = async (job: CronJob) => {
    await patchApi(`/api/cron/jobs/${job.id}`, { enabled: !job.enabled });
    loadData();
  };

  const toggleGroup = (id: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Computed values
  const failedJobs = jobs.filter(j => j.state.consecutiveErrors > 0);
  const nextFiring = jobs
    .filter(j => j.enabled && j.state.nextRunAtMs)
    .sort((a, b) => (a.state.nextRunAtMs || 0) - (b.state.nextRunAtMs || 0));
  const lastFailure = jobs
    .filter(j => j.state.lastStatus === 'error' || j.state.consecutiveErrors > 0)
    .sort((a, b) => (b.state.lastRunAtMs || 0) - (a.state.lastRunAtMs || 0))[0];
  const jobGroups = useMemo(() => categorizeJobs(jobs), [jobs]);

  if (loading) return <SchedulerSkeleton />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {jobs.length} cron jobs · Auto-refreshes every 60s
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

      {/* [A] Status Strip — 4 KPI cards */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Total Jobs"
          value={String(jobs.length)}
          icon={<Timer className="w-4 h-4 text-[#31D7DB]" />}
          sub={`${jobs.filter(j => j.enabled).length} enabled`}
        />
        <StatusCard
          title="System Status"
          value={failedJobs.length === 0 ? '✅ All OK' : `🔴 ${failedJobs.length} Failed`}
          icon={failedJobs.length === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
          sub={failedJobs.length === 0 ? 'No errors' : failedJobs.map(j => j.name).join(', ')}
          variant={failedJobs.length > 0 ? 'error' : 'success'}
        />
        <StatusCard
          title="Next Firing"
          value={nextFiring[0] ? nextFiring[0].name.replace(/_/g, ' ') : '—'}
          icon={<Zap className="w-4 h-4 text-[#107DAC]" />}
          sub={nextFiring[0]?.state.nextRunAtMs ? `in ${formatCountdown(nextFiring[0].state.nextRunAtMs - now)}` : '—'}
          variant="cyan"
        />
        <StatusCard
          title="Last Failure"
          value={lastFailure ? lastFailure.name.replace(/_/g, ' ') : 'None'}
          icon={lastFailure ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          sub={lastFailure?.state.lastRunAtMs ? formatRelativeTime(lastFailure.state.lastRunAtMs) : 'No recent failures'}
          variant={lastFailure ? 'error' : 'success'}
        />
      </div>

      {/* [B] Alert Banner */}
      {failedJobs.length > 0 && !alertDismissed && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <span className="text-red-600 font-semibold text-sm flex-1">
            🔴 {failedJobs.length} job{failedJobs.length > 1 ? 's' : ''} failed · {failedJobs[0].name} · {failedJobs[0].state.lastRunAtMs ? formatRelativeTime(failedJobs[0].state.lastRunAtMs) : ''}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-100 text-xs"
            onClick={() => setLogDrawerJobId(failedJobs[0].id)}
          >
            View Details ↓
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:bg-red-100 text-xs"
            onClick={() => setAlertDismissed(true)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* [C] Timeline */}
      <TimelineSection
        timeline={timeline}
        now={now}
        zoom={timelineZoom}
        onZoomChange={setTimelineZoom}
      />

      {/* [D] Next Firing Panel */}
      <div className="grid gap-3 md:grid-cols-3">
        {nextFiring.slice(0, 3).map(job => (
          <NextFiringCard
            key={job.id}
            job={job}
            now={now}
            onRunNow={() => handleRunNow(job.id)}
            running={runningJobId === job.id}
          />
        ))}
      </div>

      {/* [E] Jobs Table */}
      {jobGroups.map(group => (
        <Card key={group.id} className="border-[#023F59]/20">
          <CardHeader
            className="pb-2 cursor-pointer select-none"
            onClick={() => toggleGroup(group.id)}
          >
            <CardTitle className="text-sm font-semibold text-[#21262A] flex items-center gap-2">
              {collapsedGroups.has(group.id) ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{group.label}</span>
              <Badge className="bg-[#023F59]/10 text-[#023F59] border-0 text-xs ml-1">
                {group.jobs.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          {!collapsedGroups.has(group.id) && (
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#023F59]/10 text-xs text-muted-foreground">
                      <th className="text-left py-2 pr-3 font-medium w-8">Status</th>
                      <th className="text-left py-2 pr-3 font-medium">Job Name</th>
                      <th className="text-left py-2 pr-3 font-medium">Schedule</th>
                      <th className="text-left py-2 pr-3 font-medium">Last Run</th>
                      <th className="text-left py-2 pr-3 font-medium">Next Run</th>
                      <th className="text-left py-2 pr-3 font-medium">Target</th>
                      <th className="text-left py-2 pr-3 font-medium">Model</th>
                      <th className="text-right py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.jobs.map(job => (
                      <JobRow
                        key={job.id}
                        job={job}
                        now={now}
                        onRunNow={() => handleRunNow(job.id)}
                        onToggle={() => handleToggle(job)}
                        onViewLogs={() => setLogDrawerJobId(job.id)}
                        running={runningJobId === job.id}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {/* [F] Log Drawer */}
      {logDrawerJobId && (
        <LogDrawer
          jobId={logDrawerJobId}
          job={jobs.find(j => j.id === logDrawerJobId) || null}
          onClose={() => setLogDrawerJobId(null)}
          onRunNow={() => handleRunNow(logDrawerJobId)}
          running={runningJobId === logDrawerJobId}
        />
      )}
    </div>
  );
}

// ─── [A] Status Card ─────────────────────────────────────────

function StatusCard({ title, value, icon, sub, variant }: {
  title: string; value: string; icon: React.ReactNode; sub: string;
  variant?: 'success' | 'error' | 'cyan';
}) {
  return (
    <Card className={`border-[#023F59]/20 ${variant === 'error' ? 'border-red-200 bg-red-50/30' : ''}`}>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
          {icon}
        </div>
        <p className={`text-lg font-bold truncate ${
          variant === 'error' ? 'text-red-600' : variant === 'success' ? 'text-emerald-600' : variant === 'cyan' ? 'text-[#107DAC]' : 'text-[#21262A]'
        }`}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground truncate">{sub}</p>
      </CardContent>
    </Card>
  );
}

// ─── [C] Timeline ────────────────────────────────────────────

function TimelineSection({ timeline, now, zoom, onZoomChange }: {
  timeline: TimelineEntry[];
  now: number;
  zoom: 12 | 24;
  onZoomChange: (z: 12 | 24) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const halfWindow = (zoom / 2) * 60 * 60 * 1000;
  const startMs = now - halfWindow;
  const endMs = now + halfWindow;
  const totalMs = endMs - startMs;
  const filtered = timeline.filter(e => e.firedAtMs >= startMs && e.firedAtMs <= endMs);

  // Generate time labels every 2h
  const labels: { ms: number; label: string }[] = [];
  const firstLabel = new Date(startMs);
  firstLabel.setMinutes(0, 0, 0);
  let lMs = firstLabel.getTime();
  if (lMs < startMs) lMs += 2 * 3600000;
  // Round to nearest 2h
  const twoH = 2 * 3600000;
  lMs = Math.ceil(lMs / twoH) * twoH;
  while (lMs <= endMs) {
    const d = new Date(lMs);
    labels.push({ ms: lMs, label: `${d.getHours().toString().padStart(2, '0')}:00` });
    lMs += twoH;
  }

  const pct = (ms: number) => ((ms - startMs) / totalMs) * 100;

  // Scroll to NOW on mount
  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      const nowPos = el.scrollWidth * ((now - startMs) / totalMs);
      el.scrollLeft = nowPos - el.clientWidth / 2;
    }
  }, [now, startMs, totalMs]);

  function dotColor(status: string): string {
    if (status === 'ok') return 'bg-emerald-500';
    if (status === 'error') return 'bg-red-500';
    if (status === 'missed') return 'bg-amber-500';
    if (status === 'scheduled') return 'bg-blue-500';
    return 'bg-gray-300';
  }

  return (
    <Card className="border-[#023F59]/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-[#21262A]">24-Hour Timeline</CardTitle>
          <div className="flex gap-1">
            {([12, 24] as const).map(z => (
              <Button
                key={z}
                variant={zoom === z ? 'default' : 'outline'}
                size="sm"
                className={`h-6 px-2 text-xs ${zoom === z ? 'bg-[#023F59] text-white' : 'border-[#023F59]/20'}`}
                onClick={() => onZoomChange(z)}
              >
                {z}h
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div ref={containerRef} className="relative overflow-x-auto pb-2" style={{ minHeight: 80 }}>
          <div className="relative" style={{ minWidth: '600px', height: 60 }}>
            {/* Time labels */}
            {labels.map(l => (
              <div
                key={l.ms}
                className="absolute top-0 text-[10px] text-muted-foreground -translate-x-1/2"
                style={{ left: `${pct(l.ms)}%` }}
              >
                {l.label}
              </div>
            ))}

            {/* Baseline */}
            <div className="absolute top-5 left-0 right-0 h-px bg-[#023F59]/10" />

            {/* NOW line */}
            <div
              className="absolute top-3 w-0.5 bg-[#107DAC] z-10"
              style={{ left: `${pct(now)}%`, height: 40 }}
            >
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-[#107DAC] animate-pulse" />
            </div>

            {/* Dots */}
            {filtered.map((entry, i) => (
              <Tooltip key={`${entry.jobId}-${entry.firedAtMs}-${i}`}>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute top-4 w-2.5 h-2.5 rounded-full cursor-pointer -translate-x-1/2 transition-transform hover:scale-150 ${dotColor(entry.status)}`}
                    style={{ left: `${pct(entry.firedAtMs)}%` }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p className="font-semibold">{entry.jobName.replace(/_/g, ' ')}</p>
                  <p>{new Date(entry.firedAtMs).toLocaleTimeString()}</p>
                  <p className="capitalize">{entry.status}</p>
                </TooltipContent>
              </Tooltip>
            ))}

            {/* Legend */}
            <div className="absolute bottom-0 left-0 flex gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> OK</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Failed</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Scheduled</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Missed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── [D] Next Firing Card ────────────────────────────────────

function NextFiringCard({ job, now, onRunNow, running }: {
  job: CronJob; now: number; onRunNow: () => void; running: boolean;
}) {
  const countdown = (job.state.nextRunAtMs || 0) - now;
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      className="border-[#023F59]/20 hover:border-[#31D7DB]/50 transition-colors cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Next</span>
          <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px]">
            {job.scheduleDescription}
          </Badge>
        </div>
        <p className="font-semibold text-[#21262A] text-sm truncate">{job.name.replace(/_/g, ' ')}</p>
        <p className="text-2xl font-bold text-[#107DAC] mt-1">{formatCountdown(Math.max(0, countdown))}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>{job.sessionTarget}</span>
          {job.payload.model && <span>· {formatModelShort(job.payload.model)}</span>}
        </div>
        {hovered && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full border-[#023F59]/20 hover:bg-[#023F59] hover:text-white text-xs"
            onClick={onRunNow}
            disabled={running}
          >
            {running ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
            {running ? 'Running…' : '▶ Run Now'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ─── [E] Job Row ─────────────────────────────────────────────

function JobRow({ job, now, onRunNow, onToggle, onViewLogs, running }: {
  job: CronJob; now: number; onRunNow: () => void; onToggle: () => void; onViewLogs: () => void; running: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const statusPill = () => {
    if (!job.enabled) return <Badge className="bg-gray-100 text-gray-500 border-0 text-[10px]">Disabled</Badge>;
    if (job.state.consecutiveErrors > 0) return <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">Error</Badge>;
    if (job.state.lastStatus === 'ok') return <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">OK</Badge>;
    return <Badge className="bg-gray-100 text-gray-500 border-0 text-[10px]">—</Badge>;
  };

  return (
    <tr
      className="border-b border-[#023F59]/5 hover:bg-[#023F59]/[0.02] transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td className="py-2 pr-3">{statusPill()}</td>
      <td className="py-2 pr-3 font-medium text-[#21262A]">{job.name.replace(/_/g, ' ')}</td>
      <td className="py-2 pr-3 text-xs font-mono text-muted-foreground">{job.scheduleDescription}</td>
      <td className="py-2 pr-3 text-xs text-muted-foreground">
        {job.state.lastRunAtMs ? formatRelativeTime(job.state.lastRunAtMs) : '—'}
      </td>
      <td className="py-2 pr-3 text-xs text-[#107DAC] font-medium">
        {job.state.nextRunAtMs ? `in ${formatCountdown(Math.max(0, (job.state.nextRunAtMs || 0) - now))}` : '—'}
      </td>
      <td className="py-2 pr-3 text-xs text-muted-foreground">{job.sessionTarget}</td>
      <td className="py-2 pr-3 text-xs text-muted-foreground">{formatModelShort(job.payload.model)}</td>
      <td className="py-2 text-right">
        <div className={`flex items-center justify-end gap-1 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:text-[#31D7DB]"
                onClick={onRunNow}
                disabled={running}
              >
                {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Run Now</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:text-[#107DAC]"
                onClick={onViewLogs}
              >
                <FileText className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Logs</TooltipContent>
          </Tooltip>
          <Switch
            checked={job.enabled}
            onCheckedChange={onToggle}
            className="scale-75"
          />
        </div>
      </td>
    </tr>
  );
}

// ─── [F] Log Drawer ──────────────────────────────────────────

function LogDrawer({ jobId, job, onClose, onRunNow, running }: {
  jobId: string; job: CronJob | null; onClose: () => void; onRunNow: () => void; running: boolean;
}) {
  const [runs, setRuns] = useState<RunEntry[]>([]);
  const [loadingRuns, setLoadingRuns] = useState(true);
  const [expandedRun, setExpandedRun] = useState<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoadingRuns(true);
    fetchApi<{ entries: RunEntry[] }>(`/api/cron/jobs/${jobId}/runs?limit=20`)
      .then(res => { if (res) setRuns(res.entries || []); })
      .finally(() => setLoadingRuns(false));
  }, [jobId]);

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" />
      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 bottom-0 w-[420px] max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#023F59]/10">
          <div className="min-w-0">
            <p className="font-semibold text-[#21262A] truncate">{job?.name.replace(/_/g, ' ') || jobId}</p>
            <p className="text-xs text-muted-foreground">{job?.scheduleDescription}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Runs list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
          {loadingRuns ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-md" />)
          ) : runs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No run history found</p>
          ) : (
            runs.map((run, i) => (
              <div
                key={i}
                className="border border-[#023F59]/10 rounded-md p-3 cursor-pointer hover:bg-[#023F59]/[0.02]"
                onClick={() => setExpandedRun(expandedRun === i ? null : i)}
              >
                <div className="flex items-center gap-2">
                  {run.status === 'ok' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  )}
                  <span className="text-xs font-mono text-muted-foreground">
                    {new Date(run.ts || run.runAtMs || 0).toLocaleString()}
                  </span>
                  {run.durationMs && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDuration(run.durationMs)}
                    </span>
                  )}
                </div>
                {run.summary && (
                  <p className={`text-xs text-muted-foreground mt-1 ${expandedRun === i ? '' : 'line-clamp-2'}`}>
                    {run.summary}
                  </p>
                )}
                {run.model && expandedRun === i && (
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">{run.model}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#023F59]/10">
          <Button
            className="w-full bg-[#023F59] hover:bg-[#022F44] text-white"
            onClick={onRunNow}
            disabled={running}
          >
            {running ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Play className="w-3.5 h-3.5 mr-1.5" />}
            {running ? 'Running…' : '▶ Run Now'}
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── [G] Cron Summary Card (for Overview tab) ───────────────

export function CronSummaryCard({ onNavigateToScheduler }: { onNavigateToScheduler?: () => void }) {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchApi<{ jobs: CronJob[] }>('/api/cron/jobs')
      .then(res => { if (res) setJobs(res.jobs); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const failedJobs = jobs.filter(j => j.state.consecutiveErrors > 0);
  const nextFiring = jobs
    .filter(j => j.enabled && j.state.nextRunAtMs)
    .sort((a, b) => (a.state.nextRunAtMs || 0) - (b.state.nextRunAtMs || 0));
  const lastRun = jobs
    .filter(j => j.state.lastRunAtMs)
    .sort((a, b) => (b.state.lastRunAtMs || 0) - (a.state.lastRunAtMs || 0))[0];

  if (loading) return <Skeleton className="h-[180px] rounded-xl" />;

  return (
    <Card className={`border-[#023F59]/20 ${failedJobs.length > 0 ? 'border-red-300' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-[#21262A] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#31D7DB]" />
            Cron Scheduler
          </CardTitle>
          {onNavigateToScheduler && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[#107DAC] hover:text-[#023F59] h-6 px-2"
              onClick={onNavigateToScheduler}
            >
              View All →
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-[#21262A]">
          {jobs.length} jobs · {failedJobs.length === 0 ? (
            <span className="text-emerald-600">✅ All Systems OK</span>
          ) : (
            <span className="text-red-600">🔴 {failedJobs.length} Failed</span>
          )}
        </p>
        <div className="space-y-1">
          {nextFiring.slice(0, 3).map(job => (
            <p key={job.id} className="text-xs text-muted-foreground">
              <span className="text-[#107DAC] font-medium">Next:</span>{' '}
              {job.name.replace(/_/g, ' ')}{' '}
              <span className="text-[#107DAC]">
                in {formatCountdown(Math.max(0, (job.state.nextRunAtMs || 0) - now))}
              </span>
            </p>
          ))}
        </div>
        {lastRun && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Last:</span>{' '}
            {lastRun.name.replace(/_/g, ' ')} · {formatRelativeTime(lastRun.state.lastRunAtMs!)}{' '}
            {lastRun.state.lastStatus === 'ok' ? '✅' : '❌'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Skeleton ────────────────────────────────────────────────

function SchedulerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[90px] rounded-xl" />)}
      </div>
      <Skeleton className="h-[100px] rounded-xl" />
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[130px] rounded-xl" />)}
      </div>
      <Skeleton className="h-[300px] rounded-xl" />
    </div>
  );
}
