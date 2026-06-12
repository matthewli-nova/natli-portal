// skills-data.ts
// Types and static skill registry for the Skills module
// Source of truth: SKILLS-REGISTRY.md + file system
// Updated: 2026-03-13 with standard pricing and categories

export type SkillType = 'custom' | 'system';
export type SkillStatus = 'ready' | 'needs-setup' | 'disabled';
export type SkillCategory = string;

export interface Skill {
  id: string;
  name: string;
  emoji: string;
  description: string;
  path: string;
  type: SkillType;
  category: SkillCategory;
  status: SkillStatus;
  tags: string[];
  hasContract: boolean;
  version?: string;
  addedDate?: string;
  pricing?: string;           // e.g., "Free", "Paid", "API-based"
  lastUsed?: string;
  usageCount?: number;
}

export const ALL_SKILLS: Skill[] = [
  // ─── Google Workspace ────────────────────────────────────────────────────────
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    emoji: '📧',
    description: 'Full Google Workspace via gws CLI + MCP — Drive, Gmail, Calendar, Sheets, Docs, Tasks, Chat, Slides, Admin',
    path: 'skills/google-workspace/SKILL.md',
    type: 'custom',
    category: 'Google Workspace',
    status: 'ready',
    tags: ['google', 'docs', 'gmail', 'calendar', 'sheets', 'drive', 'workspace'],
    hasContract: true,
    addedDate: '2026-02-03',
    pricing: 'Google Workspace ($6-18/user)',
    usageCount: 35
  },
  // ─── Productivity ──────────────────────────────────────────────────────────
  {
    id: 'clickup',
    name: 'ClickUp',
    emoji: '📋',
    description: 'Enterprise ClickUp integration via MCP — multi-workspace CRUD, reporting, time tracking, dependencies',
    path: 'skills/skills/clickup-skill/SKILL.md',
    type: 'custom',
    category: 'Productivity',
    status: 'ready',
    tags: ['clickup', 'tasks', 'project-management', 'mcp'],
    hasContract: true,
    addedDate: '2026-02-07',
    pricing: 'Free ($0) or Paid ($5-20)',
    usageCount: 48
  },
  // ─── Research ──────────────────────────────────────────────────────────────
  {
    id: 'research-orchestra',
    name: 'Research Orchestra',
    emoji: '🎼',
    description: 'Multi-agent research orchestration — coordination of various AI agents for deep synthesis',
    path: 'skills/skills/research-orchestra/SKILL.md',
    type: 'custom',
    category: 'Research',
    status: 'ready',
    tags: ['research', 'multi-agent', 'orchestration', 'gemini', 'kimi'],
    hasContract: true,
    addedDate: '2026-02-15',
    pricing: 'API-based',
    usageCount: 15
  },
  // ─── Communication ──────────────────────────────────────────────────────────
  {
    id: 'slack-custom',
    name: 'Slack',
    emoji: '💬',
    description: 'Slack control via Hermes Claw — reactions, pins, channel actions, thread management, DMs',
    path: 'skills/skills/slack/SKILL.md',
    type: 'custom',
    category: 'Communication',
    status: 'ready',
    tags: ['slack', 'messaging', 'channels', 'communication'],
    hasContract: true,
    addedDate: '2026-02-01',
    pricing: 'Slack-dependent',
    usageCount: 120
  },
  // ─── Media ─────────────────────────────────────────────────────────────────
  {
    id: 'sys-video-frames',
    name: 'Video Frames',
    emoji: '🎬',
    description: 'Extract frames or short clips from videos using ffmpeg',
    path: '/Users/natlee/.hermes/skills/video-frames/SKILL.md',
    type: 'system',
    category: 'Media',
    status: 'ready',
    tags: ['video', 'ffmpeg', 'frames', 'clip'],
    hasContract: false,
    pricing: 'Free (ffmpeg)',
    usageCount: 0
  },
  // ─── Development ───────────────────────────────────────────────────────────
  {
    id: 'sys-coding-agent',
    name: 'Coding Agent',
    emoji: '🤖',
    description: 'Delegate coding tasks to Codex, Claude Code, or Pi agents via background process',
    path: '/Users/natlee/.hermes/skills/coding-agent/SKILL.md',
    type: 'system',
    category: 'Development',
    status: 'ready',
    tags: ['coding', 'agent', 'delegation', 'codex', 'claude-code'],
    hasContract: false,
    pricing: 'Varies by agent',
    usageCount: 18
  },
  // ─── Security ──────────────────────────────────────────────────────────────
  {
    id: 'sys-healthcheck',
    name: 'Healthcheck',
    emoji: '🔒',
    description: 'Host security hardening and risk-tolerance configuration for Hermes Claw deployments',
    path: '/Users/natlee/.hermes/skills/healthcheck/SKILL.md',
    type: 'system',
    category: 'Security',
    status: 'ready',
    tags: ['security', 'healthcheck', 'hardening', 'audit'],
    hasContract: false,
    pricing: 'Free',
    usageCount: 0
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Google Workspace',
  'Productivity',
  'Business Operations',
  'Research',
  'Communication',
  'Media',
  'Development',
  'Security',
  'Custom',
  'System',
];

