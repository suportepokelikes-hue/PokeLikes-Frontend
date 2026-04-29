import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath } from '@/lib/auth/navigation';

export const metadata: Metadata = {
  title: 'Servico | Pokelike',
};

type CatalogServicePageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogServicePage({ params, searchParams }: CatalogServicePageProps) {
  const { serviceId } = await params;
  const session = await getServerSession();
  const resolvedSearchParams = await searchParams;
  const destination = buildServiceDetailPath(serviceId, readString(resolvedSearchParams.aff));

  if (session.status !== 'authenticated') {
    redirect(getLoginPath({ reason: 'required', returnTo: destination }));
  }

  if (session.user.role === 'admin') {
    redirect('/admin/catalog');
  }

  redirect(destination);
}

function readString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildServiceDetailPath(serviceId: string, affiliateCode?: string) {
  const searchParams = new URLSearchParams();

  if (affiliateCode) {
    searchParams.set('aff', affiliateCode);
  }

  const query = searchParams.toString();
  return query ? `/app/services/${serviceId}?${query}` : `/app/services/${serviceId}`;
}
