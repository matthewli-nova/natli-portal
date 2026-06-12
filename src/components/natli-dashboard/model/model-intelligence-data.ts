// ─── Model Intelligence Data ─────────────────────────────────
// Curated internal model picks based on Hermes Claw usage (March 2026)
// Update this file to refresh the Intelligence page.

export interface ModelEntry {
  alias: string;
  company: string;
  label: string;
  reason: string;
  tags: string[];
  pricing?: { input: number; output: number; free: boolean };
  context?: number;
}

export interface CategoryLeader {
  id: string;
  name: string;
  icon: string;
  color: string;
  best: ModelEntry;
  runnerUp: ModelEntry;
  thirdPlace?: ModelEntry;
  free: ModelEntry;
}

export interface QuickRefRow {
  task: string;
  best: string;
  bestLabel: string;
  free: string;
  freeLabel: string;
}

export interface SetupRec {
  context: string;
  current?: string;
  recommended: string;
  recommendedLabel: string;
  reason: string;
}

// ─── Provider color map (alias prefix → badge classes) ───────

export const PROVIDER_COLORS: Record<string, string> = {
  opus:                  'bg-purple-100 text-purple-800',
  sonnet:                'bg-purple-100 text-purple-800',
  haiku:                 'bg-purple-100 text-purple-800',
  'gemini-flash':        'bg-blue-100 text-blue-800',
  'gemini-pro':          'bg-blue-100 text-blue-800',
  'gemini3-flash':       'bg-blue-100 text-blue-800',
  'gpt53':               'bg-green-100 text-green-800',
  grok4:                 'bg-orange-100 text-orange-800',
  'grok41-fast':         'bg-orange-100 text-orange-800',
  'kimi-thinking':       'bg-cyan-100 text-cyan-800',
  'deepseek-r1':         'bg-teal-100 text-teal-800',
  'deepseek-v4-flash':   'bg-teal-100 text-teal-800',
  'deepseek-v4-pro':     'bg-teal-100 text-teal-800',
  'qwen35-plus':         'bg-rose-100 text-rose-800',
  'qwen35-max':          'bg-rose-100 text-rose-800',
  'qwen35-flash':        'bg-rose-100 text-rose-800',
  minimax:               'bg-indigo-100 text-indigo-800',
  'llama-free':          'bg-gray-100 text-gray-700',
  'gemma-free':          'bg-gray-100 text-gray-700',
};

export function getProviderColor(alias: string): string {
  return PROVIDER_COLORS[alias] ?? 'bg-gray-100 text-gray-700';
}

// Tag color map
export const TAG_COLORS: Record<string, string> = {
  'Champion':         'bg-amber-100 text-amber-800 border-amber-200',
  'Free':             'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Very Cheap':       'bg-lime-100 text-lime-800 border-lime-200',
  'Fastest':          'bg-sky-100 text-sky-800 border-sky-200',
  'Fast':             'bg-sky-100 text-sky-800 border-sky-200',
  'Huge Context':     'bg-violet-100 text-violet-800 border-violet-200',
  'Large Context':    'bg-violet-100 text-violet-800 border-violet-200',
  'Code Expert':      'bg-rose-100 text-rose-800 border-rose-200',
  'Most Powerful':    'bg-purple-100 text-purple-800 border-purple-200',
  'Best Prose':       'bg-pink-100 text-pink-800 border-pink-200',
  'Creativity':       'bg-pink-100 text-pink-800 border-pink-200',
  'Agent Expert':     'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Parallel Agents':  'bg-orange-100 text-orange-800 border-orange-200',
  'Chinese Native':   'bg-red-100 text-red-800 border-red-200',
  'Vision Leader':    'bg-blue-100 text-blue-800 border-blue-200',
  'Our Default':      'bg-teal-100 text-teal-800 border-teal-200',
};

