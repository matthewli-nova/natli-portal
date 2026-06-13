// MemoryWikiPage — unified Memory & Knowledge portal.
// Combines live memory stats (MemoryTab) with the editable Wiki tree (WikiTab).

import { useState, useEffect, lazy, Suspense } from 'react';
import { BrainCircuit } from 'lucide-react';
import { PortalPage } from '../../../lib/portal-ui';
import { SegmentedControl } from '../../ui/segmented-control';
import { ErrorBoundary } from '../../ui/ErrorBoundary';
import { MemoryTab } from '../memory/MemoryTab';
import type { HealthData } from '../../../lib/portal-types';

const LazyWikiTab = lazy(() => import('../wiki/WikiTab').then((m) => ({ default: m.WikiTab })));

export function MemoryWikiPage() {
  const [view, setView] = useState<'memory' | 'wiki'>('memory');
  const [health, setHealth] = useState<HealthData | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (active) setHealth(d); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <PortalPage
      icon={BrainCircuit}
      title="Memory & Wiki"
      subtitle="Long-term memory health, daily logs, and the editable knowledge base"
      actions={
        <SegmentedControl
          value={view}
          onChange={(v) => setView(v as 'memory' | 'wiki')}
          options={[
            { value: 'memory', label: 'Memory' },
            { value: 'wiki', label: 'Wiki' },
          ]}
          className="w-[200px]"
        />
      }
    >
      {view === 'memory' ? (
        <ErrorBoundary label="Memory">
          <MemoryTab health={health} />
        </ErrorBoundary>
      ) : (
        <ErrorBoundary label="Wiki">
          <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading Wiki…</div>}>
            <LazyWikiTab />
          </Suspense>
        </ErrorBoundary>
      )}
    </PortalPage>
  );
}
