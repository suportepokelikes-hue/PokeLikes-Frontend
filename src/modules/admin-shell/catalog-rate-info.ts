import type { SupplierRateInfo } from '@/lib/api/contracts';
import { formatMoney } from '@/lib/format';

type SupplierRateSource = {
  supplierName: string;
  rate?: string | null;
  rateInfo?: SupplierRateInfo | null;
};

export function formatSupplierOriginalRate(source: SupplierRateSource) {
  const amount = source.rateInfo?.originalAmount ?? source.rate ?? '-';
  const currency = source.rateInfo?.originalCurrency ?? inferSupplierCurrency(source.supplierName);

  return `${amount} ${currency}`;
}

export function getSupplierRateBrlText(source: SupplierRateSource) {
  const converted = source.rateInfo?.convertedToBrl;

  if (converted) {
    return formatMoney(converted);
  }

  return null;
}

export function getSupplierRateConversionWarning(source: SupplierRateSource) {
  if (source.rateInfo?.convertedToBrl) {
    return null;
  }

  if (isCheapSmmGlobal(source.supplierName)) {
    return 'Conversao BRL indisponivel';
  }

  return null;
}

export function getSupplierRateBrlAmount(source: SupplierRateSource) {
  return source.rateInfo?.convertedToBrl?.amount ?? null;
}

export function buildEstimatedMarginText(publicPrice: string | undefined, supplierRateBrl: string | null | undefined) {
  if (!publicPrice || !supplierRateBrl) {
    return null;
  }

  const publicValue = parseDecimal(publicPrice);
  const supplierValue = parseDecimal(supplierRateBrl);

  if (publicValue === null || supplierValue === null) {
    return null;
  }

  const margin = publicValue - supplierValue;
  const percent = supplierValue > 0 ? (margin / supplierValue) * 100 : null;
  const formattedMargin = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  }).format(margin);

  if (percent === null || !Number.isFinite(percent)) {
    return `Margem estimada: ${formattedMargin}`;
  }

  const formattedPercent = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percent);

  return `Margem estimada: ${formattedMargin} (${formattedPercent}%)`;
}

function inferSupplierCurrency(supplierName: string) {
  if (isCheapSmmGlobal(supplierName)) {
    return 'INR';
  }

  if (supplierName.trim().toLowerCase() === 'instabarato') {
    return 'BRL';
  }

  return 'UNKNOWN';
}

function isCheapSmmGlobal(supplierName: string) {
  return supplierName.trim().toLowerCase().replace(/[^a-z]/g, '') === 'cheapsmmglobal';
}

function parseDecimal(value: string) {
  const normalized = value.replace(',', '.').trim();

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}