export function getTagColor(tag: string): string {
  return TAG_COLORS[tag] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

// ─── Category Leaders ────────────────────────────────────────

export const CATEGORY_LEADERS: CategoryLeader[] = [
  {
    id: 'strategic-analysis',
    name: 'Strategic Analysis & Deep Reasoning',
    icon: 'Brain',
    color: 'text-purple-500',
    best:     { alias: 'deepseek-v4-pro', company: 'DeepSeek', label: 'DeepSeek V4 Pro', reason: '$1.74/$3.48M, 1M ctx. 49B MoE — V4 flagship with massive reasoning power.', tags: ['Champion', 'Most Powerful'] },
    runnerUp: { alias: 'opus', company: 'Anthropic', label: 'Claude Opus 4.6', reason: '$15/$75M, 200K ctx. Most powerful for strategy.', tags: ['Most Powerful'] },
    free:     { alias: 'deepseek-v4-flash', company: 'DeepSeek', label: 'DeepSeek V4 Flash', reason: '$0.14/$0.28M (Near Free). 13B MoE — best cost-performance in class.', tags: ['Free', 'Very Cheap'] },
  },
  {
    id: 'general-chat',
    name: 'General Chat, BD & Marketing',
    icon: 'MessageSquare',
    color: 'text-blue-500',
    best:     { alias: 'sonnet', company: 'Anthropic', label: 'Claude Sonnet 4.6', reason: '$3/$3M, 200K ctx. Our primary default.', tags: ['Champion', 'Our Default'] },
    runnerUp: { alias: 'gpt53', company: 'OpenAI', label: 'GPT-5.3', reason: '$10/$30M, 128K ctx. High quality creative.', tags: ['Creativity'] },
    free:     { alias: 'llama-free', company: 'Meta', label: 'Llama 3.3 70B', reason: 'FREE, 128K ctx. Reliable OSS class.', tags: ['Free'] },
  },
  {
    id: 'web-research',
    name: 'Web Research & Agentic Search',
    icon: 'Search',
    color: 'text-teal-500',
    best:       { alias: 'qwen35-plus', company: 'Alibaba', label: 'Qwen3.5 Plus', reason: '$0.26/$0.26M, 1M ctx. PRIMARY web research.', tags: ['Champion', 'Agent Expert', 'Huge Context'] },
    runnerUp:   { alias: 'gemini-pro', company: 'Google', label: 'Gemini 2.5 Pro', reason: '$1.25/$10M, 1M ctx. Best for code + research.', tags: ['Huge Context'] },
    free:       { alias: 'gemini3-flash', company: 'Google', label: 'Gemini 3 Flash Preview', reason: 'FREE, 1M ctx. Best free choice.', tags: ['Free', 'Huge Context'] },
  },
  {
    id: 'fast-processing',
    name: 'Fast / High-Volume Processing',
    icon: 'Zap',
    color: 'text-amber-500',
    best:     { alias: 'deepseek-v4-flash', company: 'DeepSeek', label: 'DeepSeek V4 Flash', reason: '$0.14/$0.28M, 1M ctx. 13B MoE — fastest and cheapest.', tags: ['Champion', 'Fastest', 'Very Cheap'] },
    runnerUp: { alias: 'gemini3-flash', company: 'Google', label: 'Gemini 3 Flash Preview', reason: 'FREE, 1M ctx. Fastest in preview.', tags: ['Fast', 'Free'] },
    free:     { alias: 'gemma-free', company: 'Google', label: 'Gemma 3 27B', reason: 'FREE, 32K ctx. Lightweight and fast.', tags: ['Free', 'Fast'] },
  },
  {
    id: 'chinese-language',
    name: 'Chinese Language specialists',
    icon: 'Languages',
    color: 'text-red-500',
    best:     { alias: 'kimi-thinking', company: 'Moonshot AI', label: 'Kimi K2 Thinking Turbo', reason: '$2.5/$10M, 262K ctx. Best for Chinese/HK context.', tags: ['Champion', 'Chinese Native'] },
    runnerUp: { alias: 'minimax', company: 'MiniMax', label: 'MiniMax M2.5', reason: '$0.27/$1.1M, 200K ctx. Strong Chinese speed.', tags: ['Very Cheap', 'Chinese Native'] },
    free:     { alias: 'qwen35-flash', company: 'Alibaba', label: 'Qwen3.5 Flash', reason: '$0.05/$0.2M (Near Free). Best for high volume CN.', tags: ['Fast'] },
  },
];

// ─── Quick Reference Table ───────────────────────────────────

export const QUICK_REF: QuickRefRow[] = [
  { task: 'Strategy / Analysis',  best: 'opus',               bestLabel: 'Claude Opus 4.6',       free: 'deepseek-r1',     freeLabel: 'DeepSeek R1' },
  { task: 'General BD / Chat',    best: 'sonnet',             bestLabel: 'Claude Sonnet 4.6',     free: 'llama-free',      freeLabel: 'Llama 3.3' },
  { task: 'Web Research',         best: 'qwen35-plus',        bestLabel: 'Qwen3.5 Plus',          free: 'gemini3-flash',   freeLabel: 'Gemini 3 Flash' },
  { task: 'Fast Processing',      best: 'deepseek-v4-flash', bestLabel: 'DeepSeek V4 Flash',   free: 'deepseek-v4-flash', freeLabel: 'DeepSeek V4 Flash' },
  { task: 'Chinese Reasoning',    best: 'kimi-thinking',      bestLabel: 'Kimi K2 Thinking',      free: 'minimax',         freeLabel: 'MiniMax M2.5' },
];

// ─── Setup Recommendations ───────────────────────────────────

export const SETUP_RECS: SetupRec[] = [
  { context: 'Daily default',    current: 'sonnet',        recommended: 'sonnet',             recommendedLabel: 'Claude Sonnet 4.6',     reason: 'Gold standard for workflow stability.' },
  { context: '#nat-4_deep_research', current: 'kimi',     recommended: 'qwen35-plus',        recommendedLabel: 'Qwen3.5 Plus',          reason: 'Switch to Qwen3.5 Plus for superior web research grounding.' },
  { context: 'Cron / sub-agents',                          recommended: 'deepseek-v4-flash', recommendedLabel: 'DeepSeek V4 Flash',      reason: '$0.14/M input — ultra cheap at 1M ctx for automated tasks.' },
  { context: 'Strategy / Analysis', current: 'opus',         recommended: 'deepseek-v4-pro',   recommendedLabel: 'DeepSeek V4 Pro',       reason: '$1.74/M input, 1M ctx — 49B MoE flagship, best value for deep reasoning.' },
  { context: 'Chinese strategy', current: 'sonnet',        recommended: 'kimi-thinking',      recommendedLabel: 'Kimi K2 Thinking',      reason: 'Better cultural nuance for Chinese documents.' },
];
