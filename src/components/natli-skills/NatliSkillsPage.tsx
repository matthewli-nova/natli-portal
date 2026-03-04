// NatliSkillsPage.tsx — standalone Skills page (sidebar nav item)
// Default tab: Tracker | Skills

import { lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { getSkillStats, ALL_SKILLS } from '../natli-dashboard/skills/skills-data';

const SkillsTab    = lazy(() => import('../natli-dashboard/skills/SkillsTab').then(m => ({ default: m.SkillsTab })));
const SkillTracker = lazy(() => import('../natli-dashboard/skills/SkillTracker').then(m => ({ default: m.SkillTracker })));

const fallback = <div className="text-muted-foreground text-sm p-8 text-center">Loading…</div>;

export function NatliSkillsPage() {
  const stats = getSkillStats();

  return (
    <div className="p-6 space-y-4">
      <Tabs defaultValue="tracker">
        <TabsList className="flex w-full overflow-x-auto bg-[#023F59]/5 h-auto flex-nowrap justify-start gap-0.5 px-1 py-1">
          <TabsTrigger value="tracker" className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">
            Tracker
          </TabsTrigger>
          <TabsTrigger value="skills" className="shrink-0 data-[state=active]:bg-[#023F59] data-[state=active]:text-white text-sm px-4 py-1.5">
            Skills
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="mt-4">
          <Suspense fallback={fallback}>
            <SkillTracker stats={stats} skills={ALL_SKILLS} />
          </Suspense>
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          <Suspense fallback={fallback}>
            <SkillsTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
