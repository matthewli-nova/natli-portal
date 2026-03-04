// NatliSkillsPage.tsx — standalone Skills page (no sub-tabs, just the skill browser)

import { lazy, Suspense } from 'react';

const SkillsTab = lazy(() => import('../natli-dashboard/skills/SkillsTab').then(m => ({ default: m.SkillsTab })));

export function NatliSkillsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<div className="text-muted-foreground text-sm p-8 text-center">Loading Skills…</div>}>
        <SkillsTab />
      </Suspense>
    </div>
  );
}
