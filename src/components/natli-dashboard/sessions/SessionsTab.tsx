import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Activity, Cpu, Bot, MessageSquare, Clock, Zap } from 'lucide-react';
import { ModelIcon, getModelShortName } from '../../../lib/model-icons';
import { SessionDrawer } from './SessionDrawer';

// ─── Types ───────────────────────────────────────────────────

interface EnrichedSession {
  key: string;
  updatedAt: number;
  ageMs: number;
  sessionId: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number | null;
  model: string;
  modelProvider: string;
  contextTokens: number;
  agentId: string;
  kind: string;
  sessionType: string;
  label: string;
  isActive: boolean;
  isRecent: boolean;
}

interface SessionStats {
  total: number;
  active: number;
  recentHour: number;
  totalTokens: number;
  byModel: Record<string, number>;
  byType: Record<string, number>;
  byAgent: Record<string, { count: number; tokens: number }>;
  tokensByModel?: Record<string, number>;
  tokensByType?: Record<string, number>;
}

interface SessionsResponse {
  sessions: EnrichedSession[];
  stats: SessionStats;
}

// ─── Helpers ─────────────────────────────────────────────────

function formatTokens(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatRelativeTime(ageMs: number): string {
  if (ageMs < 30_000) return 'just now';
  if (ageMs < 60_000) return `${Math.floor(ageMs / 1000)}s ago`;
  if (ageMs < 3_600_000) return `${Math.floor(ageMs / 60_000)}m ago`;
  if (ageMs < 86_400_000) return `${Math.floor(ageMs / 3_600_000)}h ago`;
  return `${Math.floor(ageMs / 86_400_000)}d ago`;
}

const TYPE_LABELS: Record<string, string> = {
  'slack-channel': 'Slack Channel',
  'slack-dm': 'Slack DM',
  'subagent': 'Sub-agent',
  'cron': 'Cron',
  'main': 'Main',
  'other': 'Other',
};

const AGENT_ICONS: Record<string, typeof Bot> = {
  main: MessageSquare,
  coder: Cpu,
  designer: Zap,
  marketing: Activity,
  strategy: Clock,
};

type SortMode = 'sessions' | 'tokens';

// ─── Component ───────────────────────────────────────────────

export function SessionsTab() {
  const [data, setData] = useState<SessionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [modelSort, setModelSort] = useState<SortMode>('sessions');
  const [typeSort, setTypeSort] = useState<SortMode>('sessions');
  const [selectedSession, setSelectedSession] = useState<EnrichedSession | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/sessions');
      const json: SessionsResponse = await res.json();
      setData(json);
    } catch {
      // keep stale data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-[#023F59]/20 animate-pulse">
              <CardContent className="p-4"><div className="h-12 bg-gray-100 rounded" /></CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="border-[#023F59]/20 animate-pulse">
              <CardContent className="p-6"><div className="h-40 bg-gray-100 rounded" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-sm text-muted-foreground p-8 text-center">Failed to load sessions.</div>;

  const { sessions, stats } = data;
  const subagentCount = stats.byType['subagent'] || 0;

  // Model entries sorted by chosen mode
  const modelEntries = Object.entries(stats.byModel)
    .map(([model, count]) => ({
      model,
      label: getModelShortName(model),
      count,
      tokens: stats.tokensByModel?.[model] ?? 0,
    }))
    .sort((a, b) => modelSort === 'tokens' ? b.tokens - a.tokens : b.count - a.count);
  const maxModelValue = modelEntries[0]
    ? (modelSort === 'tokens' ? modelEntries[0].tokens : modelEntries[0].count)
    : 1;

  // Type entries sorted by chosen mode
  const typeEntries = Object.entries(stats.byType)
    .map(([type, count]) => ({
      type,
      label: TYPE_LABELS[type] || type,
      count,
      tokens: stats.tokensByType?.[type] ?? 0,
    }))
    .sort((a, b) => typeSort === 'tokens' ? b.tokens - a.tokens : b.count - a.count);
  const maxTypeValue = typeEntries[0]
    ? (typeSort === 'tokens' ? typeEntries[0].tokens : typeEntries[0].count)
    : 1;

  // Top 20 recent sessions
  const recentSessions = [...sessions]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 20);

  // Agent breakdown
  const agentEntries = Object.entries(stats.byAgent)
    .sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
        <span className="text-base font-semibold text-[#21262A]">Sessions Overview</span>
      </div>

      {/* [A] KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Sessions" value={String(stats.total)} icon={<MessageSquare className="w-4 h-4" />} description="all time" />
        <KPICard
          title="Active Now"
          value={String(stats.active)}
          dot={stats.active > 0 ? 'emerald' : undefined}
          valueColor={stats.active > 0 ? 'text-emerald-600' : undefined}
          icon={<Activity className="w-4 h-4" />}
          description="last 5 minutes"
        />
        <KPICard title="Tokens Used" value={formatTokens(stats.totalTokens)} valueColor="text-[#107DAC]" icon={<Zap className="w-4 h-4" />} description="total across all sessions" />
        <KPICard title="Sub-agents Run" value={String(subagentCount)} icon={<Bot className="w-4 h-4" />} description="spawned sessions" />
      </div>

      {/* [B] Two-column: Model Usage + Session Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#023F59]/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
                <CardTitle className="text-sm font-semibold text-[#21262A]">Model Usage</CardTitle>
              </div>
              <SortToggle value={modelSort} onChange={setModelSort} />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {modelEntries.map((entry) => (
              <div key={entry.model} className="flex items-center gap-3">
                <ModelIcon modelId={entry.model} size="xs" />
                <span className="text-xs text-[#21262A] w-24 shrink-0 truncate">{entry.label}</span>
                <div className="flex-1 h-5 bg-[#023F59]/5 rounded overflow-hidden">
                  <div
                    className="h-full bg-[#023F59] rounded transition-all"
                    style={{
                      width: `${Math.max(((modelSort === 'tokens' ? entry.tokens : entry.count) / maxModelValue) * 100, 2)}%`,
                      opacity: 0.6 + ((modelSort === 'tokens' ? entry.tokens : entry.count) / maxModelValue) * 0.4,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right tabular-nums">
                  {modelSort === 'tokens' ? formatTokens(entry.tokens) : entry.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#023F59]/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
                <CardTitle className="text-sm font-semibold text-[#21262A]">Session Types</CardTitle>
              </div>
              <SortToggle value={typeSort} onChange={setTypeSort} />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {typeEntries.map((entry) => {
              const val = typeSort === 'tokens' ? entry.tokens : entry.count;
              const pct = Math.max((val / maxTypeValue) * 100, 2);
              return (
                <div key={entry.type} className="flex items-center gap-3">
                  <span className="text-xs text-[#21262A] w-28 shrink-0 truncate">{entry.label}</span>
                  <div className="flex-1 h-5 bg-[#023F59]/5 rounded overflow-hidden">
                    <div
                      className="h-full bg-[#023F59] rounded transition-all"
                      style={{ width: `${pct}%`, opacity: 0.6 + (val / maxTypeValue) * 0.4 }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right tabular-nums">
                    {typeSort === 'tokens' ? formatTokens(entry.tokens) : entry.count}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* [C] Live Activity Feed */}
      <Card className="border-[#023F59]/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
            <CardTitle className="text-sm font-semibold text-[#21262A]">Live Activity Feed</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#023F59]/10 text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 w-10">Status</th>
                  <th className="px-4 py-2">Session</th>
                  <th className="px-4 py-2">Agent</th>
                  <th className="px-4 py-2">Model</th>
                  <th className="px-4 py-2 text-right">Tokens</th>
                  <th className="px-4 py-2 text-right">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((s) => (
                  <tr key={s.key} className="border-b border-[#023F59]/5 hover:bg-[#F0F7FF] transition-colors cursor-pointer" onClick={() => setSelectedSession(s)}>
                    <td className="px-4 py-2">
                      <StatusDot isActive={s.isActive} isRecent={s.isRecent} />
                    </td>
                    <td className="px-4 py-2 font-medium text-[#21262A] max-w-[240px] truncate">{s.label}</td>
                    <td className="px-4 py-2">
                      <AgentBadge agent={s.agentId} />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1.5">
                        <ModelIcon modelId={s.model} size="xs" />
                        <span className="text-muted-foreground">{getModelShortName(s.model)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
                      {formatTokens(Number(s.totalTokens || 0))}
                    </td>
                    <td className="px-4 py-2 text-right text-muted-foreground">{formatRelativeTime(s.ageMs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* [D] Agent Breakdown */}
      <Card className="border-[#023F59]/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
            <CardTitle className="text-sm font-semibold text-[#21262A]">Agent Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {agentEntries.map(([agent, info]) => {
            const Icon = AGENT_ICONS[agent] || Bot;
            return (
              <div key={agent} className="flex items-center justify-between py-1.5 border-b border-[#023F59]/5 last:border-0">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#023F59]" />
                  <span className="font-medium text-[#21262A] capitalize">{agent}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{info.count} sessions</span>
                  <span className="tabular-nums">{formatTokens(info.tokens)} tokens</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Session Drill-down Drawer */}
      <SessionDrawer session={selectedSession} onClose={() => setSelectedSession(null)} />
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function SortToggle({ value, onChange }: { value: SortMode; onChange: (v: SortMode) => void }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-muted-foreground mr-1">Sort:</span>
      {(['sessions', 'tokens'] as const).map(mode => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
            value === mode
              ? 'bg-[#023F59] text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {mode === 'sessions' ? 'Sessions' : 'Tokens'}
        </button>
      ))}
    </div>
  );
}

function KPICard({ title, value, dot, valueColor, icon, description }: {
  title: string; value: string; dot?: 'emerald'; valueColor?: string;
  icon?: React.ReactNode; description?: string;
}) {
  return (
    <Card className="border-[#023F59]/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-[#21262A]">{title}</CardTitle>
        {icon && <span className="text-[#31D7DB]">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor || 'text-[#107DAC]'} flex items-center gap-2`}>
          {dot === 'emerald' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
          {value}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </CardContent>
    </Card>
  );
}

function StatusDot({ isActive, isRecent }: { isActive: boolean; isRecent: boolean }) {
  if (isActive) return <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" title="Active" />;
  if (isRecent) return <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" title="Recent" />;
  return <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300" title="Idle" />;
}

function AgentBadge({ agent }: { agent: string }) {
  const colors: Record<string, string> = {
    main: 'bg-[#023F59] text-white',
    coder: 'bg-[#107DAC]/15 text-[#107DAC]',
    designer: 'bg-[#31D7DB]/15 text-[#023F59]',
    marketing: 'bg-[#107DAC]/10 text-[#023F59]',
    strategy: 'bg-[#31D7DB]/20 text-[#023F59]',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${colors[agent] || 'bg-gray-100 text-gray-700'}`}>
      {agent}
    </span>
  );
}

export default SessionsTab;
