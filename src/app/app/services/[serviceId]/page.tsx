import type { Metadata } from 'next';

import { requireCustomerSession } from '@/lib/auth/guards';
import { CatalogDetailPage } from '@/modules/catalog/catalog-detail-page';

export const metadata: Metadata = {
  title: 'Servico | Pokelike',
};

type CustomerServiceDetailPageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerServiceDetailPage({ params, searchParams }: CustomerServiceDetailPageProps) {
  const session = await requireCustomerSession();
  const { serviceId } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <CatalogDetailPage
      mode="customer"
      accessToken={session.accessToken}
      serviceId={serviceId}
      affiliateCodeFromUrl={readString(resolvedSearchParams.aff)}
    />
  );
}

function readString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
