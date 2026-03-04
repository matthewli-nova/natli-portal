import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';
import { Button } from '../../ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

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

// ─── Helpers ─────────────────────────────────────────────────

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

function getProviderColor(provider: string, subProvider?: string): string {
  if (provider === 'anthropic') return '#023F59';
  if (provider === 'moonshot') return '#f59e0b'; // amber-500
  // openrouter sub-providers
  if (subProvider === 'x-ai') return '#a855f7'; // purple-500
  if (subProvider === 'deepseek') return '#f43f5e'; // rose-500
  if (subProvider === 'minimax') return '#fb923c'; // orange-400
  if (subProvider === 'meta-llama' || subProvider === 'qwen') return '#10b981'; // emerald-500
  if (subProvider === 'google') return '#31D7DB';
  return '#31D7DB'; // default openrouter cyan
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
  if (provider === 'anthropic') return 'bg-[#023F59] text-white';
  if (provider === 'moonshot') return 'bg-amber-500 text-white';
  if (subProvider === 'x-ai') return 'bg-purple-500 text-white';
  if (subProvider === 'deepseek') return 'bg-rose-500 text-white';
  if (subProvider === 'minimax') return 'bg-orange-400 text-white';
  if (subProvider === 'meta-llama' || subProvider === 'qwen') return 'bg-emerald-500 text-white';
  return 'bg-[#31D7DB] text-[#023F59]';
}

// ─── Component ───────────────────────────────────────────────

export function ModelTab() {
  const [stats, setStats] = useState<ModelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={fetchStats} />;
  if (!stats) return null;

  const { config, availableModels, tokenStats, topSessions } = stats;
  const totalSessions = tokenStats.byModel.reduce((s, m) => s + m.sessions, 0);
  const avgPerSession = totalSessions > 0 ? tokenStats.total / totalSessions : 0;

  // Find primary + fallback models for config strip
  const primaryModel = availableModels.find(m => m.isPrimary);
  const fallbackModels = availableModels
    .filter(m => m.isFallback)
    .sort((a, b) => (a.fallbackOrder ?? 99) - (b.fallbackOrder ?? 99));

  // Build usage lookup
  const usageLookup = new Map<string, ByModelEntry>();
  for (const bm of tokenStats.byModel) {
    usageLookup.set(bm.modelId, bm);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#21262A]">Model Configuration & Usage</h3>
      </div>

      {/* [A] Active Config Strip */}
      <div className="grid gap-4 md:grid-cols-3">
        <ConfigCard title="PRIMARY" model={primaryModel} config={config} />
        {[0, 1].map(i => (
          <ConfigCard
            key={i}
            title={`FALLBACK ${i + 1}`}
            model={fallbackModels[i]}
            config={config}
          />
        ))}
      </div>

      {/* [B] Token KPI Strip */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <KPICard
          title="Total Tokens"
          value={formatTokens(tokenStats.total)}
          color="#107DAC"
        />
        <KPICard
          title="Total Sessions"
          value={String(totalSessions)}
        />
        <KPICard
          title="Est. Cost"
          value={formatCost(tokenStats.totalCostEstimate)}
          color={tokenStats.totalCostEstimate > 50 ? '#f59e0b' : undefined}
          subtitle="Estimated · blended 80/20 rate"
        />
        <KPICard
          title="Avg / Session"
          value={formatTokens(Math.round(avgPerSession))}
        />
      </div>

      {/* [C] Token Spend by Model */}
      <Card className="border-[#023F59]/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#21262A]">Token Spend by Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tokenStats.byModel.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No token usage data</p>
          ) : (
            tokenStats.byModel.map((entry) => {
              const model = availableModels.find(m => m.id === entry.modelId);
              const color = getProviderColor(
                model?.provider ?? entry.provider,
                model?.subProvider
              );
              return (
                <div key={entry.modelId} className="flex items-center gap-3 text-sm">
                  <div className="w-36 shrink-0 truncate font-medium text-[#21262A]">
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
                  <div className="w-16 text-right text-[#21262A] font-medium shrink-0">
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

      {/* [D] Available Models Grid */}
      <Card className="border-[#023F59]/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#21262A]">Available Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {availableModels.map((model) => {
              const usage = usageLookup.get(model.id);
              const borderClass = getProviderBorderClass(model.provider, model.subProvider);
              return (
                <div
                  key={model.id}
                  className={`border border-[#023F59]/20 rounded-lg p-3 border-l-4 ${borderClass}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-[#21262A] text-sm">{model.label}</div>
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
                      <Badge variant="secondary" className="text-[10px] bg-[#107DAC]/15 text-[#107DAC] px-1.5 py-0">
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
                      <div>
                        <span className="font-mono bg-gray-100 px-1 rounded text-[11px]">alias: {model.alias}</span>
                      </div>
                    )}
                    <div>{formatCtx(model.contextTokens)}</div>
                    <div>
                      {model.pricing.free
                        ? 'Free'
                        : `$${model.pricing.input.toFixed(2)} / $${model.pricing.output.toFixed(2)} per 1M`}
                    </div>
                    {usage && (
                      <div className="text-[#107DAC] font-medium">
                        {usage.sessions} sessions · {formatTokens(usage.tokens)} tokens
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* [E] Top Token Consumers */}
      <Card className="border-[#023F59]/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#21262A]">Top Token Consumers</CardTitle>
        </CardHeader>
        <CardContent>
          {topSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No session data</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#023F59]/10 text-left text-muted-foreground text-xs">
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
                    <tr key={i} className="border-b border-[#023F59]/5 last:border-0">
                      <td className="py-2 pr-3 text-[#21262A] font-medium max-w-[200px] truncate">
                        {session.label}
                      </td>
                      <td className="py-2 pr-3">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[#023F59]/20">
                          {session.sessionType}
                        </Badge>
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground truncate max-w-[140px]">
                        {session.model}
                      </td>
                      <td className="py-2 pr-3 text-right font-medium text-[#21262A]">
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
      </Card>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function ConfigCard({ title, model }: { title: string; model?: AvailableModel; config: ModelStats['config'] }) {
  if (!model) {
    return (
      <Card className="border-[#023F59]/20">
        <CardContent className="p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{title}</div>
          <div className="text-sm text-muted-foreground italic">Not configured</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#023F59]/20">
      <CardContent className="p-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{title}</div>
        <div className="text-base font-semibold text-[#21262A]">{model.label}</div>
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

function KPICard({ title, value, color, subtitle }: { title: string; value: string; color?: string; subtitle?: string }) {
  return (
    <Card className="border-[#023F59]/20">
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground font-medium">{title}</div>
        <div
          className="text-2xl font-bold mt-1"
          style={{ color: color || '#21262A' }}
        >
          {value}
        </div>
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
    <Card className="border-[#023F59]/20">
      <CardContent className="p-8 text-center">
        <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-3" />
        <p className="text-sm text-[#21262A] font-medium mb-1">Failed to load model stats</p>
        <p className="text-xs text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry} className="border-[#023F59]/20">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry
        </Button>
      </CardContent>
    </Card>
  );
}

export default ModelTab;
