import React from 'react';

// ─── Model Brand Colors & Identification ─────────────────────

interface ModelBrand {
  badge: string;
  bg: string;
  text: string;
}

const BRAND_MAP: Array<{ test: (id: string) => boolean; brand: ModelBrand }> = [
  { test: (id) => /claude|anthropic/i.test(id), brand: { badge: 'A', bg: '#D4A27A', text: '#fff' } },
  { test: (id) => /gemini|google/i.test(id) && !/gemma/i.test(id), brand: { badge: 'G', bg: '#4285F4', text: '#fff' } },
  { test: (id) => /gemma/i.test(id), brand: { badge: 'Gm', bg: '#34A853', text: '#fff' } },
  { test: (id) => /kimi|moonshot/i.test(id), brand: { badge: 'K', bg: '#F59E0B', text: '#fff' } },
  { test: (id) => /grok|x-ai|xai/i.test(id), brand: { badge: 'X', bg: '#000000', text: '#fff' } },
  { test: (id) => /deepseek/i.test(id), brand: { badge: 'D', bg: '#2563EB', text: '#fff' } },
  { test: (id) => /llama|meta/i.test(id), brand: { badge: 'L', bg: '#0866FF', text: '#fff' } },
  { test: (id) => /qwen|alibaba/i.test(id), brand: { badge: 'Q', bg: '#FF6A00', text: '#fff' } },
  { test: (id) => /minimax/i.test(id), brand: { badge: 'M', bg: '#6366F1', text: '#fff' } },
];

const DEFAULT_BRAND: ModelBrand = { badge: '?', bg: '#6B7280', text: '#fff' };

function getBrand(modelId: string): ModelBrand {
  for (const entry of BRAND_MAP) {
    if (entry.test(modelId)) return entry.brand;
  }
  return DEFAULT_BRAND;
}

export function getModelBrandColor(modelId: string): string {
  return getBrand(modelId).bg;
}

// ─── Short Name ──────────────────────────────────────────────

export function getModelShortName(modelId: string): string {
  if (!modelId) return '—';

  // Strip provider prefixes: "openrouter/google/gemini-2.5-pro" → "gemini-2.5-pro"
  // "anthropic/claude-sonnet-4-6" → "claude-sonnet-4-6"
  // "moonshot/kimi-k2-thinking-turbo" → "kimi-k2-thinking-turbo"
  let name = modelId;
  const parts = name.split('/');
  // Take the last meaningful segment
  if (parts.length >= 3) {
    // e.g. openrouter/google/gemini-2.5-pro → gemini-2.5-pro
    name = parts.slice(2).join('/');
  } else if (parts.length === 2) {
    name = parts[1];
  }

  // Strip :free suffix
  name = name.replace(/:free$/, '').replace(/-instruct$/, '');

  // Special cases for claude models: strip "claude-" prefix
  if (/^claude-/i.test(name)) {
    name = name.replace(/^claude-/i, '');
  }

  // Strip "thinking-" and "turbo" noise for kimi
  if (/^kimi-/i.test(name)) {
    name = name.replace(/^kimi-/i, 'Kimi ');
    name = name.replace(/-thinking/i, '');
    name = name.replace(/-turbo/i, '');
    name = name.replace(/\s+/g, ' ').trim();
    // Capitalize remaining parts
    return name.split(/[-\s]+/).map(w =>
      /^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ').replace(/(\d+)\s+(\d+)/g, '$1.$2');
  }

  // Convert hyphens to spaces, handle version numbers
  const segs = name.split('-');
  const words: string[] = [];
  let i = 0;
  while (i < segs.length) {
    if (/^\d+$/.test(segs[i]) && i + 1 < segs.length && /^\d+$/.test(segs[i + 1])) {
      words.push(`${segs[i]}.${segs[i + 1]}`);
      i += 2;
    } else {
      const w = segs[i];
      words.push(/^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1));
      i++;
    }
  }

  return words.join(' ');
}

// ─── Model Icon Component ────────────────────────────────────

export interface ModelIconProps {
  modelId: string;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
}

const SIZE_CLASSES: Record<string, string> = {
  xs: 'w-4 h-4 text-[8px]',
  sm: 'w-5 h-5 text-[9px]',
  md: 'w-6 h-6 text-[11px]',
};

export function ModelIcon({ modelId, size = 'sm', showLabel = false }: ModelIconProps) {
  const brand = getBrand(modelId);
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.sm;

  return (
    <span className="inline-flex items-center gap-1.5 shrink-0">
      <span
        className={`${sizeClass} rounded-full flex items-center justify-center font-bold shrink-0 leading-none`}
        style={{ backgroundColor: brand.bg, color: brand.text }}
        title={modelId}
      >
        {brand.badge}
      </span>
      {showLabel && (
        <span className="text-xs text-muted-foreground truncate">
          {getModelShortName(modelId)}
        </span>
      )}
    </span>
  );
}
