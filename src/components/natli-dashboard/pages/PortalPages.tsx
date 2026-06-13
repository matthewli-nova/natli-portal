// PortalPages — thin wrappers that promote dashboard tab content into
// first-class portal pages with a consistent modern header.

import { lazy, Suspense } from 'react';
import { Activity, Coins, Boxes } from 'lucide-react';
import { PortalPage } from '../../../lib/portal-ui';
import { ErrorBoundary } from '../../ui/ErrorBoundary';

const LazySessionsTab = lazy(() => import('../sessions/SessionsTab').then((m) => ({ default: m.SessionsTab })));
const LazyModelTab = lazy(() => import('../model/ModelTab').then((m) => ({ default: m.ModelTab })));
const LazySkillsTab = lazy(() => import('../skills/SkillsTab').then((m) => ({ default: m.SkillsTab })));

const Fallback = ({ label }: { label: string }) => (
  <div className="p-8 text-center text-sm text-muted-foreground">Loading {label}…</div>
);

export function SessionsPage() {
  return (
    <PortalPage icon={Activity} title="Sessions" subtitle="Live agent sessions, sub-agents, and token activity">
      <ErrorBoundary label="Sessions">
        <Suspense fallback={<Fallback label="sessions" />}>
          <LazySessionsTab />
        </Suspense>
      </ErrorBoundary>
    </PortalPage>
  );
}

export function ModelsTokensPage() {
  return (
    <PortalPage icon={Coins} title="Models & Tokens" subtitle="Model routing, token consumption, and estimated spend">
      <ErrorBoundary label="Models">
        <Suspense fallback={<Fallback label="model stats" />}>
          <LazyModelTab mode="full" />
        </Suspense>
      </ErrorBoundary>
    </PortalPage>
  );
}

export function SkillsPortalPage() {
  return (
    <PortalPage icon={Boxes} title="Skills" subtitle="Custom and system skills available to Hermes Claw">
      <ErrorBoundary label="Skills">
        <Suspense fallback={<Fallback label="skills" />}>
          <LazySkillsTab />
        </Suspense>
      </ErrorBoundary>
    </PortalPage>
  );
}
