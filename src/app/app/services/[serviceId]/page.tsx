import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { requireCustomerSession } from '@/lib/auth/guards';
import { buildCustomerNewOrderPath } from '@/modules/catalog/navigation';

export const metadata: Metadata = {
  title: 'Novo pedido | Pokelike',
};

type CustomerServiceDetailPageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerServiceDetailPage({ params, searchParams }: CustomerServiceDetailPageProps) {
  await requireCustomerSession();
  const { serviceId } = await params;
  const resolvedSearchParams = await searchParams;
  const destination = buildCustomerNewOrderPath({
    serviceId,
    affiliateCode: readString(resolvedSearchParams.aff),
  });

  redirect(destination);
}

function readString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