export const STATUS_COLORS: Record<SkillStatus, string> = {
  'ready': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900',
  'needs-setup': 'bg-amber-100 text-amber-800',
  'disabled': 'bg-red-100 text-red-800'
};

export const STATUS_LABELS: Record<SkillStatus, string> = {
  'ready': 'Installed',
  'needs-setup': 'Available',
  'disabled': 'Disabled'
};

export const CATEGORY_COLORS: Record<string, string> = {
  'Google Workspace': 'bg-blue-100 text-blue-900',
  'Productivity': 'bg-emerald-100 text-emerald-900',
  'Business Operations': 'bg-indigo-100 text-indigo-900',
  'Research': 'bg-purple-100 text-purple-900',
  'Communication': 'bg-rose-100 text-rose-900',
  'Media': 'bg-slate-100 text-slate-900',
  'Development': 'bg-orange-100 text-orange-900',
  'Security': 'bg-amber-100 text-amber-900',
  'Custom': 'bg-indigo-100 text-indigo-900',
  'System': 'bg-gray-100 text-gray-700',
};

export const CATEGORY_EMOJI: Record<string, string> = {
  'Google Workspace': '📧',
  'Productivity': '📋',
  'Business Operations': '🏢',
  'Research': '🔎',
  'Communication': '💬',
  'Media': '🎬',
  'Development': '💻',
  'Security': '🔒',
  'Custom': '🛠️',
  'System': '⚙️',
};

export function generateSkillTemplate(name: string, description: string): string {
  const today = new Date().toISOString().split('T')[0];
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `---\nname: ${slug}\ndescription: "${description.replace(/"/g, '\\"')}"\nversion: ${today.replace(/-/g, '')}\n---\n\n# ${name}\n\n## When to Use\n${description}\n\n## Procedure\n1. Inspect the relevant context before acting.\n2. Make the smallest safe change.\n3. Verify the result with a focused check.\n\n## Verification\n- Confirm the output matches the request.\n- Record any blockers clearly.\n`;
}

export function getSkillStats() {
  const ready = ALL_SKILLS.filter(s => s.status === 'ready').length;
  const total = ALL_SKILLS.length;
  return {
    total,
    ready,
    needsSetup: total - ready,
    totalCustom: ALL_SKILLS.filter(s => s.type === 'custom').length,
    totalSystem: ALL_SKILLS.filter(s => s.type === 'system').length,
    withContract: ALL_SKILLS.filter(s => s.hasContract).length,
    contractCoverage: Math.round((ALL_SKILLS.filter(s => s.hasContract).length / total) * 100),
    mostUsed: [...ALL_SKILLS].sort((a,b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, 5),
    neverUsed: ALL_SKILLS.filter(s => !s.usageCount),
    recentlyAdded: [...ALL_SKILLS].sort((a,b) => (b.addedDate || '').localeCompare(a.addedDate || '')).slice(0, 5)
  };
}
