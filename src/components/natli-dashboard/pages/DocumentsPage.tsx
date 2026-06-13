// DocumentsPage — workspace document manager.
// Browses the Hermes Claw workspace via /api/files and previews text content
// via /api/files/content (server restricts access to the workspace dir).

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FolderOpen, Folder, FileText, FileCode2, FileSpreadsheet, FileJson, File as FileIcon,
  ChevronRight, Home, RefreshCw, Search, Copy, Check, Loader2, ArrowUp, Download,
} from 'lucide-react';
import { PortalPage, StatCard, EmptyState } from '../../../lib/portal-ui';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { cn } from '../../ui/utils';
import { toast } from 'sonner';

interface FileEntry {
  name: string;
  type: 'directory' | 'file';
  path: string;
}

function fileIcon(name: string, type: 'directory' | 'file') {
  if (type === 'directory') return Folder;
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['md', 'txt', 'rtf'].includes(ext)) return FileText;
  if (['ts', 'tsx', 'js', 'jsx', 'py', 'sh', 'go', 'rs', 'json5'].includes(ext)) return FileCode2;
  if (['json'].includes(ext)) return FileJson;
  if (['csv', 'xlsx', 'xls'].includes(ext)) return FileSpreadsheet;
  return FileIcon;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function DocumentsPage() {
  const [rootPath, setRootPath] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const [selected, setSelected] = useState<FileEntry | null>(null);
  const [content, setContent] = useState<string>('');
  const [fileSize, setFileSize] = useState(0);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadDir = useCallback(async (path?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = path ? `/api/files?path=${encodeURIComponent(path)}` : '/api/files';
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to read directory');
      const list: FileEntry[] = (data.files ?? []).sort((a: FileEntry, b: FileEntry) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      setEntries(list);
      setCurrentPath(data.path);
      setRootPath((prev) => prev ?? data.path);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to read directory');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDir(); }, [loadDir]);

  const openFile = useCallback(async (file: FileEntry) => {
    setSelected(file);
    setFileLoading(true);
    setFileError(null);
    setContent('');
    try {
      const res = await fetch(`/api/files/content?path=${encodeURIComponent(file.path)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to read file');
      setContent(data.content ?? '');
      setFileSize(data.size ?? 0);
    } catch (e) {
      setFileError(e instanceof Error ? e.message : 'Failed to read file');
    } finally {
      setFileLoading(false);
    }
  }, []);

  const handleEntryClick = (entry: FileEntry) => {
    if (entry.type === 'directory') loadDir(entry.path);
    else openFile(entry);
  };

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { toast.error('Copy failed'); }
  };

  // Breadcrumb segments relative to the workspace root
  const crumbs = useMemo(() => {
    if (!rootPath || !currentPath) return [];
    const rel = currentPath.startsWith(rootPath) ? currentPath.slice(rootPath.length) : '';
    const parts = rel.split('/').filter(Boolean);
    const out: { label: string; path: string }[] = [];
    let acc = rootPath;
    for (const p of parts) { acc = `${acc}/${p}`; out.push({ label: p, path: acc }); }
    return out;
  }, [rootPath, currentPath]);

  const parentPath = useMemo(() => {
    if (!rootPath || !currentPath || currentPath === rootPath) return null;
    const idx = currentPath.lastIndexOf('/');
    const parent = idx > 0 ? currentPath.slice(0, idx) : rootPath;
    return parent.length >= rootPath.length ? parent : rootPath;
  }, [rootPath, currentPath]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.name.toLowerCase().includes(q));
  }, [entries, query]);

  const folderCount = entries.filter((e) => e.type === 'directory').length;
  const fileCount = entries.filter((e) => e.type === 'file').length;

  return (
    <PortalPage
      icon={FolderOpen}
      title="Documents"
      subtitle="Browse and preview files in the Hermes Claw workspace"
      actions={
        <Button variant="outline" size="sm" onClick={() => loadDir(currentPath ?? undefined)} disabled={loading}
          className="border-primary/30 hover:bg-primary hover:text-white">
          <RefreshCw className={cn('mr-1.5 h-3.5 w-3.5', loading && 'animate-spin')} />
          Refresh
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={Folder} label="Folders" value={folderCount} accent="amber" sub="in current directory" />
        <StatCard icon={FileText} label="Files" value={fileCount} accent="cyan" sub="in current directory" />
        <StatCard icon={Home} label="Location" value={crumbs.length ? crumbs[crumbs.length - 1].label : 'workspace'} accent="violet" sub="current folder" />
      </div>

      {/* Breadcrumb + search bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2">
        <button onClick={() => loadDir()} className="flex items-center gap-1 rounded-md px-1.5 py-1 text-sm text-muted-foreground hover:text-lepos-cyan-text">
          <Home className="h-3.5 w-3.5" /> workspace
        </button>
        {crumbs.map((c) => (
          <span key={c.path} className="flex items-center gap-2">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            <button onClick={() => loadDir(c.path)} className="rounded-md px-1.5 py-1 text-sm text-foreground hover:text-lepos-cyan-text">
              {c.label}
            </button>
          </span>
        ))}
        <div className="relative ml-auto w-full sm:w-56">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter this folder…"
            className="h-8 border-primary/20 pl-8 text-sm focus-visible:ring-secondary/30" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* File list */}
        <div className="rounded-xl border border-border bg-card elevation-1">
          <div className="max-h-[560px] overflow-y-auto scroll-slim p-1.5">
            {parentPath && (
              <button onClick={() => loadDir(parentPath)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-muted-foreground hover:bg-secondary/10">
                <ArrowUp className="h-4 w-4" /> ..
              </button>
            )}
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : error ? (
              <EmptyState icon={FolderOpen} title="Couldn't load this folder" description={error} />
            ) : filtered.length === 0 ? (
              <EmptyState icon={FolderOpen} title={query ? 'No matches' : 'Empty folder'} description={query ? 'Try a different filter.' : 'This directory has no files.'} />
            ) : (
              filtered.map((entry) => {
                const Icon = fileIcon(entry.name, entry.type);
                const isSel = selected?.path === entry.path && entry.type === 'file';
                return (
                  <button
                    key={entry.path}
                    onClick={() => handleEntryClick(entry)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                      isSel ? 'bg-secondary/15 text-foreground ring-1 ring-secondary/30' : 'hover:bg-secondary/10 text-foreground',
                    )}
                  >
                    <Icon className={cn('h-4 w-4 shrink-0', entry.type === 'directory' ? 'text-amber-500' : 'text-lepos-cyan-text')} />
                    <span className="truncate">{entry.name}</span>
                    {entry.type === 'directory' && <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/50" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Preview pane */}
        <div className="flex min-h-[300px] flex-col rounded-xl border border-border bg-card elevation-1">
          {!selected ? (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState icon={FileText} title="No file selected" description="Choose a file from the list to preview its contents." className="border-0 bg-transparent" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-lepos-cyan-text" />
                  <span className="truncate text-sm font-semibold text-foreground">{selected.name}</span>
                  {fileSize > 0 && <span className="shrink-0 text-xs text-muted-foreground">· {formatBytes(fileSize)}</span>}
                </div>
                <Button variant="ghost" size="sm" onClick={copyContent} disabled={!content} className="h-7 text-xs">
                  {copied ? <Check className="mr-1 h-3.5 w-3.5 text-emerald-500" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="flex-1 overflow-auto scroll-slim p-4">
                {fileLoading ? (
                  <div className="flex items-center justify-center py-16 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>
                ) : fileError ? (
                  <EmptyState icon={Download} title="Preview unavailable" description={fileError} className="border-0 bg-transparent" />
                ) : (
                  <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground/90">{content}</pre>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </PortalPage>
  );
}
