// SkillsList.tsx
// Renders skill cards in list or grid view for the sidebar

import { Clock, Zap } from 'lucide-react';
import { type Skill, CATEGORY_COLORS, CATEGORY_EMOJI } from './skills-data';

interface SkillsListProps {
  skills: Skill[];
  selectedSkill: Skill | null;
  onSelect: (skill: Skill) => void;
  viewMode: 'grid' | 'list';
}

export function SkillsList({ skills, selectedSkill, onSelect, viewMode }: SkillsListProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No skills match your filters
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-2 pb-2">
        {skills.map(skill => (
          <SkillGridCard
            key={skill.id}
            skill={skill}
            isSelected={selectedSkill?.id === skill.id}
            onClick={() => onSelect(skill)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 pb-2">
      {skills.map(skill => (
        <SkillListRow
          key={skill.id}
          skill={skill}
          isSelected={selectedSkill?.id === skill.id}
          onClick={() => onSelect(skill)}
        />
      ))}
    </div>
  );
}

// ── List Row ──────────────────────────────────────────────────────────────────

function SkillListRow({
  skill,
  isSelected,
  onClick,
}: {
  skill: Skill;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors border-b border-primary/10 last:border-0 ${
        isSelected
          ? 'bg-primary text-white'
          : 'hover:bg-primary/5'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Logo: category emoji when ready, greyed skill emoji when not */}
        <span className={`text-base flex-shrink-0 ${skill.status !== 'ready' ? 'opacity-40 grayscale' : ''}`}>
          {skill.status === 'ready' ? CATEGORY_EMOJI[skill.category] ?? skill.emoji : skill.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-medium truncate">{skill.name}</span>
            {skill.usageCount && skill.usageCount > 20 && (
              <Zap className="w-3 h-3 text-amber-500 flex-shrink-0" title="High usage" />
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {/* Category badge instead of status */}
            <span className={`text-xs px-1.5 py-0 rounded-full font-medium ${
              isSelected
                ? 'bg-white/20 text-white'
                : CATEGORY_COLORS[skill.category]
            }`}>
              {skill.category === 'Infrastructure & Platform' ? 'Infra' : skill.category.split(' ')[0]}
            </span>
            {skill.status !== 'ready' && (
              <span className={`text-xs ${isSelected ? 'text-white/60' : 'text-amber-600'}`}>⚠</span>
            )}
            {skill.lastUsed && (
              <span className={`text-xs flex items-center gap-0.5 ${
                isSelected ? 'text-white/70' : 'text-muted-foreground'
              }`}>
                <Clock className="w-2.5 h-2.5" />
                {formatRelativeDate(skill.lastUsed)}
              </span>
            )}
          </div>
        </div>
        {skill.type === 'custom' && (
          <span className={`text-xs flex-shrink-0 ${isSelected ? 'text-white/60' : 'text-muted-foreground'}`}>
            🔧
          </span>
        )}
      </div>
    </button>
  );
}

// ── Grid Card ─────────────────────────────────────────────────────────────────

function SkillGridCard({
  skill,
  isSelected,
  onClick,
}: {
  skill: Skill;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-lg p-3 transition-colors border ${
        isSelected
          ? 'bg-primary text-white border-primary'
          : 'hover:bg-primary/5 border-primary/10 hover:border-primary/20'
      }`}
    >
      <div className={`text-2xl mb-1.5 ${skill.status !== 'ready' ? 'opacity-40 grayscale' : ''}`}>
        {skill.status === 'ready' ? CATEGORY_EMOJI[skill.category] ?? skill.emoji : skill.emoji}
      </div>
      <div className="text-xs font-medium truncate mb-1">{skill.name}</div>
      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
        isSelected
          ? 'bg-white/20 text-white'
          : CATEGORY_COLORS[skill.category]
      }`}>
        {skill.category === 'Infrastructure & Platform' ? 'Infra' : skill.category.split(' ')[0]}
      </span>
    </button>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1d ago';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}
