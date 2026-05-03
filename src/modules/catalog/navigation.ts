import type { CatalogServiceResource } from '@/lib/api/contracts';

type BuildCustomerNewOrderPathParams = {
  serviceId: string;
  category?: string;
  affiliateCode?: string;
  search?: string;
};

export function buildCatalogDetailPath(basePath: string, serviceId: string) {
  return `${basePath}/${serviceId}`;
}

export function buildCustomerNewOrderPath({
  serviceId,
  category,
  affiliateCode,
  search,
}: BuildCustomerNewOrderPathParams) {
  const searchParams = new URLSearchParams();

  searchParams.set('serviceId', serviceId);

  if (category) {
    searchParams.set('category', category);
  }

  if (search) {
    searchParams.set('search', search);
  }

  if (affiliateCode) {
    searchParams.set('aff', affiliateCode);
  }

  return `/app/new-order?${searchParams.toString()}`;
}

export function buildCustomerNewOrderPathFromService(service: Pick<CatalogServiceResource, 'id' | 'category'>, affiliateCode?: string) {
  return buildCustomerNewOrderPath({
    serviceId: service.id,
    category: service.category,
    affiliateCode,
  });
}
