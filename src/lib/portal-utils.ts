// Shared helper functions used across dashboard components

export function formatTimeAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  } catch { return '—'; }
}

export function timeUntil(ms: number): string {
  const diff = ms - Date.now();
  if (diff <= 0) return 'now';
  if (diff < 60_000) return `${Math.ceil(diff / 1000)}s`;
  if (diff < 3_600_000) {
    const mins = Math.floor(diff / 60_000);
    return `${mins}m`;
  }
  if (diff < 86_400_000) {
    const hrs = Math.floor(diff / 3_600_000);
    const mins = Math.floor((diff % 3_600_000) / 60_000);
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  return `${Math.floor(diff / 86_400_000)}d`;
}

export function relativeTime(ageMs: number): string {
  if (ageMs < 30_000) return 'just now';
  if (ageMs < 60_000) return `${Math.floor(ageMs / 1000)}s ago`;
  if (ageMs < 3_600_000) return `${Math.floor(ageMs / 60_000)}m ago`;
  if (ageMs < 86_400_000) return `${Math.floor(ageMs / 3_600_000)}h ago`;
  return `${Math.floor(ageMs / 86_400_000)}d ago`;
}

export function estimateCost(tokens: number): string {
  const cost = (tokens / 1_000_000) * 15;
  if (cost < 0.01) return '<$0.01';
  return `~$${cost.toFixed(2)}`;
}
