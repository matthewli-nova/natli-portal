import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import {
  Brain, MessageSquare, Code2, Zap, FileSearch,
  Image, PenLine, Bot, Languages, ArrowRight,
} from 'lucide-react';
import {
  CATEGORY_LEADERS, QUICK_REF, SETUP_RECS,
  getProviderColor, getTagColor,
  type CategoryLeader, type ModelEntry,
} from './model-intelligence-data';

// ─── Icon lookup ─────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, MessageSquare, Code2, Zap, FileSearch,
  Image, PenLine, Bot, Languages,
};

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon className={className} /> : null;
}

// ─── Section Header ──────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-l-4 border-[#31D7DB] pl-3 mb-4">
      <span className="text-lg font-bold text-[#21262A]">{children}</span>
    </div>
  );
}

// ─── Tag Pill ────────────────────────────────────────────────

function TagPill({ tag }: { tag: string }) {
  return (
    <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border ${getTagColor(tag)}`}>
      {tag}
    </span>
  );
}

// ─── Model Row inside card ───────────────────────────────────

function ModelRow({
  medal, entry, rank,
}: {
  medal: string;
  entry: ModelEntry;
  rank: 'gold' | 'silver' | 'bronze' | 'free';
}) {
  const rankBg = {
    gold:   'border-l-2 border-amber-400 bg-amber-50/50',
    silver: 'border-l-2 border-gray-300 bg-gray-50/50',
    bronze: 'border-l-2 border-orange-300 bg-orange-50/30',
    free:   'border-l-2 border-emerald-400 bg-emerald-50/30',
  }[rank];

  return (
    <div className={`flex items-start gap-2 p-2 rounded-lg ${rankBg}`}>
      <span className="text-base shrink-0 leading-none mt-0.5">{medal}</span>
      <div className="min-w-0 flex-1">
        {/* Company + alias badge */}
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{entry.company}</span>
          <Badge
            variant="secondary"
            className={`text-[10px] px-1.5 py-0 font-mono ${getProviderColor(entry.alias)}`}
          >
            {entry.alias}
          </Badge>
        </div>
        {/* Model name */}
        <p className="text-sm font-semibold text-[#21262A] leading-tight">{entry.label}</p>
        {/* Reason */}
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{entry.reason}</p>
        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {entry.tags.map(tag => <TagPill key={tag} tag={tag} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Category Card ───────────────────────────────────────────

function CategoryCard({ cat }: { cat: CategoryLeader }) {
  return (
    <Card className="border-[#023F59]/25 shadow-sm rounded-xl">
      <CardContent className="p-4 space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2 pb-1 border-b border-[#023F59]/8">
          <CategoryIcon name={cat.icon} className={`w-4 h-4 shrink-0 ${cat.color}`} />
          <span className="text-sm font-bold text-[#21262A]">{cat.name}</span>
        </div>

        <ModelRow medal="🥇" entry={cat.best}     rank="gold" />
        <ModelRow medal="🥈" entry={cat.runnerUp}  rank="silver" />
        {cat.thirdPlace && (
          <ModelRow medal="🥉" entry={cat.thirdPlace} rank="bronze" />
        )}
        <ModelRow medal="💸" entry={cat.free}      rank="free" />
      </CardContent>
    </Card>
  );
}

// ─── Quick Reference Table ───────────────────────────────────

function QuickRefTable() {
  return (
    <Card className="border-[#023F59]/25 shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#023F59]/10 text-left text-xs text-muted-foreground bg-[#023F59]/5">
                <th className="px-4 py-2.5 font-medium">Task</th>
                <th className="px-4 py-2.5 font-medium">Best</th>
                <th className="px-4 py-2.5 font-medium">Free</th>
              </tr>
            </thead>
            <tbody>
              {QUICK_REF.map((row, i) => (
                <tr
                  key={row.task}
                  className={`border-b border-[#023F59]/5 last:border-0 ${i % 2 === 0 ? 'bg-[#023F59]/[0.03]' : ''}`}
                >
                  <td className="px-4 py-2.5 font-medium text-[#21262A]">{row.task}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[#21262A]">{row.best}</code>
                      <span className="text-xs text-muted-foreground">{row.bestLabel}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[#21262A]">{row.free}</code>
                      <span className="text-xs text-muted-foreground">{row.freeLabel}</span>
                      <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-emerald-100 text-emerald-700">Free</Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Setup Recommendations ───────────────────────────────────

function SetupRecommendations() {
  return (
    <div className="space-y-2">
      {SETUP_RECS.map((rec) => (
        <Card key={rec.context} className="border-[#023F59]/25 shadow-sm rounded-xl">
          <CardContent className="p-3 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-[#21262A] min-w-[140px]">{rec.context}</span>
            {rec.current && (
              <>
                <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded font-mono text-muted-foreground">{rec.current}</code>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </>
            )}
            <Badge variant="secondary" className={`text-[11px] font-mono ${getProviderColor(rec.recommended)}`}>{rec.recommended}</Badge>
            <span className="text-xs text-muted-foreground">{rec.recommendedLabel}</span>
            <span className="text-xs text-[#107DAC] ml-auto">{rec.reason}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

export function ModelIntelligencePage() {
  return (
    <div className="space-y-6">
      {/* Section A — Category Cards */}
      <div>
        <SectionHeader>🏆 Best Model Per Task</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORY_LEADERS.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </div>
      </div>

      {/* Section B — Quick Reference */}
      <div>
        <SectionHeader>📊 Quick Reference Cheat Sheet</SectionHeader>
        <QuickRefTable />
      </div>

      {/* Section C — Recommendations */}
      <div>
        <SectionHeader>💡 Recommendations for Our Setup</SectionHeader>
        <SetupRecommendations />
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground space-y-0.5 pt-2 border-t border-[#023F59]/10">
        <p>Last updated: March 2026</p>
        <p>Source: Internal model evaluation based on OpenClaw usage</p>
        <p className="font-mono text-[10px]">Update model-intelligence-data.ts to refresh</p>
      </div>
    </div>
  );
}

export default ModelIntelligencePage;
