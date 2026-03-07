import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  tab: string;
  tabLabel: string;
  icon: string;
}

interface MemoryResult {
  title: string;
  snippet: string;
}

interface GlobalSearchProps {
  onNavigate: (tab: string) => void;
  sessions?: Array<Record<string, unknown>>;
  cronJobs?: Array<Record<string, unknown>>;
}

function formatAge(ms: unknown): string {
  const n = Number(ms || 0);
  if (n < 60_000) return 'just now';
  if (n < 3_600_000) return `${Math.round(n / 60_000)}m ago`;
  if (n < 86_400_000) return `${Math.round(n / 3_600_000)}h ago`;
  return `${Math.round(n / 86_400_000)}d ago`;
}

export function GlobalSearch({ onNavigate, sessions, cronJobs }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [memoryResults, setMemoryResults] = useState<MemoryResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch memory on open
  useEffect(() => {
    if (!open) return;
    fetch('/api/search/memory?q=')
      .then(r => r.json())
      .then(d => setMemoryResults(d.results || []))
      .catch(() => { /* search failed — silent fallback */ });
  }, [open]);

  // Debounced memory re-fetch on query change
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      fetch(`/api/search/memory?q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(d => setMemoryResults(d.results || []))
        .catch(() => { /* search failed — silent fallback */ });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, open]);

  // Auto-focus input
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return { sessions: [], cron: [], memory: [] };
    const q = query.toLowerCase();

    return {
      sessions: (sessions || [])
        .filter(s =>
          String(s.key || '').toLowerCase().includes(q) ||
          String(s.channel || '').toLowerCase().includes(q) ||
          String(s.label || '').toLowerCase().includes(q) ||
          String(s.agent || '').toLowerCase().includes(q)
        )
        .slice(0, 4)
        .map(s => ({
          id: String(s.key || s.agent || ''),
          title: String(s.label || s.key || s.agent || 'Unknown session'),
          subtitle: `${s.channel || s.sessionType || 'unknown'} · ${formatAge(s.ageMs)}`,
          tab: 'sessions',
          tabLabel: 'Sessions',
          icon: '💬',
        })),

      cron: (cronJobs || [])
        .filter(j =>
          String(j.name || '').toLowerCase().includes(q) ||
          String(j.id || '').toLowerCase().includes(q) ||
          String(j.target || '').toLowerCase().includes(q)
        )
        .slice(0, 4)
        .map(j => ({
          id: String(j.id || j.name || ''),
          title: String(j.name || j.id || 'Unnamed job'),
          subtitle: String(j.schedule || 'scheduled'),
          tab: 'schedule',
          tabLabel: 'Schedule',
          icon: '⏰',
        })),

      memory: memoryResults
        .filter(r =>
          r.title?.toLowerCase().includes(q) ||
          r.snippet?.toLowerCase().includes(q)
        )
        .slice(0, 4)
        .map(r => ({
          id: r.title,
          title: r.title,
          subtitle: r.snippet,
          tab: 'memory',
          tabLabel: 'Memory',
          icon: '🧠',
        })),
    };
  }, [query, sessions, cronJobs, memoryResults]);

  const flatResults = useMemo(() => {
    return [
      ...searchResults.sessions,
      ...searchResults.cron,
      ...searchResults.memory,
    ];
  }, [searchResults]);

  const handleSelect = useCallback((result: SearchResult) => {
    setOpen(false);
    setQuery('');
    onNavigate(result.tab);
  }, [onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, flatResults.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && flatResults[activeIndex]) {
        handleSelect(flatResults[activeIndex]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, activeIndex, flatResults, handleSelect]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [flatResults.length]);

  const hasQuery = query.trim().length > 0;
  const hasResults = flatResults.length > 0;

  const renderCategory = (label: string, results: SearchResult[], startIndex: number) => {
    if (results.length === 0) return null;
    return (
      <div key={label}>
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
          {label}
        </div>
        {results.map((result, i) => {
          const globalIndex = startIndex + i;
          const isActive = globalIndex === activeIndex;
          return (
            <button
              key={result.id + i}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#F0F7FF] transition-colors ${isActive ? 'bg-[#F0F7FF]' : ''}`}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setActiveIndex(globalIndex)}
            >
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-sm">
                {result.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                <p className="text-xs text-gray-400 truncate">{result.subtitle}</p>
              </div>
              <span className="text-xs text-gray-300 shrink-0">{result.tabLabel}</span>
            </button>
          );
        })}
      </div>
    );
  };

  let runningIndex = 0;
  const sessionStart = runningIndex;
  runningIndex += searchResults.sessions.length;
  const cronStart = runningIndex;
  runningIndex += searchResults.cron.length;
  const memoryStart = runningIndex;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/20 text-sm text-muted-foreground bg-white hover:bg-gray-50 hover:border-primary/40 transition-all w-120"
      >
        <Search className="w-3.5 h-3.5 shrink-0" />
        <span className="flex-1 text-left">Search anything...</span>
        <kbd className="text-xs bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
      </button>

      {/* Search Overlay */}
      {open && (
        <div className="fixed inset-0 z-50" onClick={() => setOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Panel */}
          <div
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Search Input */}
              <div className="relative border-b border-gray-100">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search sessions, jobs, memory..."
                  className="w-full text-base px-4 py-3.5 pl-11 outline-none bg-transparent"
                />
              </div>

              {/* Results */}
              <div className="max-h-[420px] overflow-y-auto">
                {!hasQuery && (
                  <div className="px-4 py-3 text-center text-sm text-gray-400">
                    Start typing to search sessions, cron jobs, and memory...
                  </div>
                )}

                {hasQuery && !hasResults && (
                  <div className="px-4 py-12 text-center">
                    <p className="text-3xl mb-3">🔍</p>
                    <p className="text-sm font-medium text-gray-700">No results for &ldquo;{query}&rdquo;</p>
                    <p className="text-xs text-gray-400 mt-1">Try searching for a session channel, job name, or memory topic</p>
                  </div>
                )}

                {hasQuery && hasResults && (
                  <>
                    {renderCategory('Sessions', searchResults.sessions, sessionStart)}
                    {renderCategory('Cron Jobs', searchResults.cron, cronStart)}
                    {renderCategory('Memory', searchResults.memory, memoryStart)}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center gap-4 text-xs text-gray-400">
                <span><kbd className="bg-white border border-gray-200 rounded px-1 font-mono">↑↓</kbd> Navigate</span>
                <span><kbd className="bg-white border border-gray-200 rounded px-1 font-mono">↵</kbd> Open</span>
                <span><kbd className="bg-white border border-gray-200 rounded px-1 font-mono">Esc</kbd> Close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
