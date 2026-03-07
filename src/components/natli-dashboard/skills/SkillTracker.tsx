// SkillTracker.tsx
// Analytics view — usage stats, most used, recently added, never used, category breakdown

import { TrendingUp, Clock, AlertCircle, Layers, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { type Skill, type SkillCategory, CATEGORY_COLORS, STATUS_COLORS } from './skills-data';

// Accept either the full static stats shape or the partial live-API shape
interface SkillTrackerProps {
  stats: {
    total: number;
    totalCustom: number;
    totalSystem: number;
    ready: number;
    needsSetup: number;
    contractCoverage: number;
    withContract?: number;
    mostUsed?: Skill[];
    recentlyAdded?: Skill[];
    neverUsed?: Skill[];
  };
  skills: Skill[];
}

export function SkillTracker({ stats, skills }: SkillTrackerProps) {
  const categoryBreakdown = getCategoryBreakdown(skills);
  const providerBreakdown = getProviderBreakdown(skills);
  const topProvider = providerBreakdown[0];
  const recentlyAdded = stats.recentlyAdded ?? [...skills].sort((a,b) => (b.addedDate ?? '').localeCompare(a.addedDate ?? '')).slice(0,5);
  const neverUsed   = stats.neverUsed   ?? skills.filter(s => !s.usageCount);

  return (
    <div className="space-y-6">

      {/* ── Top KPIs ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: Package,
            label: 'Total Skills',
            value: stats.total,
            sub: `${stats.totalCustom} custom · ${stats.totalSystem} system`,
          },
          {
            icon: Layers,
            label: 'Top Source',
            value: topProvider?.name ?? '—',
            sub: `${topProvider?.count ?? 0} skills`,
          },
          {
            icon: Clock,
            label: 'Recently Added',
            value: recentlyAdded[0]?.name ?? '—',
            sub: recentlyAdded[0]?.addedDate ?? '—',
          },
          {
            icon: AlertCircle,
            label: 'Never Used',
            value: neverUsed.length,
            sub: 'skills with 0 uses',
            accent: neverUsed.length > 5 ? 'text-amber-600' : 'text-muted-foreground',
          },
        ].map(kpi => (
          <Card key={kpi.label} className="border-primary/25 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <kpi.icon className="w-3.5 h-3.5 text-secondary" />
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-0.5 truncate ${kpi.accent ?? 'text-lepos-cyan-text'}`}>{kpi.value}</div>
              <div className="text-xs text-muted-foreground">{kpi.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── By Source / Provider ──────────────────────────────── */}
        <Card className="border-primary/25 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-secondary" />
              By Source
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2.5">
              {providerBreakdown.map(p => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.emoji}</span>
                      <span className="text-sm font-medium">{p.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{p.count} skills</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((p.count / skills.length) * 100)}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Recently Added ───────────────────────────────────── */}
        <Card className="border-primary/25 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-secondary" />
              Recently Added
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {recentlyAdded.map(skill => (
                <div key={skill.id} className="flex items-center gap-2 py-1.5 border-b border-primary/8 last:border-0">
                  <span className="text-sm">{skill.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">{skill.category}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                    {formatDateTime(skill.addedDate)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Category Breakdown ───────────────────────────────── */}
        <Card className="border-primary/25 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {categoryBreakdown.map(cat => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[cat.name as SkillCategory]}`}>
                      {cat.name}
                    </span>
                    <span className="text-muted-foreground">{cat.count} skills · {cat.readyCount} ready</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full"
                      style={{ width: `${(cat.count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Never Used / Needs Attention ─────────────────────── */}
        <Card className="border-primary/25 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {/* Skills needing setup */}
              {skills.filter(s => s.status === 'needs-setup').map(skill => (
                <div key={skill.id} className="flex items-center gap-2">
                  <span className="text-sm">{skill.emoji}</span>
                  <span className="text-sm flex-1 truncate">{skill.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS['needs-setup']}`}>
                    ⚠ Setup
                  </span>
                </div>
              ))}

              {/* Skills without contract */}
              {skills.filter(s => !s.hasContract && s.type === 'custom').slice(0, 3).map(skill => (
                <div key={skill.id} className="flex items-center gap-2">
                  <span className="text-sm">{skill.emoji}</span>
                  <span className="text-sm flex-1 truncate">{skill.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
                    No contract
                  </span>
                </div>
              ))}

              {/* Never used */}
              {neverUsed.filter(s => s.type === 'custom').slice(0, 2).map(skill => (
                <div key={skill.id} className="flex items-center gap-2">
                  <span className="text-sm">{skill.emoji}</span>
                  <span className="text-sm flex-1 truncate">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">never used</span>
                </div>
              ))}

              {neverUsed.length === 0 && skills.filter(s => s.status === 'needs-setup').length === 0 && (
                <p className="text-sm text-emerald-600 text-center py-4">
                  ✅ All skills are healthy
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Contract Coverage Banner ─────────────────────────────── */}
      <div className={`rounded-lg p-4 border flex items-center justify-between ${
        stats.contractCoverage === 100
          ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
          : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
      }`}>
        <div>
          <p className="text-sm font-medium">
            {stats.contractCoverage === 100
              ? '✅ All custom skills have contracts'
              : `⚠️ ${stats.withContract ?? 0} of ${stats.totalCustom} custom skills have contracts`}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Contract coverage: {stats.contractCoverage}% · Use skill-creator to add missing contracts
          </p>
        </div>
        <div className="text-2xl font-bold">{stats.contractCoverage}%</div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${date} ${time}`;
  } catch {
    return dateStr;
  }
}

function getProviderBreakdown(skills: Skill[]) {
  const providers: { name: string; emoji: string; color: string; match: (s: Skill) => boolean }[] = [
    { name: 'Google Workspace', emoji: '🔵', color: '#4285F4', match: s => s.id.startsWith('gws-') || s.name.toLowerCase().startsWith('gws') },
    { name: 'Apify',            emoji: '🕷️', color: '#FF7900', match: s => s.id.startsWith('apify') || s.name.toLowerCase().includes('apify') },
    { name: 'Custom',           emoji: '🧩', color: '#31D7DB', match: s => s.type === 'custom' && !s.id.startsWith('gws-') && !s.id.startsWith('apify') },
    { name: 'OpenClaw Built-in',emoji: '🦞', color: '#023F59', match: s => s.type === 'system' && !s.id.startsWith('gws-') && !s.id.startsWith('apify') },
  ];

  return providers
    .map(p => ({ ...p, count: skills.filter(p.match).length }))
    .filter(p => p.count > 0)
    .sort((a, b) => b.count - a.count);
}

function getCategoryBreakdown(skills: Skill[]) {
  const map = new Map<string, { count: number; readyCount: number }>();
  for (const skill of skills) {
    const existing = map.get(skill.category) ?? { count: 0, readyCount: 0 };
    map.set(skill.category, {
      count: existing.count + 1,
      readyCount: existing.readyCount + (skill.status === 'ready' ? 1 : 0),
    });
  }
  return Array.from(map.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);
}
