// ─── Model Intelligence Data ─────────────────────────────────
// Curated internal model picks based on OpenClaw usage (March 2026)
// Update this file to refresh the Intelligence page.

export interface ModelEntry {
  alias: string;
  company: string;
  label: string;
  reason: string;
  tags: string[];
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
  'gemini3-pro':         'bg-blue-100 text-blue-800',
  'gemini31-flash-lite': 'bg-blue-100 text-blue-800',
  gpt53:                 'bg-green-100 text-green-800',
  'gpt-oss-free':        'bg-green-100 text-green-800',
  grok4:                 'bg-orange-100 text-orange-800',
  'kimi-thinking':       'bg-cyan-100 text-cyan-800',
  'deepseek-r1-free':    'bg-teal-100 text-teal-800',
  'qwen3-coder-free':    'bg-rose-100 text-rose-800',
  minimax:               'bg-indigo-100 text-indigo-800',
  'glm-free':            'bg-yellow-100 text-yellow-800',
  'arcee-free':          'bg-gray-100 text-gray-700',
  'step35-free':         'bg-gray-100 text-gray-700',
  'nemotron-vl-free':    'bg-gray-100 text-gray-700',
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
    best:     { alias: 'opus',             company: 'Anthropic',   label: 'Claude Opus 4.6',       reason: 'Most powerful, best for board-level strategy, complex multi-part analysis', tags: ['Champion', 'Most Powerful'] },
    runnerUp: { alias: 'grok4',            company: 'xAI',         label: 'Grok 4',                reason: '4-agent parallel system, excellent for complex breakdowns',                tags: ['Parallel Agents'] },
    free:     { alias: 'deepseek-r1-free', company: 'DeepSeek',    label: 'DeepSeek R1',           reason: 'Strong reasoning at zero cost',                                           tags: ['Free'] },
  },
  {
    id: 'general-chat',
    name: 'General Chat, BD & Marketing',
    icon: 'MessageSquare',
    color: 'text-blue-500',
    best:     { alias: 'sonnet',       company: 'Anthropic', label: 'Claude Sonnet 4.6', reason: 'Our default, best balance of speed + quality for everyday tasks',         tags: ['Champion', 'Our Default'] },
    runnerUp: { alias: 'gpt53',        company: 'OpenAI',    label: 'GPT-5.3',           reason: 'Less restrictive, 400K context, great for content with fewer refusals', tags: ['Creativity', 'Large Context'] },
    free:     { alias: 'gpt-oss-free', company: 'OpenAI',    label: 'OpenAI 120B',       reason: 'GPT-4 class, completely free',                                          tags: ['Free'] },
  },
  {
    id: 'coding',
    name: 'Coding & Development',
    icon: 'Code2',
    color: 'text-rose-500',
    best:     { alias: 'qwen3-coder-free', company: 'Alibaba',    label: 'Qwen3 Coder',      reason: 'Purpose-built for code, 480B MoE, free',               tags: ['Champion', 'Code Expert', 'Free'] },
    runnerUp: { alias: 'sonnet',           company: 'Anthropic',  label: 'Claude Sonnet 4.6', reason: 'Excellent for architecture + code review',             tags: ['Code Expert'] },
    free:     { alias: 'arcee-free',       company: 'Arcee AI',   label: 'Arcee',             reason: 'Solid function calling + agentic coding',             tags: ['Free', 'Agent Expert'] },
  },
  {
    id: 'fast-processing',
    name: 'Fast / High-Volume Processing',
    icon: 'Zap',
    color: 'text-amber-500',
    best:     { alias: 'gemini31-flash-lite', company: 'Google',   label: 'Gemini 3.1 Flash Lite', reason: '2.5× faster than Flash, $0.25/M input, 1M ctx', tags: ['Champion', 'Fastest', 'Very Cheap'] },
    runnerUp: { alias: 'gemini-flash',        company: 'Google',   label: 'Gemini 2.5 Flash',      reason: 'Proven reliable, fast',                         tags: ['Fast'] },
    free:     { alias: 'step35-free',         company: 'StepFun',  label: 'StepFun 196B MoE',      reason: 'Fast + free',                                   tags: ['Free', 'Fast'] },
  },
  {
    id: 'long-doc-research',
    name: 'Long Document & Deep Research',
    icon: 'FileSearch',
    color: 'text-cyan-500',
    best:       { alias: 'kimi-thinking', company: 'Moonshot AI', label: 'Kimi Thinking (262K ctx)',  reason: 'Our established research engine, strong on Chinese sources', tags: ['Champion', 'Huge Context', 'Chinese Native'] },
    runnerUp:   { alias: 'gemini-pro',    company: 'Google',      label: 'Gemini 2.5 Pro (1M ctx)',   reason: 'Massive context for giant docs',                             tags: ['Huge Context'] },
    thirdPlace: { alias: 'gemini3-pro',   company: 'Google',      label: 'Gemini 3 Pro (1M ctx)',     reason: 'Most capable Gemini, best for analysis after kimi collects', tags: ['Huge Context'] },
    free:       { alias: 'kimi-thinking', company: 'Moonshot AI', label: 'Kimi Thinking',             reason: 'Also the best pick — free tier available',                  tags: ['Free', 'Huge Context'] },
  },
  {
    id: 'multimodal',
    name: 'Multimodal (Image / Video / Audio)',
    icon: 'Image',
    color: 'text-indigo-500',
    best:     { alias: 'gemini3-pro',         company: 'Google', label: 'Gemini 3 Pro',          reason: 'Strongest multimodal reasoning',        tags: ['Champion', 'Vision Leader'] },
    runnerUp: { alias: 'gemini31-flash-lite', company: 'Google', label: 'Gemini 3.1 Flash Lite', reason: 'Fast multimodal, audio included',        tags: ['Fast', 'Very Cheap'] },
    free:     { alias: 'nemotron-vl-free',    company: 'NVIDIA', label: 'Nemotron VL',           reason: 'Free video + document understanding',   tags: ['Free', 'Vision Leader'] },
  },
  {
    id: 'creative-writing',
    name: 'Creative Writing & Long-Form Content',
    icon: 'PenLine',
    color: 'text-pink-500',
    best:     { alias: 'sonnet',       company: 'Anthropic', label: 'Claude Sonnet 4.6', reason: 'Best prose quality, nuanced tone',                   tags: ['Champion', 'Best Prose', 'Creativity'] },
    runnerUp: { alias: 'gpt53',        company: 'OpenAI',    label: 'GPT-5.3',           reason: 'Great for marketing copy, slightly less conservative', tags: ['Creativity', 'Large Context'] },
    free:     { alias: 'gpt-oss-free', company: 'OpenAI',    label: 'OpenAI 120B',       reason: 'GPT-4 class, completely free',                       tags: ['Free'] },
  },
  {
    id: 'agent-automation',
    name: 'Agent / Automation Workflows',
    icon: 'Bot',
    color: 'text-emerald-500',
    best:     { alias: 'arcee-free', company: 'Arcee AI', label: 'Arcee',      reason: '131K ctx, multi-step agents, function calling, free', tags: ['Champion', 'Agent Expert', 'Free'] },
    runnerUp: { alias: 'grok4',      company: 'xAI',      label: 'Grok 4',     reason: 'Native 4-agent parallel execution',                  tags: ['Parallel Agents'] },
    free:     { alias: 'glm-free',   company: 'ZhipuAI',  label: 'GLM-4.5 Air', reason: 'Built for agent tasks',                            tags: ['Free', 'Agent Expert'] },
  },
  {
    id: 'chinese-language',
    name: 'Chinese Language',
    icon: 'Languages',
    color: 'text-red-500',
    best:     { alias: 'kimi-thinking', company: 'Moonshot AI', label: 'Kimi Thinking',  reason: 'Native Cantonese/Mandarin, deep context', tags: ['Champion', 'Chinese Native'] },
    runnerUp: { alias: 'minimax',       company: 'MiniMax',     label: 'MiniMax M2.5',   reason: 'Strong Chinese, $0.30/M',                 tags: ['Very Cheap', 'Chinese Native'] },
    free:     { alias: 'glm-free',      company: 'ZhipuAI',     label: 'GLM-4.5 Air',   reason: 'Chinese-native, agent-optimised',         tags: ['Free', 'Chinese Native'] },
  },
];

