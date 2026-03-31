import { requireAdminSession } from '@/lib/auth/guards';
import {
  buildAdminPath,
  parseAdminCatalogCreationDraft,
  parseAdminCatalogParams,
  parseSupplierServicesParams,
} from '@/modules/admin-shell/query';
import { AdminCatalogPage } from '@/modules/admin-shell/admin-catalog-page';

type AdminCatalogRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCatalogRoute({ searchParams }: AdminCatalogRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminCatalogParams(resolvedSearchParams);
  const supplierServiceFilters = parseSupplierServicesParams(resolvedSearchParams);
  const creationDraft = parseAdminCatalogCreationDraft(resolvedSearchParams);
  const session = await requireAdminSession(buildAdminPath('/admin/catalog', filters));

  return <AdminCatalogPage session={session} filters={filters} supplierServiceFilters={supplierServiceFilters} creationDraft={creationDraft} />;
}
