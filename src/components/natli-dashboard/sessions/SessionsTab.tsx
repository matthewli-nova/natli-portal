import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Activity, Cpu, Bot, MessageSquare, Clock, Zap } from 'lucide-react';

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

function modelShortName(model: string): string {
  // "claude-sonnet-4-6" → "Sonnet 4.6", "gemini-3-pro" → "Gemini 3 Pro"
  let name = model.replace(/^claude-/, '');
  // Convert dashes to dots for version: "sonnet-4-6" → "sonnet 4.6"
  const parts = name.split('-');
  const words: string[] = [];
  let i = 0;
  while (i < parts.length) {
    if (/^\d+$/.test(parts[i]) && i + 1 < parts.length && /^\d+$/.test(parts[i + 1])) {
      words.push(`${parts[i]}.${parts[i + 1]}`);
      i += 2;
    } else {
      words.push(parts[i].charAt(0).toUpperCase() + parts[i].slice(1));
      i++;
    }
  }
  return words.join(' ');
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

// ─── Component ───────────────────────────────────────────────

export function SessionsTab() {
  const [data, setData] = useState<SessionsResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Sort models and types by count desc
  const modelEntries = Object.entries(stats.byModel)
    .map(([model, count]) => ({ label: modelShortName(model), count }))
    .sort((a, b) => b.count - a.count);
  const maxModelCount = modelEntries[0]?.count || 1;

  const typeEntries = Object.entries(stats.byType)
    .map(([type, count]) => ({ label: TYPE_LABELS[type] || type, count }))
    .sort((a, b) => b.count - a.count);
  const maxTypeCount = typeEntries[0]?.count || 1;

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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#21262A]">Sessions Overview</h3>
      </div>

      {/* [A] KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Sessions" value={String(stats.total)} />
        <KPICard
          title="Active Now"
          value={String(stats.active)}
          dot={stats.active > 0 ? 'emerald' : undefined}
          valueColor={stats.active > 0 ? 'text-emerald-600' : undefined}
        />
        <KPICard title="Tokens Used" value={formatTokens(stats.totalTokens)} valueColor="text-[#107DAC]" />
        <KPICard title="Sub-agents Run" value={String(subagentCount)} />
      </div>

      {/* [B] Two-column: Model Usage + Session Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#023F59]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#21262A]">Model Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {modelEntries.map((entry) => (
              <BarRow key={entry.label} label={entry.label} count={entry.count} max={maxModelCount} />
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#023F59]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#21262A]">Session Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {typeEntries.map((entry) => (
              <BarRow key={entry.label} label={entry.label} count={entry.count} max={maxTypeCount} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* [C] Live Activity Feed */}
      <Card className="border-[#023F59]/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#21262A]">Live Activity Feed</CardTitle>
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
                  <tr key={s.key} className="border-b border-[#023F59]/5 hover:bg-[#023F59]/[0.02] transition-colors">
                    <td className="px-4 py-2">
                      <StatusDot isActive={s.isActive} isRecent={s.isRecent} />
                    </td>
                    <td className="px-4 py-2 font-medium text-[#21262A] max-w-[240px] truncate">{s.label}</td>
                    <td className="px-4 py-2">
                      <AgentBadge agent={s.agentId} />
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{modelShortName(s.model)}</td>
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
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#21262A]">Agent Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {agentEntries.map(([agent, info]) => {
            const Icon = AGENT_ICONS[agent] || Bot;
            return (
              <div key={agent} className="flex items-center justify-between">
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
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function KPICard({ title, value, dot, valueColor }: {
  title: string; value: string; dot?: 'emerald'; valueColor?: string;
}) {
  return (
    <Card className="border-[#023F59]/20">
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1">{title}</div>
        <div className={`text-2xl font-bold ${valueColor || 'text-[#21262A]'} flex items-center gap-2`}>
          {dot === 'emerald' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = Math.max((count / max) * 100, 2);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#21262A] w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-5 bg-[#023F59]/5 rounded overflow-hidden">
        <div
          className="h-full bg-[#023F59] rounded transition-all"
          style={{ width: `${pct}%`, opacity: 0.6 + (count / max) * 0.4 }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">{count}</span>
    </div>
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
    marketing: 'bg-orange-100 text-orange-800',
    strategy: 'bg-teal-100 text-teal-800',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${colors[agent] || 'bg-gray-100 text-gray-700'}`}>
      {agent}
    </span>
  );
}

export default SessionsTab;
