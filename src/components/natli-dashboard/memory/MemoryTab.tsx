import { useState, useCallback } from 'react';
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
  FolderOpen,
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
      <div className="bg-[#023F59] text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium">
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

  const handleOpenMemory = () => {
    const memPath = '/Users/natlee/.openclaw/workspace/MEMORY.md';
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(memPath).then(() => showToast('📂 Path copied to clipboard'));
      } else {
        const ta = document.createElement('textarea');
        ta.value = memPath;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('📂 Path copied to clipboard');
      }
    } catch {
      showToast(`📂 ${memPath}`);
    }
  };

  return (
    <div className="space-y-5">
      <Toast message={toast} />

      {/* ─── [A] MEMORY.md Capacity Hero Card ─────────────────── */}
      <Card className="border-[#023F59]/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#31D7DB] via-[#107DAC] to-[#023F59]" />
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Brain className="w-5 h-5 text-[#31D7DB]" />
              <div>
                <span className="text-base font-bold text-[#21262A]">MEMORY.md</span>
                <span className="text-xs text-muted-foreground ml-2">Hot Memory Layer</span>
              </div>
            </div>
            <Badge className={`${status.color} border-0 text-xs font-bold`}>{status.label}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{fmtNum(lines)} / {fmtNum(cap)} lines</span>
              <span className="font-semibold text-[#21262A]">{status.pct}%</span>
            </div>
            <Progress
              value={cap ? (lines / cap) * 100 : 0}
              className={`h-3 ${status.barClass}`}
            />
          </div>

          <div className="flex gap-2 flex-wrap mt-4">
            <Badge className="bg-red-100 text-red-700 border-0 text-xs">P0: {health?.p0Sections ?? 0} sections</Badge>
            <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">P1: Active</Badge>
            <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">P2: Temp</Badge>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Janitor runs daily at 01:00 HKT · Auto-archives expired P1/P2 entries
          </p>
        </CardContent>
      </Card>

      {/* ─── [B] Three-Layer Memory System ────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Hot — MEMORY.md */}
        <Card className="border-[#023F59]/20 overflow-hidden">
          <div className="h-1.5 bg-[#31D7DB]" />
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-[#31D7DB]" />
              <span className="text-sm font-bold text-[#21262A]">HOT</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground mb-3">MEMORY.md</p>
            <p className="text-3xl font-bold text-[#107DAC] mb-1">{fmtNum(lines)}<span className="text-sm font-normal text-muted-foreground ml-1">lines</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed">Auto-loaded every session. Core context for all conversations.</p>
            <div className="mt-3">
              <Badge className={`${status.color} border-0 text-[10px] font-bold`}>{status.label}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Daily Logs */}
        <Card className="border-[#023F59]/20 overflow-hidden">
          <div className="h-1.5 bg-[#107DAC]" />
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-4 h-4 text-[#107DAC]" />
              <span className="text-sm font-bold text-[#21262A]">DAILY LOGS</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground mb-3">memory/YYYY-MM-DD.md</p>
            <p className="text-3xl font-bold text-[#107DAC] mb-1">{fmtNum(health?.memoryDailyLogs ?? 0)}<span className="text-sm font-normal text-muted-foreground ml-1">files</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed">Raw session notes & events. Today + yesterday always loaded.</p>
            <div className="mt-3">
              <Badge className="bg-[#107DAC]/10 text-[#107DAC] border-0 text-[10px] font-bold">ACTIVE</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Archive */}
        <Card className="border-[#023F59]/20 overflow-hidden">
          <div className="h-1.5 bg-[#023F59]" />
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Archive className="w-4 h-4 text-[#023F59]" />
              <span className="text-sm font-bold text-[#21262A]">ARCHIVE</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground mb-3">memory/archive/</p>
            <p className="text-3xl font-bold text-[#107DAC] mb-1">{fmtNum(health?.memoryArchiveCount ?? 0)}<span className="text-sm font-normal text-muted-foreground ml-1">files</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed">Expired P1/P2 entries preserved. On-demand via memory_search.</p>
            <div className="mt-3">
              <Badge className="bg-[#023F59]/10 text-[#023F59] border-0 text-[10px] font-bold">COLD STORAGE</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── [C] Knowledge Base + Search Engine ───────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Knowledge Base */}
        <Card className="border-[#023F59]/20">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-[#31D7DB]" />
              <span className="text-sm font-bold text-[#21262A]">Knowledge Base</span>
              {health?.memoryDirty && (
                <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-bold ml-auto">
                  Index outdated — reindex recommended
                </Badge>
              )}
            </div>
            <div className="space-y-0">
              <StatRow icon={<FileText className="w-3.5 h-3.5 text-[#107DAC]" />} label="Files indexed" value={fmtNum(health?.memoryFiles ?? 0)} />
              <Separator className="my-2 bg-[#023F59]/10" />
              <StatRow icon={<Hash className="w-3.5 h-3.5 text-[#107DAC]" />} label="Chunks" value={fmtNum(health?.memoryChunks ?? 0)} />
              <Separator className="my-2 bg-[#023F59]/10" />
              <StatRow icon={<Database className="w-3.5 h-3.5 text-[#107DAC]" />} label="Cache entries" value={fmtNum(health?.cacheEntries ?? 0)} />
              <Separator className="my-2 bg-[#023F59]/10" />
              <StatRow icon={<HardDrive className="w-3.5 h-3.5 text-[#107DAC]" />} label="Database size" value={`${health?.memoryDbSizeMb ?? 0} MB`} />
            </div>
          </CardContent>
        </Card>

        {/* Search Engine */}
        <Card className="border-[#023F59]/20">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-[#31D7DB]" />
              <span className="text-sm font-bold text-[#21262A]">Search Engine</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#21262A]">Vector Search</p>
                  <p className="text-xs text-muted-foreground">768-dim · nomic-embed-text</p>
                </div>
                <Badge className={`text-xs font-bold border-0 ${health?.vectorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {health?.vectorEnabled ? '✅ Ready' : '❌ Offline'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#21262A]">Full-text Search</p>
                  <p className="text-xs text-muted-foreground">FTS5 index</p>
                </div>
                <Badge className={`text-xs font-bold border-0 ${health?.ftsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {health?.ftsEnabled ? '✅ Ready' : '❌ Offline'}
                </Badge>
              </div>

              <Separator className="bg-[#023F59]/10" />

              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#107DAC]" />
                <span className="text-sm text-[#21262A]">Last sync: </span>
                <span className="text-sm font-mono text-[#107DAC]">{formatSyncTime(health?.lastMemorySyncTime)}</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Hybrid: 75% vector + 25% BM25 · MMR (λ=0.7) · Temporal decay
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── [D] Quick Actions ────────────────────────────────── */}
      <Card className="border-[#023F59]/20">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-[#023F59]/30 hover:bg-[#023F59] hover:text-white text-sm"
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
              className="border-[#023F59]/30 hover:bg-[#023F59] hover:text-white text-sm"
              onClick={handleReindex}
              disabled={actionLoading === 'reindex'}
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${actionLoading === 'reindex' ? 'animate-spin' : ''}`} />
              {actionLoading === 'reindex' ? 'Reindexing…' : 'Force Reindex'}
            </Button>
            <Button
              variant="outline"
              className="border-[#023F59]/30 hover:bg-[#023F59] hover:text-white text-sm"
              onClick={handleOpenMemory}
            >
              <FolderOpen className="w-4 h-4 mr-1.5" />
              Open Memory File
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
      <span className="text-sm font-semibold text-[#21262A]">{value}</span>
    </div>
  );
}
