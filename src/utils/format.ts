export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  return `${m}m`;
}

export function kda(k: number, d: number, a: number): string {
  return `${k} / ${d} / ${a}`;
}

export function kdRatio(k: number, d: number): string {
  return (k / Math.max(1, d)).toFixed(2);
}
