import type { CatalogServiceResource, PaginatedResponse } from '@/lib/api/contracts';
import { apiRequest } from '@/lib/api/http';

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

export function listCatalogServices(params: CatalogListParams = {}) {
  return apiRequest<PaginatedResponse<CatalogServiceResource>>({
    path: `/catalog/services${buildQueryString(params)}`,
  });
}

export function getCatalogService(serviceId: string) {
  return apiRequest<CatalogServiceResource>({
    path: `/catalog/services/${serviceId}`,
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
