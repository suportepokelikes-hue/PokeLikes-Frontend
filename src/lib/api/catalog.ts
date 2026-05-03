import type { CatalogServiceResource, PaginatedResponse } from '@/lib/api/contracts';
import { apiRequest } from '@/lib/api/http';

type CatalogAuthOptions = {
  accessToken?: string;
};

export type CatalogListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  socialNetwork?: string;
  category?: string;
  type?: string;
};

export function listCatalogServices(params: CatalogListParams = {}, { accessToken }: CatalogAuthOptions = {}) {
  return apiRequest<PaginatedResponse<CatalogServiceResource>>({
    path: `/catalog/services${buildQueryString(params)}`,
    accessToken,
  });
}

export async function listCatalogServicesForOrderForm({ accessToken }: CatalogAuthOptions = {}) {
  const firstPage = await listCatalogServices(
    {
      page: 1,
      pageSize: 100,
      sortOrder: 'asc',
    },
    { accessToken },
  );

  if (firstPage.totalPages <= 1) {
    return firstPage.items;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      listCatalogServices(
        {
          page: index + 2,
          pageSize: 100,
          sortOrder: 'asc',
        },
        { accessToken },
      ),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.items);
}

export function getCatalogService(serviceId: string, { accessToken }: CatalogAuthOptions = {}) {
  return apiRequest<CatalogServiceResource>({
    path: `/catalog/services/${serviceId}`,
    accessToken,
  });
}

function buildQueryString(params: CatalogListParams) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}
