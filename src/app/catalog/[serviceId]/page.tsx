import type { Metadata } from 'next';

import { CatalogDetailPage } from '@/modules/catalog/catalog-detail-page';

export const metadata: Metadata = {
  title: 'Servico | Likes Uai',
};

type CatalogServicePageProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function CatalogServicePage({ params }: CatalogServicePageProps) {
  const { serviceId } = await params;

  return <CatalogDetailPage serviceId={serviceId} />;
}
