import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Plus, List, LayoutGrid, BookOpen, RefreshCw, ArrowUpDown } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import {
  type Skill,
  STATUS_COLORS,
  STATUS_LABELS,
  CATEGORY_COLORS,
} from './skills-data';

// Dynamic category color fallback for any category returned by the API
const CAT_PALETTE: Record<string, string> = {
  'Google Workspace': 'bg-blue-100 text-blue-900',
  'Productivity': 'bg-emerald-100 text-emerald-900',
  'Research': 'bg-purple-100 text-purple-900',
  'Communication': 'bg-rose-100 text-rose-900',
  'Media': 'bg-slate-100 text-slate-900',
  'Development': 'bg-orange-100 text-orange-900',
  'Security': 'bg-amber-100 text-amber-900',
  'Custom': 'bg-indigo-100 text-indigo-900',
  'System': 'bg-gray-100 text-gray-700',
};
function getCatColor(cat: string): string {
  return CAT_PALETTE[cat] ?? 'bg-gray-100 text-gray-700';
}

export function SkillsTab() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'type'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liveSkills, setLiveSkills] = useState<Skill[]>([]);
  const [apiStats, setApiStats] = useState({ total: 0, custom: 0, system: 0, ready: 0 });

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // API returns { skills: [...], stats: {...} }
      const skills: Skill[] = (data.skills || []).map((s: Record<string, unknown>) => ({
        id: s.id as string,
        name: s.name as string,
        emoji: (s.emoji as string) || '🛠️',
        description: (s.description as string) || '',
        path: (s.path as string) || '',
        type: (s.type as 'custom' | 'system') || 'system',
        category: (s.category as string) || (s.type === 'custom' ? 'Custom' : 'System'),
        status: (s.status as 'ready' | 'needs-setup' | 'disabled') || 'ready',
        tags: (s.tags as string[]) || [],
        hasContract: Boolean(s.hasContract),
        version: s.version as string | undefined,
        addedDate: s.addedDate as string | undefined,
        pricing: s.pricing as string | undefined,
        usageCount: s.usageCount as number | undefined,
      }));
      setLiveSkills(skills);
      const stats = data.stats || {};
      setApiStats({
        total: stats.total || skills.length,
        custom: stats.custom || skills.filter((s: Skill) => s.type === 'custom').length,
        system: stats.system || skills.filter((s: Skill) => s.type === 'system').length,
        ready: stats.ready || skills.filter((s: Skill) => s.status === 'ready').length,
      });
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  // Derive categories dynamically from live data
  const dynamicCategories = useMemo(() => {
    const cats = [...new Set(liveSkills.map(s => s.category))].sort();
    return cats;
  }, [liveSkills]);

  const stats = useMemo(() => ({
    total: apiStats.total,
    ready: apiStats.ready,
    custom: apiStats.custom,
    system: apiStats.system,
    mostUsed: [...liveSkills].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, 3),
  }), [apiStats, liveSkills]);

  const filteredSkills = useMemo(() => {
    return liveSkills.filter(skill => {
      const q = search.toLowerCase();
      const matchesSearch = !search ||
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.id.toLowerCase().includes(q) ||
        skill.tags.some(t => t.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'category') cmp = a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      else if (sortBy === 'type') cmp = a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [liveSkills, search, selectedCategory, sortBy, sortDir]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSkills();
    setRefreshing(false);
  }, [fetchSkills]);

  const toggleSort = (s: typeof sortBy) => {
    if (sortBy === s) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortBy(s); setSortDir('asc'); }
  };

  return (
    <div className="space-y-6">
      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center text-muted-foreground text-sm animate-pulse">Loading skills from filesystem...</div>
      )}

      {!loading && (
      <>
      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIBox label="Total Skills" value={stats.total} />
        <KPIBox label="Custom Skills" value={stats.custom} color="text-indigo-600" />
        <KPIBox label="System Skills" value={stats.system} color="text-gray-600" />
        <KPIBox label="Ready" value={stats.ready} color="text-emerald-600" />
      </div>

      {/* Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills by name or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-10 border-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-1 bg-muted p-1 rounded-lg max-w-3xl">
            {(['All', ...dynamicCategories]).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  selectedCategory === cat ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat === 'Google Workspace' ? 'Workspace' : cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex border rounded-lg bg-background p-1">
             <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}><List size={18} /></button>
             <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}><LayoutGrid size={18} /></button>
           </div>
           <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
             <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} /> Sync
           </Button>
           <Button size="sm" className="bg-primary hover:bg-primary/90 text-white"><Plus className="w-4 h-4 mr-2" /> New Skill</Button>
        </div>
      </div>

      {/* Sorting Tabs */}
      <div className="flex gap-2">
         <span className="text-xs font-bold text-muted-foreground uppercase py-2">Sort by:</span>
         <SortButton active={sortBy === 'name'} onClick={() => toggleSort('name')} label="Name" dir={sortBy === 'name' ? sortDir : null} />
         <SortButton active={sortBy === 'category'} onClick={() => toggleSort('category')} label="Category" dir={sortBy === 'category' ? sortDir : null} />
         <SortButton active={sortBy === 'type'} onClick={() => toggleSort('type')} label="Type" dir={sortBy === 'type' ? sortDir : null} />
      </div>

      {/* Skills View */}
      {viewMode === 'list' ? (
        <Card className="border-primary/10 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-primary/10">
              <tr className="text-left text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                <th className="px-6 py-4">Skill Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Pricing</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredSkills.map(skill => (
                <tr key={skill.id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{skill.emoji}</span>
                      <div>
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors underline decoration-transparent group-hover:decoration-primary/30 decoration-2 underline-offset-4">{skill.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{skill.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary" className={`text-[10px] font-bold border-0 ${getCatColor(skill.category)}`}>
                      {skill.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{skill.description}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-primary font-semibold">
                    {skill.pricing || 'Free'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge className={`text-[10px] uppercase font-black border-0 ${STATUS_COLORS[skill.status]}`}>
                      {STATUS_LABELS[skill.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {filteredSkills.map(skill => (
             <SkillCard key={skill.id} skill={skill} />
           ))}
        </div>
      )}

      {filteredSkills.length === 0 && !loading && (
        <div className="py-20 text-center text-muted-foreground bg-muted/20 border-2 border-dashed rounded-xl">
           <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
           <p className="font-bold">No skills matching "{search}" in {selectedCategory}</p>
           <button onClick={() => { setSearch(''); setSelectedCategory('All'); }} className="text-primary hover:underline mt-2 text-sm font-bold">Clear all filters</button>
        </div>
      )}
      </>
      )}
    </div>
  );
}

function KPIBox({ label, value, color = 'text-primary' }: { label: string; value: string | number; color?: string }) {
  return (
    <Card className="border-primary/10 bg-background shadow-xs">
      <CardContent className="p-4">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function SortButton({ active, onClick, label, dir }: { active: boolean; onClick: () => void; label: string; dir: 'asc' | 'desc' | null }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1 ${
        active ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-muted text-muted-foreground hover:bg-muted/50'
      }`}
    >
      {label}
      {dir && <ArrowUpDown className={`inline w-3 h-3 ${dir === 'desc' ? 'rotate-180' : ''}`} />}
    </button>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card className="border-primary/10 hover:border-primary/30 transition-all hover:shadow-md group overflow-hidden bg-background">
       <CardContent className="p-5">
         <div className="flex justify-between items-start mb-3">
           <div className="text-4xl">{skill.emoji}</div>
           <Badge className={`text-[10px] uppercase font-bold border-0 ${STATUS_COLORS[skill.status]}`}>
             {STATUS_LABELS[skill.status]}
           </Badge>
         </div>
         <h4 className="font-black text-foreground group-hover:text-primary transition-colors text-lg">{skill.name}</h4>
         <p className="text-xs mb-1"><span className={`inline px-1.5 py-0.5 rounded text-[10px] font-bold ${getCatColor(skill.category)}`}>{skill.category}</span></p>
         <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{skill.description}</p>
         <div className="flex flex-wrap gap-2 mt-auto">
           {skill.tags.map(tag => (
             <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold text-muted-foreground">#{tag}</span>
           ))}
         </div>
         <div className="flex items-center justify-between mt-5 pt-4 border-t border-primary/5">
            <span className="text-xs font-mono font-bold text-primary">{skill.pricing || 'Free'}</span>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-black uppercase text-muted-foreground hover:text-primary">
              Details →
            </Button>
         </div>
       </CardContent>
    </Card>
  );
}
