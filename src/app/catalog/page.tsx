import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath } from '@/lib/auth/navigation';

export const metadata: Metadata = {
  title: 'Catalogo | Pokelike',
};

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolved = await searchParams;
  const session = await getServerSession();
  const destination = buildServicesPath({
    aff: readString(resolved.aff),
    search: readString(resolved.search),
    socialNetwork: readString(resolved.socialNetwork),
    category: readString(resolved.category),
    type: readString(resolved.type),
  });

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

function buildServicesPath(params: {
  aff?: string;
  search?: string;
  socialNetwork?: string;
  category?: string;
  type?: string;
}) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  return query ? `/app/services?${query}` : '/app/services';
}
