import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, Check, FileText, Folder, FolderOpen, RefreshCw, Save, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';

type WikiNode = {
  name: string;
  path: string;
  type: 'directory' | 'file';
  children?: WikiNode[];
  size?: number;
  modifiedAt?: string;
};

type WikiTreeResponse = {
  root: string;
  folders: string[];
  tree: WikiNode[];
  seeded: boolean;
};

type WikiFileResponse = {
  path: string;
  name: string;
  content: string;
  modifiedAt: string;
  size: number;
};

const ROOT_FOLDERS = ['NOVA', 'vbiz', 'Lepōs', 'Nat', 'Personal Development'];

async function wikiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? 'Wiki request failed');
  return data as T;
}

function flattenFiles(nodes: WikiNode[], folder: string): WikiNode[] {
  const root = nodes.find(node => node.name === folder);
  if (!root?.children) return [];
  const files: WikiNode[] = [];
  const walk = (children: WikiNode[]) => {
    for (const child of children) {
      if (child.type === 'file') files.push(child);
      if (child.children) walk(child.children);
    }
  };
  walk(root.children);
  return files.sort((a, b) => a.name.localeCompare(b.name));
}

function formatDate(value?: string) {
  if (!value) return 'Never';
  return new Date(value).toLocaleString('en-HK', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Hong_Kong',
  });
}

function displayPath(path: string): string {
  return path.replace('/Users/natlee/.openclaw/workspace', '/Users/natlee/.hermes');
}

function displayContent(content: string): string {
  return content
    .replace(/OpenClaw/g, 'Hermes Claw')
    .replace(/openclaw/g, 'hermes')
    .replace(/\.openclaw/g, '.hermes');
}

