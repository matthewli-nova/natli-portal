/**
 * Official AI company SVG icons + model utilities
 * SVG paths sourced from simple-icons (MIT license)
 */

// ─── SVG Path Data ───────────────────────────────────────────

const PATHS = {
  // Anthropic / Claude — use the clean Anthropic "A" mark on brand orange
  claude: {
    hex: '#D97757',
    path: 'M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5527h3.7442ZM5.7506 13.7553l2.4494-6.3538 2.4494 6.3538Z',
  },
  // Google Gemini — Google Blue
  gemini: {
    hex: '#4285F4',
    path: 'M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.96-2.19-.93-3.81-2.55t-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81T4.68 11.04Q2.49 12 0 12q2.49 0 4.68.96 2.19.96 3.81 2.58t2.55 3.78Z',
  },
  // Meta (Llama) — hex #0467DF
  meta: {
    hex: '#0467DF',
    path: 'M6.915 2.013C3.137 2.013 0 6.831 0 12.778c0 3.53 1.226 6.13 3.27 6.13 1.573 0 2.613-1.037 3.985-3.84.906-1.837 1.87-4.49 2.56-6.57l.26-.8c.584-1.795 1.024-2.853 1.378-3.565C10.065 2.688 8.546 2.013 6.915 2.013zm10.17 0c-1.631 0-3.15.675-4.538 2.12.354.712.794 1.77 1.378 3.565l.26.8c.69 2.08 1.654 4.733 2.56 6.57 1.372 2.803 2.412 3.84 3.985 3.84 2.044 0 3.27-2.6 3.27-6.13 0-5.947-3.137-10.765-6.915-10.765zm-5.08 2.944c-.557 1.026-1.132 2.47-1.787 4.456l-.241.742c-.724 2.18-1.673 4.82-2.563 6.626-.717 1.46-1.294 2.338-1.98 2.84a5.51 5.51 0 0 0 1.566.224c1.99 0 3.474-1.102 4.934-3.862.502-.951 1.003-2.073 1.565-3.448l.284-.688c.47-1.129.98-2.24 1.52-3.2-.536-.962-1.049-2.07-1.52-3.2l-.284-.687a36.96 36.96 0 0 0-1.494-3.803zm-4.49-.535c.226.43.46.91.703 1.45l.37.86c.313.73.62 1.528.916 2.352-.56 1.68-1.35 3.7-2.028 5.14-.9 1.84-1.567 2.657-2.476 2.657-.77 0-1.29-.563-1.625-1.514-.294-.846-.427-1.966-.427-3.19 0-4.802 2.434-8.614 5.567-8.755zm9.97 0c3.133.141 5.567 3.953 5.567 8.755 0 1.224-.133 2.344-.427 3.19-.335.951-.855 1.514-1.625 1.514-.91 0-1.577-.817-2.477-2.658-.678-1.44-1.468-3.46-2.027-5.139.296-.824.603-1.621.917-2.352l.37-.86c.242-.54.477-1.02.702-1.45z',
  },
  // xAI / Grok — hex #000000
  x: {
    hex: '#000000',
    path: 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.145l9.181 13.36L.145 24h2.072l8.03-9.33L16.75 24h7.105l-9.62-13.838Zm-2.843 3.305-.93-1.33L2.99 1.56h3.19l5.984 8.556.93 1.33 7.783 11.128h-3.19l-6.296-9.006Z',
  },
  // Mistral — hex #FA520F
  mistral: {
    hex: '#FA520F',
    path: 'M3.428 3.428H6.86v3.432H3.428zm3.432 0h3.432v3.432H6.86zM3.428 6.86H6.86v3.432H3.428zm10.284-3.432h3.432v3.432H13.712zm3.432 0h3.432v3.432h-3.432zM13.712 6.86h3.432v3.432h-3.432zM3.428 13.712H6.86v3.432H3.428zm0 3.432H6.86v3.432H3.428zm3.432-3.432h3.432v3.432H6.86zm3.432 3.432h3.432v3.432H10.29zm3.422-3.432h3.432v3.432h-3.432zm3.432 3.432h3.432v3.432h-3.432z',
  },
  // Minimax — hex #E73562
  minimax: {
    hex: '#E73562',
    path: 'M2.35 0A2.35 2.35 0 0 0 0 2.35v19.3A2.35 2.35 0 0 0 2.35 24h19.3A2.35 2.35 0 0 0 24 21.65V2.35A2.35 2.35 0 0 0 21.65 0Zm3.914 5.739h2.88v7.565l4.856-7.565h3.05v12.522h-2.88V10.67l-4.926 7.591H6.264Zm0 0',
  },
};

// ─── Provider detection ──────────────────────────────────────

