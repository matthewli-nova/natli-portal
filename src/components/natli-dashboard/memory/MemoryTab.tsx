import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import {
  Brain,
  Flame,
  CalendarDays,
  Archive,
  Database,
  Search,
  Clock,
  FileText,
  Hash,
  HardDrive,
  BookOpen,
  Trash2,
  RefreshCw,
  FileCode,
  X,
  Copy,
  CheckCheck,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────

interface MemoryTabProps {
  health: {
    memoryFiles: number;
    memoryChunks: number;
    memoryDirty: boolean;
    memoryDbPath: string;
    cacheEntries: number;
    vectorEnabled: boolean;
    ftsEnabled: boolean;
    memoryMdLines: number;
    memoryMdCap: number;
    memoryDailyLogs: number;
    memoryArchiveCount: number;
    memoryDbSizeMb: number;
    lastMemorySyncTime: string;
    p0Sections: number;
    p1Sections: number;
    p2Sections: number;
  } | null;
}

// ─── Helpers ────────────────────────────────────────────────

function capacityStatus(lines: number, cap: number) {
  const pct = cap ? Math.round((lines / cap) * 100) : 0;
  if (lines >= cap) return { label: 'AT CAP', color: 'bg-red-100 text-red-700', barClass: '[&>div]:bg-red-500', pct };
  if (lines >= cap * 0.9) return { label: 'NEAR CAP', color: 'bg-amber-100 text-amber-700', barClass: '[&>div]:bg-amber-500', pct };
  return { label: 'HEALTHY', color: 'bg-emerald-100 text-emerald-700', barClass: '[&>div]:bg-emerald-500', pct };
}

function formatSyncTime(iso: string | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Hong_Kong' });
  return isToday ? `Today at ${time} HKT` : d.toLocaleDateString('en-HK', { month: 'short', day: 'numeric', timeZone: 'Asia/Hong_Kong' }) + ` at ${time} HKT`;
}

function fmtNum(n: number): string {
  return n >= 1000 ? n.toLocaleString() : String(n);
}

// ─── Toast ──────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const show = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);
  return { toast, show };
}

function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-primary text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium">
        {message}
      </div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────

