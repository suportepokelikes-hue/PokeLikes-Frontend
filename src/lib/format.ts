import type { Money } from '@/lib/api/contracts';

export function formatMoney(money: Money | null | undefined): string {
  if (!money) {
    return '-';
  }

  const amount = Number(money.amount);

  if (Number.isNaN(amount)) {
    return `${money.currency} ${money.amount}`;
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}
