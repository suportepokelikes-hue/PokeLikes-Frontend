import type { Metadata } from 'next';

import { CatalogDetailPage } from '@/modules/catalog/catalog-detail-page';

export const metadata: Metadata = {
  title: 'Servico | Pokelike',
};

type CatalogServicePageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogServicePage({ params, searchParams }: CatalogServicePageProps) {
  const { serviceId } = await params;
  const resolvedSearchParams = await searchParams;
  const affiliateCodeFromUrl = readString(resolvedSearchParams.aff);

  return <CatalogDetailPage serviceId={serviceId} affiliateCodeFromUrl={affiliateCodeFromUrl} />;
}

function readString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