// ─── Quick Reference Table ───────────────────────────────────

export const QUICK_REF: QuickRefRow[] = [
  { task: 'Strategy / Analysis',  best: 'opus',               bestLabel: 'Claude Opus 4.6',       free: 'deepseek-r1-free', freeLabel: 'DeepSeek R1' },
  { task: 'General BD / Chat',    best: 'sonnet',             bestLabel: 'Claude Sonnet 4.6',     free: 'gpt-oss-free',     freeLabel: 'OpenAI 120B' },
  { task: 'Coding',               best: 'qwen3-coder-free',   bestLabel: 'Qwen3 Coder',           free: 'arcee-free',       freeLabel: 'Arcee' },
  { task: 'Fast / High-volume',   best: 'gemini31-flash-lite', bestLabel: 'Gemini 3.1 Flash Lite', free: 'step35-free',     freeLabel: 'StepFun 196B' },
  { task: 'Long doc / Research',  best: 'kimi-thinking',      bestLabel: 'Kimi Thinking',         free: 'kimi-thinking',    freeLabel: 'Kimi Thinking' },
  { task: 'Multimodal',           best: 'gemini3-pro',        bestLabel: 'Gemini 3 Pro',          free: 'nemotron-vl-free', freeLabel: 'Nemotron VL' },
  { task: 'Creative writing',     best: 'sonnet',             bestLabel: 'Claude Sonnet 4.6',     free: 'gpt-oss-free',     freeLabel: 'OpenAI 120B' },
  { task: 'Agent workflows',      best: 'arcee-free',         bestLabel: 'Arcee',                 free: 'glm-free',         freeLabel: 'GLM-4.5 Air' },
  { task: 'Chinese language',     best: 'kimi-thinking',      bestLabel: 'Kimi Thinking',         free: 'glm-free',         freeLabel: 'GLM-4.5 Air' },
];

// ─── Setup Recommendations ───────────────────────────────────

export const SETUP_RECS: SetupRec[] = [
  { context: 'Daily default',    current: 'sonnet',        recommended: 'sonnet',             recommendedLabel: 'Claude Sonnet 4.6',     reason: 'Keep — right balance of speed + quality' },
  { context: '#team_bd-nova',    current: 'sonnet',        recommended: 'opus',               recommendedLabel: 'Claude Opus 4.6',       reason: 'Upgrade to opus for strategy work' },
  { context: 'Cron / sub-agents',                          recommended: 'arcee-free',         recommendedLabel: 'Arcee',                 reason: '131K ctx + function calling, free' },
  { context: 'Replace gemini-flash', current: 'gemini-flash', recommended: 'gemini31-flash-lite', recommendedLabel: 'Gemini 3.1 Flash Lite', reason: '2.5× faster, cheaper' },
  { context: 'Research pipeline', current: 'kimi-thinking', recommended: 'kimi-thinking',    recommendedLabel: 'Kimi Thinking',         reason: 'Keep — best for HK/Chinese sources' },
];
