// WorkTasksPage — Work & Task management portal backed by ClickUp (/api/tasks).
// Board (kanban-by-status) + list views, with live KPIs.

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ListTodo, RefreshCw, Loader2, CircleDot, CheckCircle2,
  Clock, AlertTriangle, User, X, ExternalLink, Flag, Calendar, AlignLeft,
} from 'lucide-react';
import { PortalPage, StatCard, EmptyState } from '../../lib/portal-ui';
import { SegmentedControl } from '../ui/segmented-control';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import type { ClickUpTask } from '../../lib/portal-types';

function isDone(status?: string) {
  const s = (status ?? '').toLowerCase();
  return s.includes('complete') || s.includes('closed') || s.includes('done');
}
function isProgress(status?: string) {
  const s = (status ?? '').toLowerCase();
  return s.includes('progress') || s.includes('review') || s.includes('doing');
}

function dueInfo(due?: string | null): { label: string; overdue: boolean } | null {
  if (!due) return null;
  const ms = Number(due);
  if (!ms || Number.isNaN(ms)) return null;
  const d = new Date(ms);
  const now = Date.now();
  const overdue = ms < now;
  const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return { label, overdue };
}

function fmtFullDate(ms?: string | number | null): string {
  if (!ms) return '—';
  const n = Number(ms);
  if (!n || Number.isNaN(n)) return '—';
  return new Date(n).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function initials(name?: string) {
  if (!name) return '?';
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function TaskCard({ task, onClick }: { task: ClickUpTask; onClick?: () => void }) {
  const due = dueInfo(task.due_date);
  const color = task.status?.color || '#94a3b8';
  const prio = task.priority?.color;
  return (
    <div onClick={onClick} className="card-modern cursor-pointer space-y-2 p-3">
      <div className="flex items-start gap-2">
        {prio && <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: prio }} title={task.priority?.priority} />}
        <p className="text-sm font-medium leading-snug text-foreground">{task.name}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: `${color}1f`, color }}>
          <CircleDot className="h-3 w-3" /> {task.status?.status ?? 'unknown'}
        </span>
        <div className="flex items-center gap-2">
          {due && (
            <span className={cn('inline-flex items-center gap-1 text-[11px]', due.overdue ? 'text-rose-500 font-semibold' : 'text-muted-foreground')}>
              <Clock className="h-3 w-3" /> {due.label}
            </span>
          )}
          {task.assignees?.[0] && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/20 text-[9px] font-bold text-lepos-cyan-text" title={task.assignees[0].username}>
              {initials(task.assignees[0].username)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Task detail slide-over ──────────────────────────────────
function TaskDetailDrawer({ task, onClose }: { task: ClickUpTask | null; onClose: () => void }) {
  const open = !!task;
  const description = task ? (String(task.description || task.text_content || '').trim()) : '';
  const color = task?.status?.color || '#94a3b8';
  const url = task ? (task.url as string | undefined) : undefined;
  const due = dueInfo(task?.due_date);
  return (
    <>
      <div
        className={cn('fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity', open ? 'opacity-100' : 'pointer-events-none opacity-0')}
        onClick={onClose}
      />
      <div className={cn(
        'fixed right-0 top-0 z-50 flex h-screen w-[460px] max-w-[92vw] flex-col bg-card shadow-2xl transition-transform duration-300 ease-out',
        open ? 'translate-x-0' : 'translate-x-full',
      )}>
        {task && (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-border bg-gradient-to-br from-primary/[0.06] to-secondary/[0.06] px-5 py-4">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: `${color}1f`, color }}>
                  <CircleDot className="h-3 w-3" /> {task.status?.status ?? 'unknown'}
                </span>
                <h3 className="mt-2 text-base font-bold leading-snug text-foreground">{task.name}</h3>
              </div>
              <button onClick={onClose} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto scroll-slim px-5 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <DetailRow icon={Flag} label="Priority" value={task.priority?.priority ?? 'none'} dot={task.priority?.color} />
                <DetailRow icon={User} label="Assignee" value={task.assignees?.[0]?.username ?? 'Unassigned'} />
                <DetailRow icon={Calendar} label="Due" value={due ? fmtFullDate(task.due_date) : 'No due date'} danger={due?.overdue} />
                <DetailRow icon={Clock} label="Created" value={fmtFullDate(task.date_created)} />
              </div>

              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <AlignLeft className="h-3.5 w-3.5" /> Description
                </p>
                {description ? (
                  <p className="whitespace-pre-wrap break-words rounded-lg border border-border bg-muted/30 p-3 text-sm text-foreground/90">{description}</p>
                ) : (
                  <p className="rounded-lg border border-dashed border-border bg-muted/20 p-3 text-sm text-muted-foreground">No description provided.</p>
                )}
              </div>
            </div>

            {url && (
              <div className="border-t border-border px-5 py-3">
                <a href={url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-lepos-cyan-text hover:underline">
                  <ExternalLink className="h-4 w-4" /> Open in ClickUp
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function DetailRow({ icon: Icon, label, value, dot, danger }: {
  icon: typeof Flag; label: string; value: string; dot?: string; danger?: boolean;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {label}</p>
      <p className={cn('mt-0.5 flex items-center gap-1.5 font-medium', danger ? 'text-rose-500' : 'text-foreground')}>
        {dot && <span className="h-2 w-2 rounded-full" style={{ background: dot }} />}
        {value}
      </p>
    </div>
  );
}

export function WorkTasksPage() {
  const [tasks, setTasks] = useState<ClickUpTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'board' | 'list'>('board');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load tasks');
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => isDone(t.status?.status)).length;
    const progress = tasks.filter((t) => isProgress(t.status?.status)).length;
    const overdue = tasks.filter((t) => {
      const d = dueInfo(t.due_date);
      return d?.overdue && !isDone(t.status?.status);
    }).length;
    return { total, done, progress, overdue };
  }, [tasks]);

  // Group by status for board view, preserving ClickUp color
  const columns = useMemo(() => {
    const map = new Map<string, { name: string; color: string; tasks: ClickUpTask[] }>();
    for (const t of tasks) {
      const key = t.status?.status ?? 'unknown';
      if (!map.has(key)) map.set(key, { name: key, color: t.status?.color || '#94a3b8', tasks: [] });
      map.get(key)!.tasks.push(t);
    }
    // Order: open/todo first, done last
    return Array.from(map.values()).sort((a, b) => {
      const rank = (n: string) => (isDone(n) ? 2 : isProgress(n) ? 1 : 0);
      return rank(a.name) - rank(b.name);
    });
  }, [tasks]);

  const [selected, setSelected] = useState<ClickUpTask | null>(null);

  return (
    <PortalPage
      icon={ListTodo}
      title="Tasks"
      subtitle="Work & task management synced from ClickUp"
      actions={
        <div className="flex items-center gap-2">
          <SegmentedControl
            value={view}
            onChange={(v) => setView(v as 'board' | 'list')}
            options={[{ value: 'board', label: 'Board' }, { value: 'list', label: 'List' }]}
            className="w-[160px]"
          />
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="border-primary/30 hover:bg-primary hover:text-white">
            <RefreshCw className={cn('mr-1.5 h-3.5 w-3.5', loading && 'animate-spin')} /> Refresh
          </Button>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ListTodo} label="Total Tasks" value={stats.total} accent="cyan" />
        <StatCard icon={Clock} label="In Progress" value={stats.progress} accent="amber" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.done} accent="emerald" />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdue} accent={stats.overdue > 0 ? 'rose' : 'slate'} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : error ? (
        <EmptyState icon={AlertTriangle} title="Couldn't load tasks"
          description={`${error}. Check that CLICKUP_TOKEN and CLICKUP_TASK_LIST are configured on the server.`} />
      ) : tasks.length === 0 ? (
        <EmptyState icon={ListTodo} title="No tasks found" description="No tasks in the configured ClickUp list yet." />
      ) : view === 'board' ? (
        <div className="flex gap-4 overflow-x-auto pb-2 scroll-slim">
          {columns.map((col) => (
            <div key={col.name} className="w-72 shrink-0">
              <div className="mb-2 flex items-center justify-between rounded-lg border border-border bg-card/60 px-3 py-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: col.color }} />
                  {col.name}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{col.tasks.length}</span>
              </div>
              <div className="space-y-2">
                {col.tasks.map((t) => <TaskCard key={t.id} task={t} onClick={() => setSelected(t)} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card elevation-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-4 py-2.5 text-left font-medium">Task</th>
                <th className="px-4 py-2.5 text-left font-medium">Status</th>
                <th className="px-4 py-2.5 text-left font-medium">Assignee</th>
                <th className="px-4 py-2.5 text-left font-medium">Due</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => {
                const due = dueInfo(t.due_date);
                const color = t.status?.color || '#94a3b8';
                return (
                  <tr key={t.id} onClick={() => setSelected(t)} className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-secondary/[0.06]">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {t.priority?.color && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: t.priority.color }} />}
                        <span className="font-medium text-foreground">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: `${color}1f`, color }}>
                        {t.status?.status ?? 'unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {t.assignees?.[0] ? (
                        <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{t.assignees[0].username}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      {due ? <span className={due.overdue ? 'font-semibold text-rose-500' : 'text-muted-foreground'}>{due.label}</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <TaskDetailDrawer task={selected} onClose={() => setSelected(null)} />
    </PortalPage>
  );
}
