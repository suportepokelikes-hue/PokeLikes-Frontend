import type { Metadata } from 'next';

import { requireCustomerSession } from '@/lib/auth/guards';
import { CatalogListPage } from '@/modules/catalog/catalog-list-page';

export const metadata: Metadata = {
  title: 'Servicos | Pokelike',
};

type CustomerServicesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerServicesPage({ searchParams }: CustomerServicesPageProps) {
  const session = await requireCustomerSession();
  const resolved = await searchParams;

  return (
    <CatalogListPage
      variant="customer"
      accessToken={session.accessToken}
      searchParams={{
        aff: readString(resolved.aff),
        search: readString(resolved.search),
        socialNetwork: readString(resolved.socialNetwork),
        category: readString(resolved.category),
        type: readString(resolved.type),
      }}
    />
  );
}

function readString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
