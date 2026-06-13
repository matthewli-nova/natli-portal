// portal-ui.tsx — Shared modern primitives for the Hermes Claw portal.
// Refined cyan/navy design language: glass surfaces, layered elevation,
// gradient accents. Reused across every management portal page.

import * as React from 'react';
import { cn } from '../components/ui/utils';
import type { LucideIcon } from 'lucide-react';

// ─── PortalPage ──────────────────────────────────────────────
// Standard page scaffold: gradient header band + animated content area.

export interface PortalPageProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PortalPage({ icon: Icon, title, subtitle, badge, actions, children, className }: PortalPageProps) {
  return (
    <div className={cn('space-y-6 animate-fade-up', className)}>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/[0.07] via-card to-secondary/[0.06] px-5 py-4 elevation-1">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/25 to-primary/20 text-lepos-cyan-text ring-1 ring-secondary/30">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-xl font-bold tracking-tight text-foreground">{title}</h2>
                {badge}
              </div>
              {subtitle && <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

// ─── SectionHeader ───────────────────────────────────────────

export interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ icon: Icon, title, description, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2.5">
        <span className="accent-rail h-5 w-1" />
        {Icon && <Icon className="h-4 w-4 text-secondary" />}
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ─── StatCard ────────────────────────────────────────────────

type Accent = 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate';

const ACCENTS: Record<Accent, { icon: string; ring: string; glow: string }> = {
  cyan:    { icon: 'text-lepos-cyan-text bg-secondary/15', ring: 'ring-secondary/25', glow: 'from-secondary/12' },
  emerald: { icon: 'text-emerald-600 bg-emerald-500/15 dark:text-emerald-300', ring: 'ring-emerald-500/25', glow: 'from-emerald-500/12' },
  amber:   { icon: 'text-amber-600 bg-amber-500/15 dark:text-amber-300', ring: 'ring-amber-500/25', glow: 'from-amber-500/12' },
  rose:    { icon: 'text-rose-600 bg-rose-500/15 dark:text-rose-300', ring: 'ring-rose-500/25', glow: 'from-rose-500/12' },
  violet:  { icon: 'text-violet-600 bg-violet-500/15 dark:text-violet-300', ring: 'ring-violet-500/25', glow: 'from-violet-500/12' },
  slate:   { icon: 'text-slate-600 bg-slate-500/15 dark:text-slate-300', ring: 'ring-slate-500/20', glow: 'from-slate-500/10' },
};

export interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: Accent;
  trend?: { value: string; direction: 'up' | 'down' | 'flat' };
  onClick?: () => void;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, sub, accent = 'cyan', trend, onClick, className }: StatCardProps) {
  const a = ACCENTS[accent];
  const trendColor = trend?.direction === 'up' ? 'text-emerald-600 dark:text-emerald-400'
    : trend?.direction === 'down' ? 'text-rose-600 dark:text-rose-400'
    : 'text-muted-foreground';
  return (
    <div
      onClick={onClick}
      className={cn(
        'card-modern group relative overflow-hidden p-4',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      <div className={cn('pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br to-transparent blur-xl', a.glow)} />
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-2xl font-bold leading-none tracking-tight text-foreground">{value}</p>
          {sub && <p className="mt-1.5 truncate text-xs text-muted-foreground">{sub}</p>}
        </div>
        {Icon && (
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1', a.icon, a.ring)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      {trend && (
        <p className={cn('relative mt-2 text-xs font-medium', trendColor)}>
          {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
        </p>
      )}
    </div>
  );
}

// ─── StatusPill ──────────────────────────────────────────────

type Tone = 'online' | 'offline' | 'warning' | 'idle' | 'info';

const TONES: Record<Tone, string> = {
  online:  'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-emerald-500/30',
  offline: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-rose-500/30',
  warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-amber-500/30',
  idle:    'bg-slate-500/15 text-slate-500 dark:text-slate-300 ring-slate-500/25',
  info:    'bg-secondary/15 text-lepos-cyan-text ring-secondary/30',
};

const DOT: Record<Tone, string> = {
  online: 'bg-emerald-500', offline: 'bg-rose-500', warning: 'bg-amber-500', idle: 'bg-slate-400', info: 'bg-secondary',
};

export function StatusPill({ tone, children, pulse, className }: { tone: Tone; children: React.ReactNode; pulse?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1', TONES[tone], className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', DOT[tone], pulse && 'animate-pulse')} />
      {children}
    </span>
  );
}

// ─── EmptyState ──────────────────────────────────────────────

export function EmptyState({ icon: Icon, title, description, action, className }: {
  icon?: LucideIcon; title: string; description?: string; action?: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center', className)}>
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-lepos-cyan-text">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
