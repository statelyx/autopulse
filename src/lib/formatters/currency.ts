const DEFAULT_USD_TO_TRY = Number(process.env.NEXT_PUBLIC_USD_TRY_RATE || process.env.USD_TRY_RATE || 38.5);

export function toTryPrice(value: number) {
  return Math.round(value * DEFAULT_USD_TO_TRY);
}

export function formatTryPrice(value: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}