export function WikiTab() {
  const [tree, setTree] = useState<WikiTreeResponse | null>(null);
  const [activeFolder, setActiveFolder] = useState(ROOT_FOLDERS[0]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [file, setFile] = useState<WikiFileResponse | null>(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const files = useMemo(() => flattenFiles(tree?.tree ?? [], activeFolder), [tree, activeFolder]);
  const isDirty = file ? draft !== file.content : false;

  const loadTree = useCallback(async (preferredPath?: string | null) => {
    setLoading(true);
    try {
      const data = await wikiFetch<WikiTreeResponse>('/api/wiki/tree');
      setTree(data);
      const nextFiles = flattenFiles(data.tree, activeFolder);
      const nextPath = preferredPath ?? activePath ?? nextFiles[0]?.path ?? null;
      setActivePath(nextPath);
      setStatus(null);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unable to load wiki');
    } finally {
      setLoading(false);
    }
  }, [activeFolder, activePath]);

  const loadFile = useCallback(async (path: string) => {
    try {
      const data = await wikiFetch<WikiFileResponse>(`/api/wiki/file?path=${encodeURIComponent(path)}`);
      const content = displayContent(data.content);
      setFile({ ...data, content });
      setDraft(content);
      setStatus(null);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unable to read wiki file');
    }
  }, []);

  useEffect(() => { loadTree(); }, []);

  useEffect(() => {
    if (activePath) loadFile(activePath);
    else {
      setFile(null);
      setDraft('');
    }
  }, [activePath, loadFile]);

  useEffect(() => {
    const next = files[0]?.path ?? null;
    if (!files.some(item => item.path === activePath)) setActivePath(next);
  }, [activeFolder, activePath, files]);

  const handleBootstrap = async () => {
    setBootstrapping(true);
    try {
      const data = await wikiFetch<{ ok: boolean; created: string[]; root: string }>('/api/wiki/bootstrap', { method: 'POST' });
      setStatus(data.created.length ? `Seeded ${data.created.length} wiki item${data.created.length === 1 ? '' : 's'}` : 'Wiki structure already current');
      await loadTree(activePath);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Bootstrap failed');
    } finally {
      setBootstrapping(false);
    }
  };

  const handleSave = async () => {
    if (!file) return;
    setSaving(true);
    try {
      const data = await wikiFetch<WikiFileResponse>('/api/wiki/file', {
        method: 'PUT',
        body: JSON.stringify({ path: file.path, content: draft }),
      });
      const content = displayContent(data.content);
      setFile({ ...data, content });
      setDraft(content);
      setStatus('Saved to disk');
      await loadTree(data.path);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-primary/25 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#31D7DB] via-[#107DAC] to-[#023F59]" />
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/15 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-lepos-cyan-text" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">Wiki</h2>
                  <Badge className="border-0 bg-emerald-100 text-emerald-700 text-[10px] font-bold">LIVE DISK</Badge>
                  {tree?.root && <Badge variant="outline" className="text-[10px] font-mono border-primary/20">{displayPath(tree.root)}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Markdown knowledge layer backed by workspace files.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => loadTree(activePath)} disabled={loading} className="border-primary/25">
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button size="sm" onClick={handleBootstrap} disabled={bootstrapping} className="bg-primary text-white hover:bg-primary/90">
                <Sparkles className={`h-3.5 w-3.5 mr-1.5 ${bootstrapping ? 'animate-spin' : ''}`} />
                Bootstrap
              </Button>
            </div>
          </div>
          {status && <p className="text-xs text-lepos-cyan-text mt-3 font-medium">{status}</p>}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[210px_260px_minmax(0,1fr)]">
        <Card className="border-primary/25 shadow-sm">
          <CardContent className="p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-2 pb-2">Root folders</p>
            <div className="space-y-1">
              {ROOT_FOLDERS.map(folder => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-left transition-colors ${activeFolder === folder ? 'bg-primary text-white' : 'hover:bg-primary/8 text-foreground'}`}
                >
                  {activeFolder === folder ? <FolderOpen className="h-4 w-4 shrink-0" /> : <Folder className="h-4 w-4 shrink-0 text-lepos-cyan-text" />}
                  <span className="truncate font-medium">{folder}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/25 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between px-2 pb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Files</p>
              <Badge className="border-0 bg-primary/10 text-[#023F59] dark:text-[#A5F3FC] text-[10px]">{files.length}</Badge>
            </div>
            <div className="space-y-1 max-h-[560px] overflow-auto pr-1">
              {files.map(item => (
                <button
                  key={item.path}
                  onClick={() => setActivePath(item.path)}
                  className={`w-full rounded-md px-2.5 py-2 text-left transition-colors ${activePath === item.path ? 'bg-secondary/15 text-lepos-cyan-text' : 'hover:bg-primary/8 text-foreground'}`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate text-sm font-medium">{item.name}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(item.modifiedAt)}</p>
                </button>
              ))}
              {!loading && files.length === 0 && (
                <p className="text-sm text-muted-foreground px-2 py-4">No markdown files yet. Run Bootstrap.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/25 shadow-sm min-w-0">
          <CardContent className="p-0">
            <div className="flex flex-col gap-3 border-b border-primary/10 p-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Editing live markdown file</p>
                <h3 className="text-base font-bold text-foreground truncate">{file?.name ?? 'No file selected'}</h3>
              </div>
              <div className="flex items-center gap-2">
                {isDirty && <Badge className="border-0 bg-amber-100 text-amber-700 text-[10px]">UNSAVED</Badge>}
                {!isDirty && file && <Badge className="border-0 bg-emerald-100 text-emerald-700 text-[10px]"><Check className="h-3 w-3 mr-1" />SYNCED</Badge>}
                <Button size="sm" onClick={handleSave} disabled={!file || !isDirty || saving} className="bg-primary text-white hover:bg-primary/90">
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save
                </Button>
              </div>
            </div>

            {file ? (
              <div className="grid min-h-[560px] lg:grid-cols-2">
                <div className="border-b border-primary/10 lg:border-b-0 lg:border-r">
                  <Textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    spellCheck={false}
                    className="min-h-[560px] resize-none rounded-none border-0 font-mono text-sm shadow-none focus-visible:ring-0"
                  />
                </div>
                <div className="bg-primary/[0.025]">
                  <div className="border-b border-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Markdown preview
                  </div>
                  <pre className="whitespace-pre-wrap break-words p-4 text-sm leading-6 text-foreground font-sans">{draft}</pre>
                </div>
              </div>
            ) : (
              <div className="min-h-[560px] flex items-center justify-center text-sm text-muted-foreground">
                Select a wiki file to view or edit.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
