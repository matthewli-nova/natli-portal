// SkillsTab.tsx
// Main container for the Skills module — 3-panel layout
// Left: skill list sidebar | Right: detail view | Top: KPI strip + actions

import { useState, useMemo } from 'react';
import { Search, Plus, LayoutGrid, List, BookOpen, PenLine, BarChart3 } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { SkillsList } from './SkillsList';
import { SkillViewer } from './SkillViewer';
import { SkillEditor } from './SkillEditor';
import { SkillTracker } from './SkillTracker';
import { AddSkillModal } from './AddSkillModal';
import {
  ALL_SKILLS,
  SKILL_CATEGORIES,
  getSkillStats,
  type Skill,
  type SkillCategory,
  type SkillStatus,
  STATUS_COLORS,
  STATUS_LABELS,
  CATEGORY_COLORS,
} from './skills-data';
import { Card, CardContent } from '../ui/card';

type ViewMode = 'grid' | 'list';
type DetailMode = 'view' | 'edit';

export function SkillsTab() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');
  const [selectedType, setSelectedType] = useState<'all' | 'custom' | 'system'>('all');
  const [selectedStatus, setSelectedStatus] = useState<SkillStatus | 'all'>('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(ALL_SKILLS[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [detailMode, setDetailMode] = useState<DetailMode>('view');
  const [activeTab, setActiveTab] = useState<'skills' | 'tracker'>('skills');
  const [showAddModal, setShowAddModal] = useState(false);

  const stats = useMemo(() => getSkillStats(), []);

  const filteredSkills = useMemo(() => {
    return ALL_SKILLS.filter(skill => {
      const matchesSearch =
        search === '' ||
        skill.name.toLowerCase().includes(search.toLowerCase()) ||
        skill.description.toLowerCase().includes(search.toLowerCase()) ||
        skill.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        selectedCategory === 'All' || skill.category === selectedCategory;
      const matchesType =
        selectedType === 'all' || skill.type === selectedType;
      const matchesStatus =
        selectedStatus === 'all' || skill.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [search, selectedCategory, selectedType, selectedStatus]);

  return (
    <div className="space-y-4 min-w-0 w-full">

      {/* ── KPI Strip ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Skills', value: stats.total, sub: `${stats.totalCustom} custom · ${stats.totalSystem} system` },
          { label: 'Ready', value: stats.ready, sub: 'operational', accent: 'text-emerald-600' },
          { label: 'Needs Setup', value: stats.needsSetup, sub: 'action required', accent: 'text-amber-600' },
          { label: 'Contract Coverage', value: `${stats.contractCoverage}%`, sub: 'of custom skills', accent: stats.contractCoverage === 100 ? 'text-emerald-600' : 'text-amber-600' },
          { label: 'Most Used', value: stats.mostUsed[0]?.name ?? '—', sub: `${stats.mostUsed[0]?.usageCount ?? 0} uses` },
        ].map(kpi => (
          <Card key={kpi.label} className="p-3">
            <CardContent className="p-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{kpi.label}</p>
              <p className={`text-xl font-bold ${kpi.accent ?? ''}`}>{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Tab Toggle: Skills List | Tracker ─────────────────────────── */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'skills' | 'tracker')}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="skills" className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Tracker
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New Skill
          </Button>
        </div>

        {/* ── Skills Tab ─────────────────────────────────────────────── */}
        <TabsContent value="skills" className="mt-3">
          <div className="flex gap-4 min-h-[600px]">

            {/* ── Left Sidebar ─────────────────────────────────────── */}
            <div className="w-72 flex-shrink-0 flex flex-col gap-3">

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-2">
                {/* Type filter */}
                <div className="flex gap-1">
                  {(['all', 'custom', 'system'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`flex-1 text-xs py-1 px-2 rounded-md font-medium transition-colors ${
                        selectedType === t
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Status filter */}
                <div className="flex gap-1">
                  {([
                    { key: 'all', label: 'All' },
                    { key: 'ready', label: '✓ Ready' },
                    { key: 'needs-setup', label: '⚠ Setup' },
                  ] as const).map(s => (
                    <button
                      key={s.key}
                      onClick={() => setSelectedStatus(s.key)}
                      className={`flex-1 text-xs py-1 px-2 rounded-md font-medium transition-colors ${
                        selectedStatus === s.key
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Category chips */}
                <div className="flex flex-wrap gap-1">
                  {(['All', ...SKILL_CATEGORIES] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as SkillCategory | 'All')}
                      className={`text-xs py-0.5 px-2 rounded-full font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {cat === 'All' ? 'All' : cat === 'Infrastructure & Platform' ? 'Infra' : cat.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* View toggle */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded ${viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted/50'}`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded ${viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Skill List */}
              <div className="flex-1 overflow-y-auto">
                <SkillsList
                  skills={filteredSkills}
                  selectedSkill={selectedSkill}
                  onSelect={(skill) => {
                    setSelectedSkill(skill);
                    setDetailMode('view');
                  }}
                  viewMode={viewMode}
                />
              </div>
            </div>

            {/* ── Right Detail Panel ───────────────────────────────── */}
            <div className="flex-1 min-w-0 border rounded-lg overflow-hidden flex flex-col">
              {selectedSkill ? (
                <>
                  {/* Detail Panel Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl">{selectedSkill.emoji}</span>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">{selectedSkill.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[selectedSkill.status]}`}>
                            {STATUS_LABELS[selectedSkill.status]}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[selectedSkill.category]}`}>
                            {selectedSkill.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {selectedSkill.type === 'custom' ? '🔧 Custom' : '🔒 System'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* View / Edit toggle */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant={detailMode === 'view' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDetailMode('view')}
                        className="flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        View
                      </Button>
                      {selectedSkill.type === 'custom' && (
                        <Button
                          variant={detailMode === 'edit' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setDetailMode('edit')}
                          className="flex items-center gap-1"
                        >
                          <PenLine className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Detail Content */}
                  <div className="flex-1 overflow-auto">
                    {detailMode === 'view' ? (
                      <SkillViewer skill={selectedSkill} />
                    ) : (
                      <SkillEditor
                        skill={selectedSkill}
                        onSave={() => setDetailMode('view')}
                        onCancel={() => setDetailMode('view')}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  Select a skill to view details
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Tracker Tab ────────────────────────────────────────────── */}
        <TabsContent value="tracker" className="mt-3">
          <SkillTracker stats={stats} skills={ALL_SKILLS} />
        </TabsContent>
      </Tabs>

      {/* ── Add Skill Modal ─────────────────────────────────────────── */}
      {showAddModal && (
        <AddSkillModal
          onClose={() => setShowAddModal(false)}
          onCreated={(skill) => {
            setShowAddModal(false);
            setSelectedSkill(skill);
            setDetailMode('edit');
          }}
        />
      )}
    </div>
  );
}
