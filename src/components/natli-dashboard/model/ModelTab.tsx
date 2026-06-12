import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { RefreshCw, AlertTriangle, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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

// ─── Constant Data (March 2026) ───────────────────────────

const UPDATED_MODELS: Partial<AvailableModel>[] = [
  { id: 'anthropic/claude-sonnet-4-6', label: 'Claude Sonnet 4.6', provider: 'anthropic', pricing: { input: 3, output: 3, free: false }, contextTokens: 200000 },
  { id: 'anthropic/claude-opus-4-6', label: 'Claude Opus 4.6', provider: 'anthropic', pricing: { input: 15, output: 75, free: false }, contextTokens: 200000 },
  { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash', provider: 'google', pricing: { input: 0.15, output: 0.6, free: false }, contextTokens: 1000000 },
  { id: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro', provider: 'google', pricing: { input: 1.25, output: 10, free: false }, contextTokens: 1000000 },
  { id: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash Preview', provider: 'google', pricing: { input: 0, output: 0, free: true }, contextTokens: 1000000 },
  { id: 'openai/gpt-5.3-chat', label: 'GPT-5.3 Chat', provider: 'openai', pricing: { input: 10, output: 30, free: false }, contextTokens: 128000 },
  { id: 'x-ai/grok-4', label: 'Grok 4', provider: 'x-ai', pricing: { input: 3, output: 15, free: false }, contextTokens: 128000 },
  { id: 'x-ai/grok-4.1-fast', label: 'Grok 4.1 Fast', provider: 'x-ai', pricing: { input: 3, output: 9, free: false }, contextTokens: 256000 },
  { id: 'qwen/qwen35-plus', label: 'Qwen3.5 Plus', provider: 'qwen', pricing: { input: 0.26, output: 0.26, free: false }, contextTokens: 1000000 },
  { id: 'qwen/qwen35-max', label: 'Qwen3.5 Max', provider: 'qwen', pricing: { input: 2, output: 6, free: false }, contextTokens: 1000000 },
  { id: 'qwen/qwen35-flash', label: 'Qwen3.5 Flash', provider: 'qwen', pricing: { input: 0.05, output: 0.2, free: false }, contextTokens: 32000 },
  { id: 'minimax/minimax-m2.5', label: 'MiniMax M2.5', provider: 'minimax', pricing: { input: 0.27, output: 1.1, free: false }, contextTokens: 200000 },
  { id: 'minimax/minimax-m1', label: 'MiniMax M1', provider: 'minimax', pricing: { input: 0.3, output: 1.2, free: false }, contextTokens: 1000000 },
  { id: 'moonshot/kimi-k2-thinking-turbo', label: 'Kimi K2 Thinking Turbo', provider: 'moonshot', pricing: { input: 2.5, output: 10, free: false }, contextTokens: 262000 },
  { id: 'deepseek/deepseek-r1', label: 'DeepSeek R1', provider: 'deepseek', pricing: { input: 0.55, output: 2.19, free: false }, contextTokens: 128000 },
  { id: 'deepseek/deepseek-v4-pro', label: 'DeepSeek V4 Pro', provider: 'deepseek', pricing: { input: 1.74, output: 3.48, free: false }, contextTokens: 1048576 },
  { id: 'deepseek/deepseek-v4-flash', label: 'DeepSeek V4 Flash', provider: 'deepseek', pricing: { input: 0.14, output: 0.28, free: false }, contextTokens: 1048576 },
  { id: 'meta-llama/llama-3.3-70b', label: 'Llama 3.3 70B', provider: 'meta-llama', pricing: { input: 0, output: 0, free: true }, contextTokens: 128000 },
  { id: 'google/gemma-3-27b', label: 'Gemma 3 27B', provider: 'google', pricing: { input: 0, output: 0, free: true }, contextTokens: 32000 },
];

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

function getTier(m: Pick<AvailableModel, 'pricing'>): { label: string; cls: string } {
  if (m.pricing.free) return { label: 'Free', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  if (m.pricing.input <= 0.5) return { label: 'Cheap', cls: 'bg-sky-100 text-sky-700 border-sky-200' };
  if (m.pricing.input <= 3) return { label: 'Standard', cls: 'bg-amber-100 text-amber-700 border-amber-200' };
  return { label: 'Premium', cls: 'bg-purple-100 text-purple-700 border-purple-200' };
}

function getProviderLabel(provider: string, subProvider?: string): string {
  const p = (subProvider || provider).toLowerCase();
  if (p.includes('anthropic')) return 'Anthropic';
  if (p.includes('google')) return 'Google';
  if (p.includes('openai')) return 'OpenAI';
  if (p.includes('x-ai')) return 'xAI';
  if (p.includes('moonshot')) return 'Moonshot';
  if (p.includes('qwen')) return 'Qwen';
  if (p.includes('minimax')) return 'MiniMax';
  if (p.includes('deepseek')) return 'DeepSeek';
  if (p.includes('meta')) return 'Meta';
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

// ─── Component ───────────────────────────────────────────────

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

// ─── Model List Table ─────────────────────────────────────────────────

type SortBy = 'price' | 'context' | 'usage' | 'name';
type SortDir = 'asc' | 'desc';
type CategoryFilter = 'all' | 'free' | 'cheap' | 'standard' | 'premium';
type ProviderFilter = 'all' | 'anthropic' | 'google' | 'openai' | 'xai' | 'moonshot' | 'qwen' | 'minimax' | 'deepseek';

function ModelListTable({ models, tokenStats }: { models: AvailableModel[]; tokenStats: ModelStats['tokenStats'] }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('price');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [catFilter, setCatFilter] = useState<CategoryFilter>('all');
  const [provFilter, setProvFilter] = useState<ProviderFilter>('all');

  // Enrich models with updated market data if available
  const enrichedModels = useMemo(() => {
    return models.map(m => {
      const update = UPDATED_MODELS.find(u => m.id.includes(u.id!) || u.id!.includes(m.id));
      if (update) {
        return { ...m, ...update };
      }
      return m;
    });
  }, [models]);

  // Fuzzy match model ID for usage stats (handles openrouter/ prefix differences)
  const getUsageStats = useCallback((modelId: string) => {
    const exact = tokenStats.byModel.find(s => s.modelId === modelId);
    if (exact) return exact;
    // Try suffix match: openrouter/google/gemini-2.5-flash vs google/gemini-2.5-flash
    return tokenStats.byModel.find(s =>
      s.modelId.endsWith(modelId) || modelId.endsWith(s.modelId) ||
      s.modelId.includes(modelId.split('/').pop()!) ||
      modelId.includes(s.modelId.split('/').pop()!)
    );
  }, [tokenStats]);

  const filtered = useMemo(() => {
    return enrichedModels.filter(m => {
      const matchesSearch = !search || m.label.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase());

      const tier = getTier(m);
      let matchesCat = true;
      if (catFilter === 'free') matchesCat = m.pricing.free;
      else if (catFilter === 'cheap') matchesCat = tier.label === 'Cheap';
      else if (catFilter === 'standard') matchesCat = tier.label === 'Standard';
      else if (catFilter === 'premium') matchesCat = tier.label === 'Premium';

      let matchesProv = true;
      if (provFilter !== 'all') {
        const p = getProviderLabel(m.provider, m.subProvider).toLowerCase();
        matchesProv = p.includes(provFilter);
      }

      return matchesSearch && matchesCat && matchesProv;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'price') {
        // Free = 0, otherwise use input price; then sort stably by name for ties
        const pa = a.pricing.free ? 0 : a.pricing.input;
        const pb = b.pricing.free ? 0 : b.pricing.input;
        cmp = pa - pb || a.label.localeCompare(b.label);
      } else if (sortBy === 'context') {
        cmp = a.contextTokens - b.contextTokens || a.label.localeCompare(b.label);
      } else if (sortBy === 'usage') {
        const ua = getUsageStats(a.id)?.tokens || 0;
        const ub = getUsageStats(b.id)?.tokens || 0;
        cmp = ua - ub || a.label.localeCompare(b.label);
      } else {
        cmp = a.label.localeCompare(b.label);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [enrichedModels, search, sortBy, sortDir, catFilter, provFilter, getUsageStats]);

  const toggleSort = (s: SortBy) => {
    if (sortBy === s) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortBy(s); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: SortBy }) => {
    if (sortBy !== col) return <ArrowUpDown className="inline w-3 h-3 ml-1 opacity-40" />;
    return sortDir === 'asc'
      ? <ArrowUp className="inline w-3 h-3 ml-1 text-primary" />
      : <ArrowDown className="inline w-3 h-3 ml-1 text-primary" />;
  };

  const setQuickRank = (type: 'cheapest' | 'expensive' | 'most-context' | 'most-used') => {
    if (type === 'cheapest') { setSortBy('price'); setSortDir('asc'); setCatFilter('all'); }
    else if (type === 'expensive') { setSortBy('price'); setSortDir('desc'); setCatFilter('all'); }
    else if (type === 'most-context') { setSortBy('context'); setSortDir('desc'); setCatFilter('all'); }
    else if (type === 'most-used') { setSortBy('usage'); setSortDir('desc'); setCatFilter('all'); }
  };

  return (
    <div className="space-y-4">
      {/* Filters & Sorting Controls */}
      <Card className="border-primary/20 bg-primary/2">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 bg-background"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={catFilter}
                onChange={e => setCatFilter(e.target.value as CategoryFilter)}
                className="text-xs border rounded p-1.5 bg-background font-medium"
              >
                <option value="all">All Tiers</option>
                <option value="free">Free Only</option>
                <option value="cheap">Cheap ($0-0.5)</option>
                <option value="standard">Standard ($0.5-3)</option>
                <option value="premium">Premium ($3+)</option>
              </select>

              <select
                value={provFilter}
                onChange={e => setProvFilter(e.target.value as ProviderFilter)}
                className="text-xs border rounded p-1.5 bg-background font-medium"
              >
                <option value="all">All Providers</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
                <option value="openai">OpenAI</option>
                <option value="xai">xAI</option>
                <option value="moonshot">Moonshot</option>
                <option value="qwen">Qwen</option>
                <option value="minimax">MiniMax</option>
                <option value="deepseek">DeepSeek</option>
              </select>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Rank:</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => setQuickRank('cheapest')} className="text-[10px] h-7 px-2">Cheapest</Button>
                <Button variant="outline" size="sm" onClick={() => setQuickRank('most-context')} className="text-[10px] h-7 px-2">Most Context</Button>
                <Button variant="outline" size="sm" onClick={() => setQuickRank('most-used')} className="text-[10px] h-7 px-2">Most Used</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="border border-primary/10 rounded-lg overflow-hidden bg-background shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-primary/5 border-b border-primary/10">
            <tr className="text-left text-muted-foreground font-semibold text-xs uppercase tracking-wider">
              <th className={`px-4 py-3 cursor-pointer hover:text-foreground transition-colors ${sortBy === 'name' ? 'text-primary' : ''}`} onClick={() => toggleSort('name')}>
                Model Name <SortIcon col="name" />
              </th>
              <th className="px-4 py-3">Provider</th>
              <th className={`px-4 py-3 text-right cursor-pointer hover:text-foreground transition-colors ${sortBy === 'price' ? 'text-primary' : ''}`} onClick={() => toggleSort('price')}>
                Input/M <SortIcon col="price" />
              </th>
              <th className="px-4 py-3 text-right">Output/M</th>
              <th className={`px-4 py-3 text-right cursor-pointer hover:text-foreground transition-colors ${sortBy === 'context' ? 'text-primary' : ''}`} onClick={() => toggleSort('context')}>
                Context <SortIcon col="context" />
              </th>
              <th className={`px-4 py-3 text-right cursor-pointer hover:text-foreground transition-colors ${sortBy === 'usage' ? 'text-primary' : ''}`} onClick={() => toggleSort('usage')}>
                Sessions <SortIcon col="usage" />
              </th>
              <th className="px-4 py-3 text-right">Tokens Used</th>
              <th className="px-4 py-3 text-center">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {filtered.map((m) => {
              const usageStats = getUsageStats(m.id);
              const prov = getProviderLabel(m.provider, m.subProvider);
              const tier = getTier(m);
              return (
                <tr key={m.id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ModelIcon modelId={m.id} size="sm" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">{m.label}</span>
                          {/* Tier badge inline after name */}
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${tier.cls}`}>
                            {tier.label}
                          </span>
                          {m.isPrimary && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-white">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">{m.alias || m.id.split('/').pop()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px] font-bold border-primary/20">{prov}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {m.pricing.free ? <span className="text-emerald-600 font-bold">FREE</span> : `$${m.pricing.input.toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                    {m.pricing.free ? '—' : `$${m.pricing.output.toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium">{formatTokens(m.contextTokens)}</td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">{usageStats?.sessions || 0}</td>
                  <td className="px-4 py-3 text-right font-mono text-primary font-medium">{formatTokens(usageStats?.tokens || 0)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${tier.cls}`}>
                      {tier.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No models match your current filters</div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export function ModelTab({ mode }: { mode?: 'dashboard' | 'full' } = {}) {
  const [view, setView] = useState<'usage' | 'list' | 'intelligence' | 'running'>('usage');
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

  useEffect(() => {
    if (view === 'running' && !runningConfig) fetchRunningConfig();
  }, [view, runningConfig, fetchRunningConfig]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (view === 'usage') {
      await Promise.all([fetchStats(), fetchHistory(historyPeriod)]);
    } else if (view === 'running') {
      await fetchRunningConfig();
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

  if (loading) return <div className="p-8 text-center text-muted-foreground">Checking system models...</div>;
  if (error) return <div className="p-8 text-center text-rose-500 font-medium">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* View Switcher */}
      {mode !== 'dashboard' && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1 p-1 bg-primary/5 rounded-lg border border-primary/10">
            {([
              { id: 'usage',        label: '📊 Usage' },
              { id: 'list',         label: '📋 Models List' },
              { id: 'intelligence', label: '🧠 Intelligence' },
              { id: 'running',      label: '▶️ Running' },
            ] as const).map(v => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all duration-200 ${
                  view === v.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-[#023F59] hover:bg-primary/10'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {lastRefreshed && (
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                Refreshed {lastRefreshed.toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-1.5 border-primary/25 text-[#023F59] h-8"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Syncing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      )}

      {view === 'list' && <ModelListTable models={stats.availableModels} tokenStats={stats.tokenStats} />}
      {view === 'intelligence' && <ModelIntelligencePage />}
      {view === 'usage' && (
        <div className="grid gap-6">
          {/* KPI Strip */}
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            <KPICard title="Total Tokens" value={formatTokens(stats.tokenStats.total)} />
            <KPICard title="Total Sessions" value={String(stats.tokenStats.byModel.reduce((s, m) => s + m.sessions, 0))} />
            <KPICard title="Est. Cost" value={formatCost(stats.tokenStats.totalCostEstimate)} />
            <KPICard title="Primary Model" value={getModelShortName(stats.availableModels.find(m => m.isPrimary)?.id || 'None')} />
          </div>

          {/* Token Usage by Model — Bar Chart */}
          {stats.tokenStats.byModel.length > 0 && (
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-foreground">Token Usage by Model</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={[...stats.tokenStats.byModel]
                      .sort((a, b) => b.tokens - a.tokens)
                      .slice(0, 10)
                      .map(m => ({
                        name: getModelShortName(m.modelId),
                        tokens: m.tokens,
                        cost: m.costEstimate,
                        sessions: m.sessions,
                      }))}
                    margin={{ top: 4, right: 16, left: 0, bottom: 40 }}
                  >
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                    <YAxis tickFormatter={(v) => formatTokens(v)} tick={{ fontSize: 10 }} width={52} />
                    <Tooltip
                      formatter={(value: number, name: string) =>
                        name === 'tokens' ? [formatTokens(value), 'Tokens'] : [value, name]
                      }
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    />
                    <Bar dataKey="tokens" radius={[4, 4, 0, 0]}>
                      {stats.tokenStats.byModel.slice(0, 10).map((_, i) => (
                        <Cell key={i} fill={['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899'][i % 10]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Per-Model Breakdown Table */}
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">Per-Model Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-primary/5 border-b border-primary/10">
                  <tr className="text-left text-muted-foreground text-xs uppercase font-semibold tracking-wider">
                    <th className="px-4 py-2.5">Model</th>
                    <th className="px-4 py-2.5 text-right">Sessions</th>
                    <th className="px-4 py-2.5 text-right">Tokens</th>
                    <th className="px-4 py-2.5 text-right">Share</th>
                    <th className="px-4 py-2.5 text-right">Est. Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {[...stats.tokenStats.byModel]
                    .sort((a, b) => b.tokens - a.tokens)
                    .map((m) => (
                      <tr key={m.modelId} className="hover:bg-primary/[0.02] transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <ModelIcon modelId={m.modelId} size="sm" />
                            <div>
                              <div className="font-semibold text-foreground text-xs">{getModelShortName(m.modelId)}</div>
                              <div className="text-[9px] text-muted-foreground font-mono">{m.modelId.split('/').pop()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-muted-foreground text-xs">{m.sessions}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-primary font-bold text-xs">{formatTokens(m.tokens)}</td>
                        <td className="px-4 py-2.5 text-right text-xs">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-primary/10 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(m.pct, 100)}%` }} />
                            </div>
                            <span className="font-mono text-muted-foreground w-8 text-right">{m.pct.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs text-amber-600">{formatCost(m.costEstimate)}</td>
                      </tr>
                    ))}
                </tbody>
                <tfoot className="bg-primary/5 border-t border-primary/10 font-bold">
                  <tr>
                    <td className="px-4 py-2.5 text-xs">Total</td>
                    <td className="px-4 py-2.5 text-right text-xs font-mono">
                      {stats.tokenStats.byModel.reduce((s, m) => s + m.sessions, 0)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs font-mono text-primary">
                      {formatTokens(stats.tokenStats.total)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs">100%</td>
                    <td className="px-4 py-2.5 text-right text-xs font-mono text-amber-600">
                      {formatCost(stats.tokenStats.totalCostEstimate)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="border-primary/20">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground">Token History</CardTitle>
              <div className="flex gap-1">
                {[7, 14, 30].map(d => (
                  <button
                    key={d}
                    onClick={() => setHistoryPeriod(d)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      historyPeriod === d ? 'bg-primary text-white' : 'bg-primary/5 text-muted-foreground hover:bg-primary/10'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">No history data available</div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={history.map(d => ({ date: d.date.slice(5), total: d.total }))} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                    <YAxis tickFormatter={formatTokens} tick={{ fontSize: 9 }} width={44} />
                    <Tooltip formatter={(v: number) => [formatTokens(v), 'Tokens']} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Bar dataKey="total" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {view === 'running' && (
        <div className="p-8 text-center text-muted-foreground">Config configuration view pending activation</div>
      )}
    </div>
  );
}

function KPICard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="border-primary/20 bg-background hover:border-primary/40 transition-colors shadow-sm">
      <CardContent className="p-4">
        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{title}</div>
        <div className="text-2xl font-bold text-primary mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}

export default ModelTab;
