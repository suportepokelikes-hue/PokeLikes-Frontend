import type { Metadata } from 'next';

import { CatalogListPage } from '@/modules/catalog/catalog-list-page';

export const metadata: Metadata = {
  title: 'Catalogo | Instabarato',
};

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolved = await searchParams;

  return (
    <CatalogListPage
      searchParams={{
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
