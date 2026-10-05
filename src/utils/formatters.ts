// Formatting utilities

export function formatNumber(value: number, decimals = 0): string {
  if (value >= 1e9) return (value / 1e9).toFixed(decimals) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(decimals) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(decimals) + 'K';
  return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRatio(value: number): string {
  return `${value.toFixed(1)}x`;
}

export function formatDate(month: string): string {
  // month is YYYY-MM
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function getTrendClass(change: number | undefined): 'up' | 'down' | 'neutral' {
  if (change === undefined) return 'neutral';
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
}

export function getTrendIcon(change: number | undefined): string {
  if (change === undefined) return 'minus';
  if (change > 0) return 'trending-up';
  if (change < 0) return 'trending-down';
  return 'minus';
}

export function getTrendLabel(change: number | undefined): string {
  if (change === undefined) return '—';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}