function detectProvider(modelId: string): {
  key: keyof typeof PATHS | 'default';
  hex: string;
  label: string;
} {
  const id = modelId.toLowerCase();

  if (id.includes('claude') || id.includes('anthropic')) {
    return { key: 'claude', hex: '#D97757', label: 'Anthropic' };
  }
  if (id.includes('gemini') || (id.includes('google') && !id.includes('gemma'))) {
    return { key: 'gemini', hex: '#4285F4', label: 'Google' };
  }
  if (id.includes('gemma')) {
    return { key: 'gemini', hex: '#4285F4', label: 'Google' };
  }
  if (id.includes('grok') || id.includes('x-ai') || id.includes('xai')) {
    return { key: 'x', hex: '#000000', label: 'xAI' };
  }
  if (id.includes('llama') || id.includes('meta')) {
    return { key: 'meta', hex: '#0467DF', label: 'Meta' };
  }
  if (id.includes('kimi') || id.includes('moonshot')) {
    // Use a moon-like icon — fallback to letter since no simple-icon
    return { key: 'default', hex: '#F59E0B', label: 'Moonshot' };
  }
  if (id.includes('deepseek')) {
    return { key: 'default', hex: '#1E6FFF', label: 'DeepSeek' };
  }
  if (id.includes('qwen') || id.includes('alibaba')) {
    return { key: 'default', hex: '#FF6A00', label: 'Alibaba' };
  }
  if (id.includes('minimax')) {
    return { key: 'minimax', hex: '#E73562', label: 'Minimax' };
  }
  if (id.includes('mistral')) {
    return { key: 'mistral', hex: '#FA520F', label: 'Mistral' };
  }

  return { key: 'default', hex: '#6B7280', label: 'Unknown' };
}

// ─── Short name helper ───────────────────────────────────────

export function getModelShortName(modelId: string): string {
  const id = modelId
    .replace(/^(openrouter|anthropic|moonshot|openai)\//i, '')
    .replace(/^(google|x-ai|deepseek|qwen|meta-llama|minimax|mistral)\//i, '');

  const map: Record<string, string> = {
    'claude-opus-4-6': 'Opus 4.6',
    'claude-sonnet-4-6': 'Sonnet 4.6',
    'claude-haiku-4-5': 'Haiku 4.5',
    'claude-opus-4-5': 'Opus 4.5',
    'claude-sonnet-4-5': 'Sonnet 4.5',
    'gemini-2.5-pro': 'Gemini 2.5 Pro',
    'gemini-2.5-flash': 'Gemini 2.5 Flash',
    'gemini-3-pro-preview': 'Gemini 3 Pro',
    'gemini-3-pro': 'Gemini 3 Pro',
    'deepseek-r1': 'DeepSeek R1',
    'deepseek-v4-pro': 'DeepSeek V4 Pro',
    'deepseek-v4-flash': 'DeepSeek V4 Flash',
    'grok-4': 'Grok 4',
    'grok-3': 'Grok 3',
    'kimi-latest': 'Kimi Latest',
    'kimi-k2-thinking-turbo': 'Kimi K2 Turbo',
    'qwen3-coder:free': 'Qwen3 Coder',
    'llama-3.3-70b-instruct:free': 'Llama 3.3 70B',
    'gemma-3-27b-it:free': 'Gemma 3 27B',
    'minimax-m2.5': 'Minimax M2.5',
    'minimax-m1': 'Minimax M1',
  };

  // Try direct lookup first
  for (const [k, v] of Object.entries(map)) {
    if (id.endsWith(k) || modelId.endsWith(k)) return v;
  }

  // Fallback: clean up the raw id
  return id
    .replace(/^claude-/, '')
    .replace(/:free$/, ' (Free)')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Brand color helper ──────────────────────────────────────

export function getModelBrandColor(modelId: string): string {
  return detectProvider(modelId).hex;
}

// ─── Fallback letter badge ───────────────────────────────────

function LetterBadge({
  modelId, size, hex, label,
}: { modelId: string; size: 'xs' | 'sm' | 'md'; hex: string; label: string }) {
  const letter = label.charAt(0).toUpperCase();
  const sizeClass = size === 'xs' ? 'w-4 h-4 text-[8px]' : size === 'md' ? 'w-7 h-7 text-sm' : 'w-5 h-5 text-[9px]';
  return (
    <span
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold shrink-0 text-white`}
      style={{ background: hex }}
      title={modelId}
    >
      {letter}
    </span>
  );
}

// ─── Main ModelIcon component ────────────────────────────────

interface ModelIconProps {
  modelId: string;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
}

function SvgBadge({
  path,
  hex,
  modelId,
  size,
}: { path: string; hex: string; label: string; modelId: string; size: 'xs' | 'sm' | 'md' }) {
  const dim = size === 'xs' ? 14 : size === 'md' ? 28 : 20;
  const wrapSize = size === 'xs' ? 'w-4 h-4' : size === 'md' ? 'w-7 h-7' : 'w-5 h-5';
  return (
    <span
      className={`${wrapSize} rounded-full flex items-center justify-center shrink-0`}
      style={{ background: hex }}
      title={modelId}
    >
      <svg
        viewBox="0 0 24 24"
        width={dim * 0.65}
        height={dim * 0.65}
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={path} />
      </svg>
    </span>
  );
}

export function ModelIcon({ modelId, size = 'sm', showLabel = false }: ModelIconProps) {
  const provider = detectProvider(modelId);
  const icon = provider.key === 'default'
    ? <LetterBadge modelId={modelId} size={size} hex={provider.hex} label={provider.label} />
    : <SvgBadge path={PATHS[provider.key].path} hex={provider.hex} label={provider.label} modelId={modelId} size={size} />;

  if (!showLabel) return icon;

  return (
    <span className="inline-flex items-center gap-1.5 min-w-0" title={modelId}>
      {icon}
      <span className="truncate text-xs font-medium text-muted-foreground max-w-28">
        {getModelShortName(modelId)}
      </span>
    </span>
  );
}
