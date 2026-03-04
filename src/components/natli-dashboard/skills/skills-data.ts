// skills-data.ts
// Types and static skill registry for the Skills module
// Source of truth: SKILLS-REGISTRY.md + file system

export type SkillType = 'custom' | 'system';
export type SkillStatus = 'ready' | 'needs-setup' | 'disabled';
export type SkillCategory =
  | 'Development'
  | 'Infrastructure & Platform'
  | 'Research & Orchestration'
  | 'Business Operations'
  | 'System';

export interface SkillUsageEntry {
  date: string; // ISO date
  count: number;
}

export interface Skill {
  id: string;
  name: string;
  emoji: string;
  description: string;
  path: string;           // relative path to SKILL.md
  type: SkillType;
  category: SkillCategory;
  status: SkillStatus;
  tags: string[];
  hasContract: boolean;
  version?: string;
  lastUsed?: string;      // ISO date
  usageCount?: number;
  addedDate?: string;     // ISO date
}

// ─── Custom Skills ────────────────────────────────────────────────────────────

export const CUSTOM_SKILLS: Skill[] = [
  // Development
  {
    id: 'dev-rust',
    name: 'Rust Dev',
    emoji: '🦀',
    description: 'Rust patterns — error handling, concurrency, testing, high-performance systems',
    path: 'skills/skills/dev-rust/SKILL.md',
    type: 'custom',
    category: 'Development',
    status: 'ready',
    tags: ['rust', 'systems', 'performance', 'concurrency'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  {
    id: 'dev-python',
    name: 'Python Dev',
    emoji: '🐍',
    description: 'Python with uv-first tooling — venv, scripts, version management',
    path: 'skills/skills/dev-python/SKILL.md',
    type: 'custom',
    category: 'Development',
    status: 'ready',
    tags: ['python', 'uv', 'scripting'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  {
    id: 'dev-typescript',
    name: 'TypeScript Dev',
    emoji: '📘',
    description: 'TypeScript for vbiz/lepos — Magi, Kysely, GraphQL, ts-proto, Zod, monorepo',
    path: 'skills/skills/dev-typescript/SKILL.md',
    type: 'custom',
    category: 'Development',
    status: 'ready',
    tags: ['typescript', 'vbiz', 'lepos', 'monorepo', 'zod'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  {
    id: 'dev-dart',
    name: 'Flutter/Dart Dev',
    emoji: '🐦',
    description: 'Flutter/Dart for lepos-platform-apps-v2 — Melos, Riverpod, native SDK, POS/NFC/kiosk',
    path: 'skills/skills/dev-dart/SKILL.md',
    type: 'custom',
    category: 'Development',
    status: 'ready',
    tags: ['flutter', 'dart', 'mobile', 'nfc', 'pos'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  {
    id: 'dev-docker',
    name: 'Docker Dev',
    emoji: '🐳',
    description: 'Docker production patterns — multi-stage, distroless, pnpm, Rust cross-compile, ECS Fargate',
    path: 'skills/skills/dev-docker/SKILL.md',
    type: 'custom',
    category: 'Development',
    status: 'ready',
    tags: ['docker', 'containers', 'ecs', 'fargate'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  {
    id: 'dev-github-actions',
    name: 'GitHub Actions',
    emoji: '⚙️',
    description: 'GitHub Actions CI/CD — self-hosted runners, reusable workflows, cargo-zigbuild',
    path: 'skills/skills/dev-github-actions/SKILL.md',
    type: 'custom',
    category: 'Development',
    status: 'ready',
    tags: ['ci-cd', 'github', 'automation'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  {
    id: 'dev-graphql',
    name: 'GraphQL Dev',
    emoji: '🔷',
    description: 'GraphQL with Apollo Server — schema-first, DataLoader N+1, pagination, error handling',
    path: 'skills/skills/dev-graphql/SKILL.md',
    type: 'custom',
    category: 'Development',
    status: 'ready',
    tags: ['graphql', 'apollo', 'api'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  {
    id: 'dev-grpc',
    name: 'gRPC Dev',
    emoji: '📡',
    description: 'gRPC for Rust (tonic) + TypeScript (ts-proto/nice-grpc) — protos, streaming, health checks',
    path: 'skills/skills/dev-grpc/SKILL.md',
    type: 'custom',
    category: 'Development',
    status: 'ready',
    tags: ['grpc', 'protobuf', 'streaming', 'rust', 'typescript'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  {
    id: 'dev-nextjs',
    name: 'Next.js Dev',
    emoji: '⚡',
    description: 'Next.js 16 + Turbopack — SSR/SSG, build optimization, production deployment',
    path: 'skills/skills/dev-nextjs/SKILL.md',
    type: 'custom',
    category: 'Development',
    status: 'ready',
    tags: ['nextjs', 'react', 'turbopack', 'ssr'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  {
    id: 'dev-opentofu',
    name: 'OpenTofu IaC',
    emoji: '🏗️',
    description: 'OpenTofu IaC for AWS — 3 deployment patterns, provider conventions, state management',
    path: 'skills/skills/dev-opentofu/SKILL.md',
    type: 'custom',
    category: 'Development',
    status: 'ready',
    tags: ['iac', 'terraform', 'aws', 'infrastructure'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  {
    id: 'dev-sql',
    name: 'SQL Dev',
    emoji: '🗄️',
    description: 'SQL-centric architecture for PostgreSQL — PL/pgSQL, JSONB API, migrations, test isolation',
    path: 'skills/skills/dev-sql/SKILL.md',
    type: 'custom',
    category: 'Development',
    status: 'ready',
    tags: ['sql', 'postgresql', 'migrations', 'database'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  // Infrastructure & Platform
  {
    id: 'aws',
    name: 'AWS',
    emoji: '☁️',
    description: 'AWS infra + Bedrock AgentCore — EC2, S3, Lambda, IAM, VPC, AI agent deployment',
    path: 'skills/skills/aws/SKILL.md',
    type: 'custom',
    category: 'Infrastructure & Platform',
    status: 'ready',
    tags: ['aws', 'cloud', 'bedrock', 'lambda', 'iam'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  {
    id: 'mosyle',
    name: 'Mosyle MDM',
    emoji: '🍎',
    description: 'Mosyle MDM — Apple device management, inventory, app deploy, profiles, commands',
    path: 'skills/skills/mosyle/SKILL.md',
    type: 'custom',
    category: 'Infrastructure & Platform',
    status: 'ready',
    tags: ['mdm', 'apple', 'devices', 'management'],
    hasContract: true,
    addedDate: '2026-03-04',
  },
  // Research & Orchestration
  {
    id: 'research-orchestra',
    name: 'Research Orchestra',
    emoji: '🎼',
    description: 'Multi-agent research — Claude Opus, Perplexity, Gemini, NotebookLM orchestration',
    path: 'skills/skills/research-orchestra/SKILL.md',
    type: 'custom',
    category: 'Research & Orchestration',
    status: 'ready',
    tags: ['research', 'multi-agent', 'orchestration', 'gemini', 'notebooklm'],
    hasContract: true,
    addedDate: '2026-02-15',
  },
  // Business Operations
  {
    id: 'clickup',
    name: 'ClickUp',
    emoji: '📋',
    description: 'Enterprise ClickUp integration — multi-workspace, CRUD, reporting, time tracking',
    path: 'skills/skills/clickup-skill/SKILL.md',
    type: 'custom',
    category: 'Business Operations',
    status: 'ready',
    tags: ['clickup', 'tasks', 'project-management'],
    hasContract: true,
    addedDate: '2026-02-07',
    usageCount: 48,
    lastUsed: '2026-03-04',
  },
  {
    id: 'slack-custom',
    name: 'Slack',
    emoji: '💬',
    description: 'Slack control — reactions, pins, channel actions',
    path: 'skills/skills/slack/SKILL.md',
    type: 'custom',
    category: 'Business Operations',
    status: 'ready',
    tags: ['slack', 'messaging', 'channels'],
    hasContract: true,
    addedDate: '2026-02-01',
    usageCount: 120,
    lastUsed: '2026-03-04',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    emoji: '💼',
    description: 'LinkedIn automation via browser — messaging, profile, network actions',
    path: 'skills/linkedin/SKILL.md',
    type: 'custom',
    category: 'Business Operations',
    status: 'ready',
    tags: ['linkedin', 'social', 'automation'],
    hasContract: true,
    addedDate: '2026-02-10',
    usageCount: 12,
    lastUsed: '2026-02-28',
  },
  {
    id: 'linkedin-content',
    name: 'LinkedIn Content',
    emoji: '✍️',
    description: 'LinkedIn post writing — hook formulas, formatting, engagement patterns',
    path: 'skills/linkedin-content/SKILL.md',
    type: 'custom',
    category: 'Business Operations',
    status: 'ready',
    tags: ['linkedin', 'content', 'writing', 'marketing'],
    hasContract: true,
    addedDate: '2026-02-10',
    usageCount: 22,
    lastUsed: '2026-02-25',
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    emoji: '📧',
    description: 'Full Google Workspace — Docs, Drive, Sheets, Gmail, Calendar',
    path: 'skills/google-workspace/SKILL.md',
    type: 'custom',
    category: 'Business Operations',
    status: 'ready',
    tags: ['google', 'docs', 'gmail', 'calendar', 'sheets'],
    hasContract: true,
    addedDate: '2026-02-03',
    usageCount: 35,
    lastUsed: '2026-03-03',
  },
  {
    id: 'hk-seo-article',
    name: 'HK SEO Article',
    emoji: '📰',
    description: 'HK SEO article generator (SCMP-style, bilingual)',
    path: 'skills/hk-seo-article/SKILL.md',
    type: 'custom',
    category: 'Business Operations',
    status: 'ready',
    tags: ['seo', 'content', 'hk', 'bilingual'],
    hasContract: true,
    addedDate: '2026-02-09',
    usageCount: 8,
    lastUsed: '2026-02-20',
  },
  {
    id: 'vbiz',
    name: 'vbiz',
    emoji: '💰',
    description: 'AI-powered accounting portal — Dashboard, Ask vbiz AI, Sales, Expenses, Banking, Reports',
    path: 'skills/vbiz-skill/SKILL.md',
    type: 'custom',
    category: 'Business Operations',
    status: 'ready',
    tags: ['vbiz', 'accounting', 'finance', 'ai'],
    hasContract: true,
    addedDate: '2026-02-08',
    usageCount: 15,
    lastUsed: '2026-03-01',
  },
  {
    id: 'xero',
    name: 'Xero',
    emoji: '📊',
    description: 'Navigate Xero accounting via browser — invoices, bills, banking, reconciliation',
    path: 'skills/xero-skill/SKILL.md',
    type: 'custom',
    category: 'Business Operations',
    status: 'ready',
    tags: ['xero', 'accounting', 'finance'],
    hasContract: true,
    addedDate: '2026-02-15',
    usageCount: 5,
    lastUsed: '2026-02-22',
  },
  {
    id: 'n8n',
    name: 'n8n',
    emoji: '⚙️',
    description: 'Workflow automation — trigger workflows, monitor executions, debug failures',
    path: 'skills/n8n-skill/SKILL.md',
    type: 'custom',
    category: 'Business Operations',
    status: 'needs-setup',
    tags: ['n8n', 'automation', 'workflows'],
    hasContract: false,
    addedDate: '2026-02-20',
  },
  {
    id: 'linkedin-corporate',
    name: 'LinkedIn Corporate',
    emoji: '💼',
    description: 'Draft professional LinkedIn posts — 12 hook formulas, 10 templates',
    path: 'skills/linkedin-corporate/SKILL.md',
    type: 'custom',
    category: 'Business Operations',
    status: 'ready',
    tags: ['linkedin', 'corporate', 'content', 'b2b'],
    hasContract: true,
    addedDate: '2026-02-11',
    usageCount: 30,
    lastUsed: '2026-02-28',
  },
  {
    id: 'mactop',
    name: 'Mactop',
    emoji: '💻',
    description: 'Apple Silicon hardware metrics via mactop TOON format',
    path: 'skills/mactop/SKILL.md',
    type: 'custom',
    category: 'Infrastructure & Platform',
    status: 'ready',
    tags: ['macos', 'metrics', 'hardware', 'apple-silicon'],
    hasContract: true,
    addedDate: '2026-02-10',
    usageCount: 3,
    lastUsed: '2026-02-19',
  },
];

// ─── System Skills (OpenClaw Bundled) ─────────────────────────────────────────

export const SYSTEM_SKILLS: Skill[] = [
  {
    id: 'sys-clawhub',
    name: 'ClawHub',
    emoji: '📦',
    description: 'Search, install, update, publish skills from clawhub.com',
    path: '/opt/homebrew/lib/node_modules/openclaw/skills/clawhub/SKILL.md',
    type: 'system',
    category: 'System',
    status: 'ready',
    tags: ['clawhub', 'marketplace', 'install'],
    hasContract: false,
  },
  {
    id: 'sys-gemini',
    name: 'Gemini',
    emoji: '♊️',
    description: 'Gemini CLI for one-shot Q&A, summaries, and generation',
    path: '/opt/homebrew/lib/node_modules/openclaw/skills/gemini/SKILL.md',
    type: 'system',
    category: 'System',
    status: 'ready',
    tags: ['gemini', 'google', 'ai'],
    hasContract: false,
    usageCount: 45,
    lastUsed: '2026-03-04',
  },
  {
    id: 'sys-nano-banana',
    name: 'Nano Banana Pro',
    emoji: '🍌',
    description: 'Generate or edit images via Gemini 3 Pro Image',
    path: '/opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/SKILL.md',
    type: 'system',
    category: 'System',
    status: 'ready',
    tags: ['image', 'generation', 'gemini'],
    hasContract: false,
    usageCount: 8,
    lastUsed: '2026-02-28',
  },
  {
    id: 'sys-skill-creator',
    name: 'Skill Creator',
    emoji: '🛠️',
    description: 'Create or update AgentSkills with scripts, references, assets',
    path: '/opt/homebrew/lib/node_modules/openclaw/skills/skill-creator/SKILL.md',
    type: 'system',
    category: 'System',
    status: 'ready',
    tags: ['skills', 'create', 'develop'],
    hasContract: false,
  },
  {
    id: 'sys-weather',
    name: 'Weather',
    emoji: '🌤️',
    description: 'Get current weather and forecasts (no API key required)',
    path: '/opt/homebrew/lib/node_modules/openclaw/skills/weather/SKILL.md',
    type: 'system',
    category: 'System',
    status: 'ready',
    tags: ['weather', 'forecast'],
    hasContract: false,
    usageCount: 20,
    lastUsed: '2026-03-04',
  },
  {
    id: 'sys-coding-agent',
    name: 'Coding Agent',
    emoji: '🤖',
    description: 'Delegate coding tasks to Codex, Claude Code, or Pi agents via background process',
    path: '/opt/homebrew/lib/node_modules/openclaw/skills/coding-agent/SKILL.md',
    type: 'system',
    category: 'System',
    status: 'ready',
    tags: ['coding', 'agent', 'delegation'],
    hasContract: false,
    usageCount: 18,
    lastUsed: '2026-03-04',
  },
  {
    id: 'sys-healthcheck',
    name: 'Healthcheck',
    emoji: '🔒',
    description: 'Host security hardening and risk-tolerance configuration for OpenClaw deployments',
    path: '/opt/homebrew/lib/node_modules/openclaw/skills/healthcheck/SKILL.md',
    type: 'system',
    category: 'System',
    status: 'ready',
    tags: ['security', 'healthcheck', 'hardening'],
    hasContract: false,
  },
  {
    id: 'sys-himalaya',
    name: 'Himalaya',
    emoji: '📬',
    description: 'CLI to manage emails via IMAP/SMTP',
    path: '/opt/homebrew/lib/node_modules/openclaw/skills/himalaya/SKILL.md',
    type: 'system',
    category: 'System',
    status: 'ready',
    tags: ['email', 'imap', 'smtp'],
    hasContract: false,
  },
  {
    id: 'sys-video-frames',
    name: 'Video Frames',
    emoji: '🎬',
    description: 'Extract frames or short clips from videos using ffmpeg',
    path: '/opt/homebrew/lib/node_modules/openclaw/skills/video-frames/SKILL.md',
    type: 'system',
    category: 'System',
    status: 'ready',
    tags: ['video', 'ffmpeg', 'frames'],
    hasContract: false,
  },
  {
    id: 'sys-slack',
    name: 'Slack (System)',
    emoji: '💬',
    description: 'Control Slack from OpenClaw — reactions, pins, channel actions',
    path: '/opt/homebrew/lib/node_modules/openclaw/skills/slack/SKILL.md',
    type: 'system',
    category: 'System',
    status: 'ready',
    tags: ['slack', 'messaging'],
    hasContract: false,
  },
];

// ─── All Skills Combined ───────────────────────────────────────────────────────

export const ALL_SKILLS: Skill[] = [...CUSTOM_SKILLS, ...SYSTEM_SKILLS];

// ─── Category Colors ───────────────────────────────────────────────────────────

export const CATEGORY_EMOJI: Record<SkillCategory, string> = {
  'Development': '💻',
  'Infrastructure & Platform': '🏗️',
  'Research & Orchestration': '🔍',
  'Business Operations': '💼',
  'System': '⚙️',
};

export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  'Development': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Infrastructure & Platform': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Research & Orchestration': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Business Operations': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'System': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export const STATUS_COLORS: Record<SkillStatus, string> = {
  'ready': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'needs-setup': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'disabled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const STATUS_LABELS: Record<SkillStatus, string> = {
  'ready': '✓ Ready',
  'needs-setup': '⚠ Needs Setup',
  'disabled': '✗ Disabled',
};

// ─── Skill Stats ───────────────────────────────────────────────────────────────

export function getSkillStats() {
  const totalCustom = CUSTOM_SKILLS.length;
  const totalSystem = SYSTEM_SKILLS.length;
  const ready = ALL_SKILLS.filter(s => s.status === 'ready').length;
  const needsSetup = ALL_SKILLS.filter(s => s.status === 'needs-setup').length;
  const withContract = ALL_SKILLS.filter(s => s.hasContract).length;
  const mostUsed = [...ALL_SKILLS]
    .filter(s => s.usageCount)
    .sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
    .slice(0, 5);
  const recentlyAdded = [...CUSTOM_SKILLS]
    .filter(s => s.addedDate)
    .sort((a, b) => (b.addedDate ?? '').localeCompare(a.addedDate ?? ''))
    .slice(0, 5);
  const neverUsed = ALL_SKILLS.filter(s => !s.usageCount);

  return {
    totalCustom,
    totalSystem,
    total: totalCustom + totalSystem,
    ready,
    needsSetup,
    withContract,
    contractCoverage: Math.round((withContract / totalCustom) * 100),
    mostUsed,
    recentlyAdded,
    neverUsed,
  };
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Development',
  'Infrastructure & Platform',
  'Research & Orchestration',
  'Business Operations',
  'System',
];

// ─── New Skill Template ────────────────────────────────────────────────────────

export function generateSkillTemplate(name: string, description: string): string {
  return `# ${name} Skill

**Version:** 1.0
**Last Updated:** ${new Date().toISOString().split('T')[0]}
**Tags:** ${name.toLowerCase().replace(/\s+/g, '-')}

---

## Overview

${description}

---

## Contract

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| \`param1\` | string | ✅ | — | Description of parameter |

### Output

Description of what this skill returns.

### Errors

| Code | Condition | Recovery |
|------|-----------|---------|
| ERR_001 | Error condition | Recovery action |

### Example

\`\`\`
Example usage here
\`\`\`

---

## Instructions

Step-by-step instructions for using this skill.

1. Step one
2. Step two
3. Step three

---

## Notes

Additional notes, caveats, or important context.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | ${new Date().toISOString().split('T')[0]} | Initial creation |
`;
}
