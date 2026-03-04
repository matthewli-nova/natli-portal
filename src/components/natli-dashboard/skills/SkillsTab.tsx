// SkillsTab.tsx — enriched Skills dashboard tab
// Features: live /api/skills data, refresh button, resizable left/right splitter

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Search, Plus, LayoutGrid, List, BookOpen, PenLine, BarChart3, RefreshCw } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { SkillsList } from './SkillsList';
import { SkillViewer } from './SkillViewer';
import { SkillEditor } from './SkillEditor';
import { SkillTracker } from './SkillTracker';
import { AddSkillModal } from './AddSkillModal';
import {
  ALL_SKILLS as STATIC_SKILLS,
  SKILL_CATEGORIES,
  getSkillStats,
  type Skill,
  type SkillCategory,
  type SkillStatus,
  STATUS_COLORS,
  STATUS_LABELS,
  CATEGORY_COLORS,
} from './skills-data';
import { Card, CardContent } from '../../ui/card';

type ViewMode  = 'grid' | 'list';
type DetailMode = 'view' | 'edit';

interface LiveStats {
  total: number; custom: number; system: number;
  ready: number; needsSetup: number; withContract: number;
}

// ─── Resizable Splitter Hook ──────────────────────────────────────────────────
function useResizable(initial = 280, min = 180, max = 520) {
  const [width, setWidth] = useState(initial);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(initial);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - startX.current;
      setWidth(Math.min(max, Math.max(min, startW.current + delta)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [min, max]);

  return { width, onMouseDown };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function SkillsTab() {
  const [search, setSearch]                         = useState('');
  const [selectedCategory, setSelectedCategory]     = useState<SkillCategory | 'All'>('All');
  const [selectedType, setSelectedType]             = useState<'all' | 'custom' | 'system'>('all');
  const [selectedStatus, setSelectedStatus]         = useState<SkillStatus | 'all'>('all');
  const [selectedSkill, setSelectedSkill]           = useState<Skill | null>(STATIC_SKILLS[0] ?? null);
  const [viewMode, setViewMode]                     = useState<ViewMode>('list');
  const [detailMode, setDetailMode]                 = useState<DetailMode>('view');
  const [activeTab, setActiveTab]                   = useState<'skills' | 'tracker'>('skills');
  const [showAddModal, setShowAddModal]             = useState(false);
  const [liveStats, setLiveStats]                   = useState<LiveStats | null>(null);
  const [liveSkills, setLiveSkills]                 = useState<Skill[] | null>(null);
  const [refreshing, setRefreshing]                 = useState(false);
  const [lastUpdated, setLastUpdated]               = useState<string>('');

  const { width: leftWidth, onMouseDown: onDragStart } = useResizable(280);

  // Live fetch from backend
  const fetchLive = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json() as { skills: Skill[]; stats: LiveStats };
        setLiveStats(data.stats);
        // Normalize: live API skills may lack `type`; default to 'custom'
        setLiveSkills(data.skills.map(s => ({ ...s, type: s.type ?? 'custom' })));
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch { /* fallback to static */ }
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchLive(); }, [fetchLive]);

  const skills     = liveSkills ?? STATIC_SKILLS;
  const staticStats = useMemo(() => getSkillStats(), []);
  const stats = liveStats
    ? {
        total: liveStats.total,
        totalCustom: liveStats.custom,
        totalSystem: liveStats.system,
        ready: liveStats.ready,
        needsSetup: liveStats.needsSetup,
        contractCoverage: liveStats.custom > 0 ? Math.round((liveStats.withContract / liveStats.custom) * 100) : 0,
        mostUsed: staticStats.mostUsed,
        neverUsed: staticStats.neverUsed,
      }
    : staticStats;

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const q = search.toLowerCase();
      const matchesSearch = !search || skill.name.toLowerCase().includes(q)
        || skill.description.toLowerCase().includes(q)
        || skill.tags.some(t => t.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      const matchesType = selectedType === 'all' || skill.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || skill.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [skills, search, selectedCategory, selectedType, selectedStatus]);

  // ── KPI data ──
  const kpis = [
    {
      label: 'Total Skills',
      value: stats.total,
      sub: `${stats.totalCustom} custom · ${stats.totalSystem} system`,
      accent: '',
    },
    { label: 'Ready', value: stats.ready, sub: 'operational', accent: 'text-emerald-600' },
    { label: 'Needs Setup', value: stats.needsSetup, sub: 'action required', accent: stats.needsSetup > 0 ? 'text-amber-600' : 'text-emerald-600' },
    {
      label: 'Contract Coverage',
      value: `${stats.contractCoverage}%`,
      sub: 'of custom skills',
      accent: stats.contractCoverage === 100 ? 'text-emerald-600' : 'text-amber-600',
    },
    {
      label: 'Most Used',
      value: stats.mostUsed[0]?.name ?? '—',
      sub: `${stats.mostUsed[0]?.usageCount ?? 0} uses`,
      accent: '',
    },
  ];

  return (
    <div className="space-y-4 min-w-0 w-full">

      {/* ── KPI Strip + Refresh ───────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1">
          {kpis.map(kpi => (
            <Card key={kpi.label} className="border-[#023F59]/20">
              <CardContent className="p-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">{kpi.label}</p>
                <p className={`text-xl font-bold text-[#21262A] ${kpi.accent}`}>{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Refresh */}
        <div className="flex flex-col items-end gap-1 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLive}
            disabled={refreshing}
            className="border-[#023F59]/20 text-[#107DAC] hover:bg-[#023F59]/5"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {lastUpdated && (
            <span className="text-[10px] text-muted-foreground">Updated {lastUpdated}</span>
          )}
        </div>
      </div>

      {/* ── Tab Toggle: Skills | Tracker ──────────────────────────── */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'skills' | 'tracker')}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-[#023F59]/5">
            <TabsTrigger value="skills" className="flex items-center gap-1.5 data-[state=active]:bg-[#023F59] data-[state=active]:text-white">
              <BookOpen className="w-3.5 h-3.5" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-1.5 data-[state=active]:bg-[#023F59] data-[state=active]:text-white">
              <BarChart3 className="w-3.5 h-3.5" />
              Tracker
            </TabsTrigger>
          </TabsList>
          <Button onClick={() => setShowAddModal(true)} size="sm" className="bg-[#023F59] text-white hover:bg-[#022F44] flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            New Skill
          </Button>
        </div>

        {/* ── Skills Tab ─────────────────────────────────────────── */}
        <TabsContent value="skills" className="mt-3">
          <div className="flex gap-0 h-[680px] border border-[#023F59]/20 rounded-lg overflow-hidden">

            {/* Left panel — independent scroll */}
            <div
              className="flex-shrink-0 flex flex-col gap-3 p-3 border-r border-[#023F59]/20 overflow-hidden"
              style={{ width: leftWidth }}
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search skills…" value={search} onChange={e => setSearch(e.target.value)} className="pl-8" />
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  {(['all', 'custom', 'system'] as const).map(t => (
                    <button key={t} onClick={() => setSelectedType(t)}
                      className={`flex-1 text-xs py-1 px-2 rounded-md font-medium transition-colors ${selectedType === t ? 'bg-[#023F59] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  {([{ key: 'all', label: 'All' }, { key: 'ready', label: '✓ Ready' }, { key: 'needs-setup', label: '⚠ Setup' }] as const).map(s => (
                    <button key={s.key} onClick={() => setSelectedStatus(s.key)}
                      className={`flex-1 text-xs py-1 px-2 rounded-md font-medium transition-colors ${selectedStatus === s.key ? 'bg-[#023F59] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {(['All', ...SKILL_CATEGORIES] as const).map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat as SkillCategory | 'All')}
                      className={`text-xs py-0.5 px-2 rounded-full font-medium transition-colors ${selectedCategory === cat ? 'bg-[#023F59] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                      {cat === 'All' ? 'All' : cat === 'Infrastructure & Platform' ? 'Infra' : cat.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* View toggle + count */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''}</span>
                <div className="flex gap-1">
                  <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted/50'}`}><List className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {/* Skill list */}
              <div className="flex-1 overflow-y-auto">
                <SkillsList skills={filteredSkills} selectedSkill={selectedSkill} onSelect={skill => { setSelectedSkill(skill); setDetailMode('view'); }} viewMode={viewMode} />
              </div>
            </div>

            {/* ── Drag Handle ─────────────────────────────────────── */}
            <div
              onMouseDown={onDragStart}
              className="w-1.5 flex-shrink-0 cursor-col-resize bg-transparent hover:bg-[#31D7DB]/40 active:bg-[#31D7DB]/60 transition-colors group relative"
              title="Drag to resize"
            >
              <div className="absolute inset-y-0 left-0 w-px bg-[#023F59]/20 group-hover:bg-[#31D7DB]/60 transition-colors" />
            </div>

            {/* ── Right Detail Panel ───────────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
              {selectedSkill ? (
                <>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#023F59]/10 bg-[#023F59]/3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl">{selectedSkill.emoji}</span>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate text-[#21262A]">{selectedSkill.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[selectedSkill.status]}`}>{STATUS_LABELS[selectedSkill.status]}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[selectedSkill.category]}`}>{selectedSkill.category}</span>
                          <span className="text-xs text-muted-foreground">{selectedSkill.type === 'custom' ? '🔧 Custom' : '🔒 System'}</span>
                          {selectedSkill.version && <Badge variant="outline" className="text-[10px] px-1.5 py-0">v{selectedSkill.version}</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant={detailMode === 'view' ? 'default' : 'outline'} size="sm" onClick={() => setDetailMode('view')} className={detailMode === 'view' ? 'bg-[#023F59] text-white' : ''}>
                        <BookOpen className="w-3.5 h-3.5 mr-1" />View
                      </Button>
                      <Button variant={detailMode === 'edit' ? 'default' : 'outline'} size="sm" onClick={() => setDetailMode('edit')} className={detailMode === 'edit' ? 'bg-[#023F59] text-white' : ''}>
                        <PenLine className="w-3.5 h-3.5 mr-1" />Edit
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    {detailMode === 'view'
                      ? <SkillViewer skill={selectedSkill} />
                      : <SkillEditor skill={selectedSkill} onSave={() => setDetailMode('view')} onCancel={() => setDetailMode('view')} />}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Select a skill to view details</div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Tracker Tab ─────────────────────────────────────────── */}
        <TabsContent value="tracker" className="mt-3">
          <SkillTracker stats={stats} skills={skills} />
        </TabsContent>
      </Tabs>

      {showAddModal && (
        <AddSkillModal
          onClose={() => setShowAddModal(false)}
          onCreated={skill => { setShowAddModal(false); setSelectedSkill(skill); setDetailMode('edit'); }}
        />
      )}
    </div>
  );
}