export function MemoryTab({ health }: MemoryTabProps) {
  const { toast, show: showToast } = useToast();

  const lines = health?.memoryMdLines ?? 0;
  const cap = health?.memoryMdCap ?? 150;
  const status = capacityStatus(lines, cap);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleJanitor = async () => {
    setActionLoading('janitor');
    try {
      const res = await fetch('/api/memory/janitor', { method: 'POST' });
      const data = await res.json() as { ok: boolean; output?: string; error?: string };
      showToast(data.ok ? '🧹 Janitor complete — expired entries archived' : `❌ ${data.error}`);
    } catch {
      showToast('❌ Janitor failed — check server');
    }
    setActionLoading(null);
  };

  const handleReindex = async () => {
    setActionLoading('reindex');
    try {
      const res = await fetch('/api/memory/reindex', { method: 'POST' });
      const data = await res.json() as { ok: boolean; output?: string; error?: string };
      showToast(data.ok ? '🔄 Reindex complete' : `❌ ${data.error}`);
    } catch {
      showToast('❌ Reindex failed — check server');
    }
    setActionLoading(null);
  };

  const [memoryDrawerOpen, setMemoryDrawerOpen] = useState(false);

  const handleOpenMemory = () => setMemoryDrawerOpen(true);

  return (
    <div className="space-y-5">
      <Toast message={toast} />
      {memoryDrawerOpen && (
        <MemoryFileDrawer onClose={() => setMemoryDrawerOpen(false)} />
      )}

      {/* ─── [A] MEMORY.md Capacity Hero Card ─────────────────── */}
      <Card className="border-primary/25 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#31D7DB] via-[#107DAC] to-[#023F59]" />
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Brain className="w-5 h-5 text-secondary" />
              <div>
                <span className="text-base font-bold text-foreground">MEMORY.md</span>
                <span className="text-xs text-muted-foreground ml-2">Hot Memory Layer</span>
              </div>
            </div>
            <Badge className={`${status.color} border-0 text-xs font-bold`}>{status.label}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{fmtNum(lines)} / {fmtNum(cap)} lines</span>
              <span className="font-semibold text-foreground">{status.pct}%</span>
            </div>
            <Progress
              value={cap ? (lines / cap) * 100 : 0}
              className={`h-3 ${status.barClass}`}
            />
          </div>

          <div className="flex gap-2 flex-wrap mt-4">
            <Badge className="bg-red-100 text-red-700 border-0 text-xs">P0: {health?.p0Sections ?? 0} sections</Badge>
            <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">P1: Active</Badge>
            <Badge className="bg-[#107DAC]/15 text-lepos-cyan-text border-0 text-xs">P2: Temp</Badge>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Janitor runs daily at 01:00 HKT · Auto-archives expired P1/P2 entries
          </p>
        </CardContent>
      </Card>

      {/* ─── [B] Three-Layer Memory System ────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Hot — MEMORY.md */}
        <Card className="border-primary/25 shadow-sm overflow-hidden">
          <div className="h-1.5 bg-secondary" />
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-secondary" />
              <span className="text-sm font-bold text-foreground">HOT</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground mb-3">MEMORY.md</p>
            <p className="text-3xl font-bold text-lepos-cyan-text mb-1">{fmtNum(lines)}<span className="text-sm font-normal text-muted-foreground ml-1">lines</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed">Auto-loaded every session. Core context for all conversations.</p>
            <div className="mt-3">
              <Badge className={`${status.color} border-0 text-[10px] font-bold`}>{status.label}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Daily Logs */}
        <Card className="border-primary/25 shadow-sm overflow-hidden">
          <div className="h-1.5 bg-[#107DAC]" />
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-4 h-4 text-lepos-cyan-text" />
              <span className="text-sm font-bold text-foreground">DAILY LOGS</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground mb-3">memory/YYYY-MM-DD.md</p>
            <p className="text-3xl font-bold text-lepos-cyan-text mb-1">{fmtNum(health?.memoryDailyLogs ?? 0)}<span className="text-sm font-normal text-muted-foreground ml-1">files</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed">Raw session notes & events. Today + yesterday always loaded.</p>
            <div className="mt-3">
              <Badge className="bg-[#107DAC]/10 text-lepos-cyan-text border-0 text-[10px] font-bold">ACTIVE</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Archive */}
        <Card className="border-primary/25 shadow-sm overflow-hidden">
          <div className="h-1.5 bg-primary" />
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Archive className="w-4 h-4 text-[#023F59]" />
              <span className="text-sm font-bold text-foreground">ARCHIVE</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground mb-3">memory/archive/</p>
            <p className="text-3xl font-bold text-lepos-cyan-text mb-1">{fmtNum(health?.memoryArchiveCount ?? 0)}<span className="text-sm font-normal text-muted-foreground ml-1">files</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed">Expired P1/P2 entries preserved. On-demand via memory_search.</p>
            <div className="mt-3">
              <Badge className="bg-primary/10 text-[#023F59] border-0 text-[10px] font-bold">COLD STORAGE</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── [C] Knowledge Base + Search Engine ───────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Knowledge Base */}
        <Card className="border-primary/25 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-secondary" />
              <span className="text-sm font-bold text-foreground">Knowledge Base</span>
              {health?.memoryDirty && (
                <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-bold ml-auto">
                  Index outdated — reindex recommended
                </Badge>
              )}
            </div>
            <div className="space-y-0">
              <StatRow icon={<FileText className="w-3.5 h-3.5 text-lepos-cyan-text" />} label="Files indexed" value={fmtNum(health?.memoryFiles ?? 0)} />
              <Separator className="my-2 bg-primary/10" />
              <StatRow icon={<Hash className="w-3.5 h-3.5 text-lepos-cyan-text" />} label="Chunks" value={fmtNum(health?.memoryChunks ?? 0)} />
              <Separator className="my-2 bg-primary/10" />
              <StatRow icon={<Database className="w-3.5 h-3.5 text-lepos-cyan-text" />} label="Cache entries" value={fmtNum(health?.cacheEntries ?? 0)} />
              <Separator className="my-2 bg-primary/10" />
              <StatRow icon={<HardDrive className="w-3.5 h-3.5 text-lepos-cyan-text" />} label="Database size" value={`${health?.memoryDbSizeMb ?? 0} MB`} />
            </div>
          </CardContent>
        </Card>

        {/* Search Engine */}
        <Card className="border-primary/25 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-secondary" />
              <span className="text-sm font-bold text-foreground">Search Engine</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Vector Search</p>
                  <p className="text-xs text-muted-foreground">768-dim · nomic-embed-text</p>
                </div>
                <Badge className={`text-xs font-bold border-0 ${health?.vectorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {health?.vectorEnabled ? '✅ Ready' : '❌ Offline'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Full-text Search</p>
                  <p className="text-xs text-muted-foreground">FTS5 index</p>
                </div>
                <Badge className={`text-xs font-bold border-0 ${health?.ftsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {health?.ftsEnabled ? '✅ Ready' : '❌ Offline'}
                </Badge>
              </div>

              <Separator className="bg-primary/10" />

              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-lepos-cyan-text" />
                <span className="text-sm text-foreground">Last sync: </span>
                <span className="text-sm font-mono text-lepos-cyan-text">{formatSyncTime(health?.lastMemorySyncTime)}</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Hybrid: 75% vector + 25% BM25 · MMR (λ=0.7) · Temporal decay
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── [D] Quick Actions ────────────────────────────────── */}
      <Card className="border-primary/25 shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary hover:text-white text-sm"
              onClick={handleJanitor}
              disabled={actionLoading === 'janitor'}
            >
              {actionLoading === 'janitor'
                ? <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                : <Trash2 className="w-4 h-4 mr-1.5" />}
              {actionLoading === 'janitor' ? 'Running…' : 'Run Janitor'}
            </Button>
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary hover:text-white text-sm"
              onClick={handleReindex}
              disabled={actionLoading === 'reindex'}
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${actionLoading === 'reindex' ? 'animate-spin' : ''}`} />
              {actionLoading === 'reindex' ? 'Reindexing…' : 'Force Reindex'}
            </Button>
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary hover:text-white text-sm"
              onClick={handleOpenMemory}
            >
              <FileCode className="w-4 h-4 mr-1.5" />
              View MEMORY.md
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

// ─── Memory File Drawer ──────────────────────────────────────

function MemoryFileDrawer({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedLines, setSavedLines] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/memory/file')
      .then(r => r.json() as Promise<{ ok: boolean; content?: string; error?: string }>)
      .then(d => {
        if (d.ok && d.content) { setContent(d.content); setEditContent(d.content); }
        else setError(d.error ?? 'Failed to load');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    const src = editing ? editContent : (content ?? '');
    if (!src) return;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(src).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
      } else {
        const ta = document.createElement('textarea');
        ta.value = src; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      }
    } catch { /* ignore */ }
  };

  const handleEdit = () => { setEditContent(content ?? ''); setEditing(true); setSaveError(''); };
  const handleCancel = () => { setEditing(false); setSaveError(''); };

  const handleSave = async () => {
    setSaving(true); setSaveError('');
    try {
      const res = await fetch('/api/memory/file', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      const data = await res.json() as { ok: boolean; lines?: number; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Save failed');
      setContent(editContent);
      setSavedLines(data.lines ?? null);
      setEditing(false);
      setTimeout(() => setSavedLines(null), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Unknown error');
    }
    setSaving(false);
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !editing) onClose();
  };

  const displayContent = editing ? editContent : (content ?? '');
  const lines = displayContent.split('\n').length;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onMouseDown={handleBackdrop}>
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-primary/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-lepos-cyan-text" />
            <div>
              <p className="font-semibold text-foreground text-sm">MEMORY.md {editing && <span className="text-amber-500 text-xs font-normal ml-1">— Editing</span>}</p>
              <p className="text-[10px] text-muted-foreground font-mono">/Users/natlee/.hermes/memories/MEMORY.md</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge className={`border-0 text-xs ${lines >= 145 ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-[#023F59]'}`}>
              {lines} lines
            </Badge>
            {savedLines !== null && (
              <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">✓ Saved ({savedLines} lines)</Badge>
            )}
            {!editing && (
              <button onClick={handleCopy} disabled={!content}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-lepos-cyan-text px-2 py-1 rounded hover:bg-primary/5 transition-colors disabled:opacity-40">
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
            {!editing && content && (
              <button onClick={handleEdit}
                className="flex items-center gap-1 text-xs text-lepos-cyan-text hover:text-[#023F59] px-2 py-1 rounded hover:bg-primary/5 transition-colors font-medium">
                <FileCode className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
            {!editing && (
              <button onClick={onClose} className="p-1.5 rounded hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Save error */}
        {saveError && (
          <div className="mx-5 mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 shrink-0">
            ❌ {saveError}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-3 bg-primary/5 rounded" style={{ width: `${60 + (i * 7) % 35}%` }} />
              ))}
            </div>
          )}
          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">❌ {error}</div>}
          {!loading && !error && editing && (
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full h-full min-h-[500px] text-xs font-mono text-foreground leading-relaxed resize-none border border-primary/20 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#107DAC] bg-primary/[0.02]"
              spellCheck={false}
            />
          )}
          {!loading && !error && !editing && content && (
            <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-words">{content}</pre>
          )}
        </div>

        {/* Edit footer */}
        {editing && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-primary/10 shrink-0 bg-primary/[0.02]">
            <p className="text-[10px] text-muted-foreground">⚠ A backup (.bak) is created before saving.</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} className="border-primary/20" disabled={saving}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="bg-primary text-white hover:bg-[#022F44]">
                {saving ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : null}
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
