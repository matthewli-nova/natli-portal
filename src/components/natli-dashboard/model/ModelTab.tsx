import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';
import { Button } from '../../ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { ModelIcon, getModelShortName, getModelBrandColor } from '../../../lib/model-icons';
import { ModelIntelligencePage } from './ModelIntelligencePage';

// ─── Types ───────────────────────────────────────────────────

interface AvailableModel {
  id: string;
  alias: string;
  label: string;
  provider: string;
  subProvider: string;
  isPrimary: boolean;
  isFallback: boolean;
  fallbackOrder?: number;
  pricing: { input: number; output: number; free: boolean };
  contextTokens: number;
}

interface ByModelEntry {
  modelId: string;
  label: string;
  provider: string;
  sessions: number;
  tokens: number;
  pct: number;
  costEstimate: number;
}

interface TopSession {
  label: string;
  model: string;
  tokens: number;
  costEstimate: number;
  ageMs: number;
  sessionType: string;
}

interface ModelStats {
  config: { primary: string; fallbacks: string[] };
  availableModels: AvailableModel[];
  tokenStats: {
    total: number;
    totalCostEstimate: number;
    byModel: ByModelEntry[];
  };
  topSessions: TopSession[];
}

interface HistoryDay {
  date: string;
  total: number;
  byModel: Record<string, number>;
}

// ─── Helpers ─────────────────────────────────────────────────

// ─── Model "added to system" dates ───────────────────────────
// Date when each model was configured in openclaw.json
// Update this table whenever a new model is added

const MODEL_ADDED_DATES: Record<string, string> = {
  // Anthropic (configured at system setup, Jan 2026)
  'claude-opus-4-6':              '2026-01',
  'claude-sonnet-4-6':            '2026-01',
  'claude-haiku-4-5':             '2026-01',
  'claude-opus-4-5':              '2026-01',
  'claude-sonnet-4-5':            '2026-01',
  // Kimi / Moonshot (added Feb 2026 to replace Perplexity)
  'kimi-latest':                  '2026-02',
  'kimi-k2-thinking-turbo':       '2026-02',
  // OpenRouter models (added Feb 2026)
  'gemini-2.5-pro':               '2026-02',
  'gemini-2.5-flash':             '2026-02',
  'gemini-3-pro-preview':         '2026-02',
  'deepseek-r1':                  '2026-02',
  'deepseek-chat-v3':             '2026-02',
  'grok-3':                       '2026-02',
  'grok-4':                       '2026-02',
  'llama-3.1-405b':               '2026-02',
  'llama-3.3-70b':                '2026-02',
  'gemma-3-27b':                  '2026-02',
  'qwen3-coder':                  '2026-02',
  'minimax-m2.5':                 '2026-02',
  'minimax-m1':                   '2026-02',
  'nova-pro':                     '2026-02',
  'mistral':                      '2026-02',
};

function getModelAddedDate(modelId: string): string | null {
  const id = modelId.toLowerCase();
  for (const [key, date] of Object.entries(MODEL_ADDED_DATES)) {
    if (id.includes(key.toLowerCase())) return date;
  }
  return null;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatCost(n: number): string {
  return `~$${n.toFixed(2)}`;
}

function formatAge(ms: number): string {
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatCtx(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M ctx`;
  return `${(n / 1_000).toFixed(0)}K ctx`;
}

function providerLabel(provider: string, subProvider?: string): string {
  if (provider === 'anthropic') return 'Anthropic';
  if (provider === 'moonshot') return 'Moonshot';
  if (subProvider) {
    const labels: Record<string, string> = {
      'google': 'Google', 'x-ai': 'xAI', 'deepseek': 'DeepSeek',
      'meta-llama': 'Meta', 'qwen': 'Qwen', 'minimax': 'MiniMax',
    };
    return labels[subProvider] || subProvider;
  }
  return 'OpenRouter';
}

function providerPillClasses(provider: string, subProvider?: string): string {
  if (provider === 'anthropic') return 'bg-primary text-white';
  if (provider === 'moonshot') return 'bg-amber-500 text-white';
  if (subProvider === 'x-ai') return 'bg-purple-500 text-white';
  if (subProvider === 'deepseek') return 'bg-rose-500 text-white';
  if (subProvider === 'minimax') return 'bg-orange-400 text-white';
  if (subProvider === 'meta-llama' || subProvider === 'qwen') return 'bg-emerald-500 text-white';
  return 'bg-secondary text-[#023F59]';
}

function getProviderBorderClass(provider: string, subProvider?: string): string {
  if (provider === 'anthropic') return 'border-l-[#023F59]';
  if (provider === 'moonshot') return 'border-l-amber-500';
  if (subProvider === 'x-ai') return 'border-l-purple-500';
  if (subProvider === 'deepseek') return 'border-l-rose-500';
  if (subProvider === 'minimax') return 'border-l-orange-400';
  if (subProvider === 'meta-llama' || subProvider === 'qwen') return 'border-l-emerald-500';
  if (subProvider === 'google') return 'border-l-[#31D7DB]';
  return 'border-l-[#31D7DB]';
}

// ─── Component ───────────────────────────────────────────────

// ─── Running Config Types ────────────────────────────────────

interface ResolvedModel { id: string; label: string; alias: string; }
interface ChannelOverride {
  channelId: string;
  channelName: string;
  model: ResolvedModel;
  fallbacks: ResolvedModel[];
  note: string;
}
interface RunningConfig {
  default: { model: ResolvedModel; fallbacks: ResolvedModel[] };
  channelOverrides: ChannelOverride[];
}

// ─── Currently Running Tab ───────────────────────────────────

// Single model card (matches dashboard card style)
function RunningModelCard({
  slot, model, accent,
}: {
  slot: string;
  model: ResolvedModel;
  accent: { bg: string; text: string; badge: string };
}) {
  return (
    <Card className="border-primary/25 shadow-sm">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ModelIcon modelId={model.id} size="sm" />
            <span className="text-sm font-semibold text-foreground">{slot}</span>
          </div>
          <Badge className={`text-[10px] font-bold px-2 py-0.5 border-0 ${accent.badge}`}>
            {slot === 'Primary' ? 'Active' : 'Standby'}
          </Badge>
        </div>
        <p className={`text-lg font-bold leading-tight ${accent.text}`}>{model.label}</p>
        {model.alias && (
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">alias: {model.alias}</p>
        )}
        <p className="text-[10px] text-muted-foreground mt-1 font-mono truncate">{model.id}</p>
      </CardContent>
    </Card>
  );
}

// Channel row: primary + 2 fallbacks in 3-col grid
function ChannelCard({ ch }: { ch: ChannelOverride }) {
  const allModels = [
    { slot: 'Primary', model: ch.model, accent: { bg: 'bg-emerald-50', text: 'text-lepos-cyan-text', badge: 'bg-emerald-100 text-emerald-700' } },
    ...ch.fallbacks.map((fb, i) => ({
      slot: `Fallback ${i + 1}`,
      model: fb,
      accent: { bg: 'bg-blue-50', text: 'text-[#023F59]', badge: 'bg-blue-100 text-blue-700' },
    })),
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">{ch.channelName}</span>
        <span className="text-[10px] text-muted-foreground bg-primary/5 border border-primary/10 rounded px-2 py-0.5">{ch.note}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {allModels.map(({ slot, model, accent }) => (
          <RunningModelCard key={slot} slot={slot} model={model} accent={accent} />
        ))}
      </div>
    </div>
  );
}

function CurrentlyRunningTab({ config, loading }: { config: RunningConfig | null; loading: boolean }) {

  if (loading) return <div className="text-muted-foreground text-sm p-8 text-center">Loading…</div>;
  if (!config) return <div className="text-muted-foreground text-sm p-8 text-center">Failed to load config</div>;

  const defaultModels = [
    { slot: 'Primary',    model: config.default.model,       accent: { bg: 'bg-emerald-50', text: 'text-lepos-cyan-text', badge: 'bg-emerald-100 text-emerald-700' } },
    { slot: 'Fallback 1', model: config.default.fallbacks[0], accent: { bg: 'bg-blue-50',   text: 'text-[#023F59]', badge: 'bg-blue-100 text-blue-700' } },
    { slot: 'Fallback 2', model: config.default.fallbacks[1], accent: { bg: 'bg-blue-50',   text: 'text-[#023F59]', badge: 'bg-blue-100 text-blue-700' } },
  ].filter(m => m.model?.id);

  return (
    <div className="space-y-8">
      {/* ── Default Chain ─────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
          <span className="text-base font-bold text-foreground">🖥️ Main (Default)</span>
          <span className="text-sm text-muted-foreground">· applies to all unlisted channels</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {defaultModels.map(({ slot, model, accent }) => (
            <RunningModelCard key={slot} slot={slot} model={model} accent={accent} />
          ))}
        </div>
      </div>

      {/* ── Channel Overrides ─────────────────────────── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
          <span className="text-base font-bold text-foreground">💬 Channel & DM Models</span>
        </div>
        {config.channelOverrides.map((ch) => (
          <ChannelCard key={ch.channelId} ch={ch} />
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground border-t border-primary/10 pt-2">
        Fallbacks are shared from the default chain. Channel overrides apply when a channel has a specific model configured.
      </p>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────

export function ModelTab({ mode }: { mode?: 'dashboard' | 'full' } = {}) {
  const [view, setView] = useState<'usage' | 'intelligence' | 'running'>('usage');
  const [stats, setStats] = useState<ModelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryDay[]>([]);
  const [historyPeriod, setHistoryPeriod] = useState(7);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [runningConfig, setRunningConfig] = useState<RunningConfig | null>(null);
  const [runningLoading, setRunningLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/model/stats');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch model stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (days: number) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/model/history?days=${days}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.days || []);
      }
    } catch { /* ignore */ }
    setHistoryLoading(false);
  }, []);

  const fetchRunningConfig = useCallback(async () => {
    setRunningLoading(true);
    try {
      const res = await fetch('/api/config/running');
      if (res.ok) setRunningConfig(await res.json());
    } catch { /* ignore */ }
    setRunningLoading(false);
  }, []);

  // Pre-fetch running config when switching to that tab
  useEffect(() => {
    if (view === 'running' && !runningConfig) fetchRunningConfig();
  }, [view, runningConfig, fetchRunningConfig]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (view === 'usage') {
      await Promise.all([fetchStats(), fetchHistory(historyPeriod)]);
    } else if (view === 'running') {
      await fetchRunningConfig();
    } else if (view === 'intelligence') {
      await new Promise(r => setTimeout(r, 400));
    }
    setLastRefreshed(new Date());
    setRefreshing(false);
  }, [view, fetchStats, fetchHistory, historyPeriod, fetchRunningConfig]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  useEffect(() => {
    fetchHistory(historyPeriod);
  }, [historyPeriod, fetchHistory]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={fetchStats} />;
  if (!stats) return null;

  const { config, availableModels, tokenStats, topSessions } = stats;
  const totalSessions = tokenStats.byModel.reduce((s, m) => s + m.sessions, 0);
  const avgPerSession = totalSessions > 0 ? tokenStats.total / totalSessions : 0;

  const primaryModel = availableModels.find(m => m.isPrimary);
  const fallbackModels = availableModels
    .filter(m => m.isFallback)
    .sort((a, b) => (a.fallbackOrder ?? 99) - (b.fallbackOrder ?? 99));

  const usageLookup = new Map<string, ByModelEntry>();
  for (const bm of tokenStats.byModel) usageLookup.set(bm.modelId, bm);

  return (
    <div className="space-y-6">
      {/* View Switcher + Refresh — full/sidebar mode only */}
      {mode !== 'dashboard' && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1 p-1 bg-primary/5 rounded-lg">
            {([
              { id: 'usage',        label: '📋 Available Models' },
              { id: 'intelligence', label: '🧠 Intelligence' },
              { id: 'running',      label: '▶️ Currently Running' },
            ] as const).map(v => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === v.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-[#023F59] hover:bg-primary/10'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {lastRefreshed && !refreshing && (
              <span className="text-[10px] text-muted-foreground">
                Updated {lastRefreshed.toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-1.5 border-primary/25 text-[#023F59] hover:bg-primary/5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>
        </div>
      )}

      {mode !== 'dashboard' && view === 'intelligence' && <ModelIntelligencePage />}
      {mode !== 'dashboard' && view === 'running' && <CurrentlyRunningTab config={runningConfig} loading={runningLoading || refreshing} />}

      {(mode === 'dashboard' || view === 'usage') && view !== 'intelligence' && view !== 'running' && <>
      {/* ── Dashboard-only sections: Config + Stats + Charts ── */}
      {mode === 'dashboard' && <>

      {/* [A] Active Config Strip */}
      <div className="grid gap-4 md:grid-cols-3">
        <ConfigCard title="PRIMARY" model={primaryModel} />
        {[0, 1].map(i => (
          <ConfigCard key={i} title={`FALLBACK ${i + 1}`} model={fallbackModels[i]} />
        ))}
      </div>

      {/* [B] Token KPI Strip */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <KPICard title="Total Tokens" value={formatTokens(tokenStats.total)} />
        <KPICard title="Total Sessions" value={String(totalSessions)} />
        <KPICard
          title="Est. Cost"
          value={formatCost(tokenStats.totalCostEstimate)}
          subtitle="Estimated · blended 80/20 rate"
        />
        <KPICard title="Avg / Session" value={formatTokens(Math.round(avgPerSession))} />
      </div>

      {/* [B2] Today Overview — Grafana-style */}
      {history.length > 0 && (() => {
        const today = history[history.length - 1];
        const totalToday = today.total;
        const models = Object.entries(today.byModel).sort((a, b) => b[1] - a[1]);
        const topModel = models[0];
        const activeModels = models.length;
        const todayCostEst = models.reduce((sum, [mid, toks]) => {
          const m = availableModels.find(a => a.id === mid || mid.includes(a.id.split('/').pop() || ''));
          const price = m ? (m.pricing.input * 0.8 + m.pricing.output * 0.2) / 1_000_000 : 0.003 / 1_000_000;
          return sum + toks * price;
        }, 0);
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
              <span className="text-base font-semibold text-foreground">Overview (Today — {today.date})</span>
            </div>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <GrafanaKPI label="Tokens Today" value={formatTokens(totalToday)} color="#31D7DB" sparkData={history.slice(-7).map(d => d.total)} />
              <GrafanaKPI label="Est. Cost Today" value={`~$${todayCostEst.toFixed(3)}`} color="#107DAC" sparkData={history.slice(-7).map(d => {
                return Object.entries(d.byModel).reduce((s,[mid,t]) => {
                  const m2 = availableModels.find(a => a.id === mid || mid.includes(a.id.split('/').pop() || ''));
                  const p2 = m2 ? (m2.pricing.input * 0.8 + m2.pricing.output * 0.2) / 1_000_000 : 0.003 / 1_000_000;
                  return s + t * p2;
                }, 0);
              })} />
              <GrafanaKPI label="Top Model" value={topModel ? getModelShortName(topModel[0]) : '—'} sub={topModel ? formatTokens(topModel[1]) : ''} color="#023F59" />
              <GrafanaKPI label="Active Models" value={String(activeModels)} sub={`of ${availableModels.length} configured`} color="#107DAC" />
            </div>
          </div>
        );
      })()}

      {/* [B3] Historical Token Consumption */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
          <span className="text-base font-semibold text-foreground">Token Consumption History</span>
        </div>
        <Card className="border-primary/25 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">Daily Token Usage</CardTitle>
              <div className="flex gap-1">
                {[1, 7, 30, 90, 180, 365].map(d => (
                  <button
                    key={d}
                    onClick={() => setHistoryPeriod(d)}
                    className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                      historyPeriod === d
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {d === 1 ? '1D' : `${d}D`}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="h-[140px] flex items-center justify-center text-sm text-muted-foreground">Loading…</div>
            ) : history.length === 0 ? (
              <div className="h-[140px] flex items-center justify-center text-sm text-muted-foreground">
                No historical data available for this period
              </div>
            ) : (
              <MultiSeriesTokenChart days={history} period={historyPeriod} availableModels={availableModels} />
            )}
            <p className="text-[10px] text-muted-foreground mt-2">
              ⚠ Token counts reflect session lifetime totals attributed to last-active date, not daily consumption
            </p>
          </CardContent>
        </Card>
      </div>

      {/* [C] Token Spend by Model */}
      <Card className="border-primary/25 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">Token Spend by Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tokenStats.byModel.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No token usage data</p>
          ) : (
            tokenStats.byModel.map((entry) => {
              const model = availableModels.find(m => m.id === entry.modelId);
              const color = getModelBrandColor(entry.modelId);
              return (
                <div key={entry.modelId} className="flex items-center gap-3 text-sm py-1.5 border-b border-primary/5 last:border-0">
                  <ModelIcon modelId={entry.modelId} size="xs" />
                  <div className="w-32 shrink-0 truncate font-medium text-foreground">
                    {entry.label}
                  </div>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(entry.pct, 1)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <div className="w-16 text-right text-foreground font-medium shrink-0">
                    {formatTokens(entry.tokens)}
                  </div>
                  <div className="w-14 text-right text-muted-foreground shrink-0">
                    {entry.pct.toFixed(1)}%
                  </div>
                  <div className="w-20 text-right text-muted-foreground shrink-0">
                    {formatCost(entry.costEstimate)}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      </>}{/* end dashboard-only */}

      {/* [D] Available Models Grid — shown in full/sidebar mode only */}
      {mode !== 'dashboard' && (<div className="space-y-3">
        <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3">
          <span className="text-base font-semibold text-foreground">Available Models</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {availableModels.map((model) => {
            const usage = usageLookup.get(model.id);
            const borderClass = getProviderBorderClass(model.provider, model.subProvider);
            return (
              <Card key={model.id} className={`border-primary/20 border-l-4 ${borderClass}`}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ModelIcon modelId={model.id} size="sm" />
                      <span className="font-semibold text-foreground text-sm">{model.label}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 shrink-0 ${providerPillClasses(model.provider, model.subProvider)}`}
                    >
                      {providerLabel(model.provider, model.subProvider)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {model.isPrimary && (
                      <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0">
                        ✅ PRIMARY
                      </Badge>
                    )}
                    {model.isFallback && (
                      <Badge variant="secondary" className="text-[10px] bg-[#107DAC]/15 text-lepos-cyan-text px-1.5 py-0">
                        🔄 FALLBACK {model.fallbackOrder}
                      </Badge>
                    )}
                    {model.pricing.free && (
                      <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0">
                        FREE
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                    {model.alias && (
                      <div><span className="font-mono bg-gray-100 px-1 rounded text-[11px]">alias: {model.alias}</span></div>
                    )}
                    <div>{formatCtx(model.contextTokens)}</div>
                    <div>
                      {model.pricing.free
                        ? 'Free'
                        : `$${model.pricing.input.toFixed(2)} / $${model.pricing.output.toFixed(2)} per 1M`}
                    </div>
                    {(() => {
                      const added = getModelAddedDate(model.id);
                      if (!added) return null;
                      return (
                        <div className="pt-0.5 border-t border-primary/5">
                          <span>Added: <span className="text-foreground font-medium">{added}</span></span>
                        </div>
                      );
                    })()}
                    {usage && (
                      <div className="text-lepos-cyan-text font-medium">
                        {usage.sessions} sessions · {formatTokens(usage.tokens)} tokens
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>)}

      {/* [E] Top Token Consumers — dashboard only */}
      {mode === 'dashboard' && <Card className="border-primary/25 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">Top Token Consumers</CardTitle>
        </CardHeader>
        <CardContent>
          {topSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No session data</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary/10 text-left text-muted-foreground text-xs">
                    <th className="pb-2 pr-3 font-medium">Session</th>
                    <th className="pb-2 pr-3 font-medium">Type</th>
                    <th className="pb-2 pr-3 font-medium">Model</th>
                    <th className="pb-2 pr-3 font-medium text-right">Tokens</th>
                    <th className="pb-2 pr-3 font-medium text-right">Est. Cost</th>
                    <th className="pb-2 font-medium text-right">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {topSessions.map((session, i) => (
                    <tr key={i} className="border-b border-primary/5 last:border-0">
                      <td className="py-2 pr-3 text-foreground font-medium max-w-[200px] truncate">
                        {session.label}
                      </td>
                      <td className="py-2 pr-3">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/20">
                          {session.sessionType}
                        </Badge>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-1.5">
                          <ModelIcon modelId={session.model} size="xs" />
                          <span className="text-muted-foreground truncate max-w-[120px]">{getModelShortName(session.model)}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-right font-medium text-lepos-cyan-text">
                        {formatTokens(session.tokens)}
                      </td>
                      <td className="py-2 pr-3 text-right text-muted-foreground">
                        {formatCost(session.costEstimate)}
                      </td>
                      <td className="py-2 text-right text-muted-foreground">
                        {formatAge(session.ageMs)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>}
      </>}
    </div>
  );
}

// ─── Grafana-style KPI Card ───────────────────────────────────

function GrafanaKPI({
  label, value, color, sub, sparkData,
}: {
  label: string; value: string; color: string; sub?: string; sparkData?: number[];
}) {
  const W = 120; const H = 32;
  let sparkPath = '';
  if (sparkData && sparkData.length > 1) {
    const max = Math.max(...sparkData, 1);
    const pts = sparkData.map((v, i) => {
      const x = (i / (sparkData.length - 1)) * W;
      const y = H - (v / max) * H * 0.85 - 2;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    });
    sparkPath = pts.join(' ');
  }
  return (
    <div className="rounded-xl border border-primary/15 bg-white p-3 space-y-1 overflow-hidden relative">
      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      {sparkPath && (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute bottom-0 right-0 opacity-20"
          style={{ width: 80, height: H }}
          preserveAspectRatio="none"
        >
          <path d={sparkPath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

// ─── Multi-Series Token Chart ─────────────────────────────────

const MODEL_LINE_COLORS = [
  '#31D7DB', '#107DAC', '#F59E0B', '#10B981', '#8B5CF6',
  '#EF4444', '#3B82F6', '#F97316', '#EC4899', '#6366F1',
];

function MultiSeriesTokenChart({
  days, period, availableModels,
}: {
  days: HistoryDay[];
  period: number;
  availableModels: AvailableModel[];
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [hiddenModels, setHiddenModels] = useState<Set<string>>(new Set());

  // Collect top models by total usage
  const modelTotals: Record<string, number> = {};
  for (const d of days) {
    for (const [mid, toks] of Object.entries(d.byModel)) {
      modelTotals[mid] = (modelTotals[mid] || 0) + toks;
    }
  }
  const topModels = Object.entries(modelTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([mid]) => mid);

  const W = 800; const H = 140;
  const pad = { t: 8, r: 8, b: 4, l: 4 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;

  const maxVal = Math.max(...days.map(d => d.total), 1);
  const labelEvery = period <= 7 ? 1 : period <= 30 ? 3 : period <= 90 ? 7 : 14;

  function xOf(i: number) {
    return pad.l + (days.length === 1 ? plotW / 2 : (i / (days.length - 1)) * plotW);
  }
  function yOf(val: number) {
    return pad.t + plotH - (val / maxVal) * plotH;
  }

  // Total line points for hover
  const totalPts = days.map((d, i) => ({ x: xOf(i), y: yOf(d.total), day: d }));

  return (
    <div>
      {/* Chart */}
      <div className="flex gap-1">
        <div className="flex flex-col justify-between shrink-0 py-[8px]" style={{ width: 40, height: H }}>
          {[maxVal, maxVal / 2, 0].map((v, i) => (
            <span key={i} className="text-[9px] text-muted-foreground text-right leading-none block">
              {formatTokens(Math.round(v))}
            </span>
          ))}
        </div>
        <div className="flex-1 relative" style={{ height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: H, display: 'block' }}>
            <defs>
              {topModels.map((mid, ci) => (
                <linearGradient key={mid} id={`grad-${ci}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={MODEL_LINE_COLORS[ci % MODEL_LINE_COLORS.length]} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={MODEL_LINE_COLORS[ci % MODEL_LINE_COLORS.length]} stopOpacity="0.01" />
                </linearGradient>
              ))}
            </defs>
            {/* Grid lines */}
            {[0, 0.5, 1].map(frac => (
              <line key={frac} x1={pad.l} y1={pad.t + plotH * (1 - frac)} x2={W - pad.r} y2={pad.t + plotH * (1 - frac)}
                stroke="#023F59" strokeOpacity="0.07" strokeWidth="1" />
            ))}
            {/* Model lines */}
            {topModels.map((mid, ci) => {
              if (hiddenModels.has(mid)) return null;
              const color = MODEL_LINE_COLORS[ci % MODEL_LINE_COLORS.length];
              const pts = days.map((d, i) => ({ x: xOf(i), y: yOf(d.byModel[mid] || 0) }));
              const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
              const area = `${line} L${pts[pts.length-1].x.toFixed(1)},${(pad.t+plotH).toFixed(1)} L${pts[0].x.toFixed(1)},${(pad.t+plotH).toFixed(1)} Z`;
              return (
                <g key={mid}>
                  <path d={area} fill={`url(#grad-${ci})`} />
                  <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                </g>
              );
            })}
            {/* Hover targets on total line */}
            {totalPts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="12" fill="transparent"
                onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}
                style={{ cursor: 'crosshair' }} />
            ))}
            {/* Hover dot */}
            {hoverIdx !== null && (
              <circle cx={totalPts[hoverIdx].x} cy={totalPts[hoverIdx].y} r={4}
                fill="#31D7DB" stroke="white" strokeWidth="1.5" style={{ pointerEvents: 'none' }} />
            )}
          </svg>
          {/* Hover tooltip */}
          {hoverIdx !== null && (() => {
            const p = totalPts[hoverIdx];
            const d = p.day;
            const leftPct = (p.x / W) * 100;
            return (
              <div className="absolute z-20 bg-[#21262A] text-white text-[10px] rounded-md px-2.5 py-1.5 whitespace-nowrap shadow-lg pointer-events-none"
                style={{ bottom: `calc(${100 - (p.y / H) * 100}% + 10px)`, left: `${Math.min(Math.max(leftPct, 5), 75)}%`, transform: 'translateX(-50%)' }}>
                <p className="font-semibold mb-1">{d.date} — Total: {formatTokens(d.total)}</p>
                {Object.entries(d.byModel).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([mid, toks]) => {
                  const ci = topModels.indexOf(mid);
                  const color = ci >= 0 ? MODEL_LINE_COLORS[ci % MODEL_LINE_COLORS.length] : '#aaa';
                  return (
                    <p key={mid} style={{ color }} className="opacity-90">
                      {getModelShortName(mid)}: {formatTokens(toks)}
                    </p>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex" style={{ paddingLeft: 44, height: 18 }}>
        <div className="flex-1 relative">
          {totalPts.map((p, i) => {
            if (i % labelEvery !== 0) return null;
            return (
              <span key={p.day.date} className="absolute text-[9px] text-muted-foreground -translate-x-1/2"
                style={{ left: `${(p.x / W) * 100}%`, top: 2 }}>
                {p.day.date.slice(5)}
              </span>
            );
          })}
        </div>
      </div>

      {/* Legend table — Grafana-style */}
      <div className="mt-3 border border-primary/10 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-primary/5 text-muted-foreground">
              <th className="text-left px-3 py-1.5 font-medium">Model</th>
              <th className="text-right px-3 py-1.5 font-medium">Total Tokens</th>
              <th className="text-right px-3 py-1.5 font-medium">Share</th>
              <th className="text-right px-3 py-1.5 font-medium w-8">Show</th>
            </tr>
          </thead>
          <tbody>
            {topModels.map((mid, ci) => {
              const color = MODEL_LINE_COLORS[ci % MODEL_LINE_COLORS.length];
              const total = modelTotals[mid] || 0;
              const grandTotal = Object.values(modelTotals).reduce((s, v) => s + v, 0);
              const pct = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
              const hidden = hiddenModels.has(mid);
              return (
                <tr key={mid} className={`border-t border-primary/5 ${hidden ? 'opacity-40' : ''}`}>
                  <td className="px-3 py-1.5 flex items-center gap-2">
                    <span className="w-3 h-0.5 rounded-full shrink-0 inline-block" style={{ backgroundColor: color }} />
                    <span className="text-foreground font-medium truncate max-w-[180px]">{getModelShortName(mid)}</span>
                  </td>
                  <td className="px-3 py-1.5 text-right text-lepos-cyan-text font-medium">{formatTokens(total)}</td>
                  <td className="px-3 py-1.5 text-right text-muted-foreground">{pct.toFixed(1)}%</td>
                  <td className="px-3 py-1.5 text-right">
                    <button
                      onClick={() => setHiddenModels(prev => {
                        const next = new Set(prev);
                        if (next.has(mid)) next.delete(mid); else next.add(mid);
                        return next;
                      })}
                      className="text-[10px] text-muted-foreground hover:text-[#023F59] transition-colors"
                    >
                      {hidden ? '○' : '●'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Token History Chart (Pure CSS) ──────────────────────────

const CHART_H = 130;
const CHART_Y_LABEL_W = 40;
const X_AXIS_H = 18;

function TokenHistoryChart({ days, period }: { days: HistoryDay[]; period: number }) {
  const maxTotal = Math.max(...days.map(d => d.total), 1);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const labelEvery = period <= 7 ? 1 : period <= 30 ? 3 : period <= 90 ? 7 : period <= 180 ? 14 : 30;

  // Build SVG polyline points — responsive: use % of width
  // We'll use a fixed SVG viewBox and let it scale
  const W = 800; // internal SVG coordinate width
  const H = CHART_H;
  const pad = { t: 8, r: 8, b: 4, l: 4 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;

  const pts = days.map((day, i) => {
    const x = pad.l + (days.length === 1 ? plotW / 2 : (i / (days.length - 1)) * plotW);
    const y = pad.t + plotH - (day.total / maxTotal) * plotH;
    return { x, y, day };
  });

  // Area fill path
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = pts.length
    ? `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(pad.t + plotH).toFixed(1)} L${pts[0].x.toFixed(1)},${(pad.t + plotH).toFixed(1)} Z`
    : '';

  const yTicks = [maxTotal, maxTotal / 2, 0];

  return (
    <div>
      <div className="flex gap-1">
        {/* Y-axis labels */}
        <div
          className="flex flex-col justify-between shrink-0 py-[8px]"
          style={{ width: CHART_Y_LABEL_W, height: CHART_H }}
        >
          {yTicks.map((v, i) => (
            <span key={i} className="text-[9px] text-muted-foreground text-right leading-none block">
              {formatTokens(Math.round(v))}
            </span>
          ))}
        </div>

        {/* SVG line chart */}
        <div className="flex-1 relative" style={{ height: CHART_H }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: CHART_H, display: 'block' }}
          >
            <defs>
              <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#107DAC" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#107DAC" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {/* Horizontal grid lines */}
            {[0, 0.5, 1].map((frac) => (
              <line
                key={frac}
                x1={pad.l} y1={pad.t + plotH * (1 - frac)}
                x2={W - pad.r} y2={pad.t + plotH * (1 - frac)}
                stroke="#023F59" strokeOpacity="0.08" strokeWidth="1"
              />
            ))}
            {/* Area fill */}
            {areaPath && <path d={areaPath} fill="url(#lineAreaGrad)" />}
            {/* Line */}
            {linePath && (
              <path d={linePath} fill="none" stroke="#107DAC" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            )}
            {/* Dots + hover targets */}
            {pts.map((p, i) => (
              <g key={p.day.date}>
                <circle
                  cx={p.x} cy={p.y} r="10"
                  fill="transparent"
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(null)}
                  style={{ cursor: 'pointer' }}
                />
                <circle
                  cx={p.x} cy={p.y} r={hoverIdx === i ? 4 : 3}
                  fill={hoverIdx === i ? '#31D7DB' : '#107DAC'}
                  stroke="white" strokeWidth="1.5"
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            ))}
          </svg>

          {/* Hover tooltip (DOM, not SVG, for easy styling) */}
          {hoverIdx !== null && pts[hoverIdx] && (() => {
            const p = pts[hoverIdx];
            const day = p.day;
            const leftPct = (p.x / W) * 100;
            return (
              <div
                className="absolute z-20 bg-[#21262A] text-white text-[10px] rounded-md px-2.5 py-1.5 whitespace-nowrap shadow-lg pointer-events-none"
                style={{
                  bottom: `calc(${100 - (p.y / CHART_H) * 100}% + 10px)`,
                  left: `${Math.min(Math.max(leftPct, 5), 75)}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <p className="font-semibold mb-0.5">{day.date}</p>
                <p>Total: {formatTokens(day.total)}</p>
                {Object.entries(day.byModel).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([model, tokens]) => (
                  <p key={model} className="opacity-75">{getModelShortName(model)}: {formatTokens(tokens)}</p>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex" style={{ paddingLeft: CHART_Y_LABEL_W + 4, height: X_AXIS_H }}>
        <div className="flex-1 relative">
          {pts.map((p, i) => {
            if (i % labelEvery !== 0) return null;
            const leftPct = (p.x / W) * 100;
            return (
              <span
                key={p.day.date}
                className="absolute text-[9px] text-muted-foreground -translate-x-1/2"
                style={{ left: `${leftPct}%`, top: 2 }}
              >
                {p.day.date.slice(5)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function ConfigCard({ title, model }: { title: string; model?: AvailableModel }) {
  if (!model) {
    return (
      <Card className="border-primary/25 shadow-sm">
        <CardContent className="p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{title}</div>
          <div className="text-sm text-muted-foreground italic">Not configured</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/25 shadow-sm">
      <CardContent className="p-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{title}</div>
        <div className="flex items-center gap-2">
          <ModelIcon modelId={model.id} size="md" />
          <div className="text-base font-semibold text-foreground">{model.label}</div>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge
            variant="secondary"
            className={`text-[10px] px-1.5 py-0 ${providerPillClasses(model.provider, model.subProvider)}`}
          >
            {providerLabel(model.provider, model.subProvider)}
          </Badge>
          {model.alias && (
            <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-muted-foreground">
              {model.alias}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function KPICard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <Card className="border-primary/25 shadow-sm">
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground font-medium">{title}</div>
        <div className="text-2xl font-bold text-lepos-cyan-text mt-1">{value}</div>
        {subtitle && <div className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20" />)}
      </div>
      <Skeleton className="h-48" />
      <Skeleton className="h-64" />
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Card className="border-primary/25 shadow-sm">
      <CardContent className="p-8 text-center">
        <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-3" />
        <p className="text-sm text-foreground font-medium mb-1">Failed to load model stats</p>
        <p className="text-xs text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry} className="border-primary/20">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry
        </Button>
      </CardContent>
    </Card>
  );
}

export default ModelTab;
