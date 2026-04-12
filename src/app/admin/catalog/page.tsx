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
  const rawEditServiceId = Array.isArray(resolvedSearchParams.editServiceId)
    ? resolvedSearchParams.editServiceId[0]
    : resolvedSearchParams.editServiceId;
  const rawEditAffiliateServiceId = Array.isArray(resolvedSearchParams.editAffiliateServiceId)
    ? resolvedSearchParams.editAffiliateServiceId[0]
    : resolvedSearchParams.editAffiliateServiceId;
  const activeServiceId = typeof rawEditServiceId === 'string' && rawEditServiceId.trim() ? rawEditServiceId.trim() : undefined;
  const activeAffiliateServiceId =
    typeof rawEditAffiliateServiceId === 'string' && rawEditAffiliateServiceId.trim() ? rawEditAffiliateServiceId.trim() : undefined;
  const session = await requireAdminSession(
    buildAdminPath('/admin/catalog', {
      ...filters,
      ...(supplierServiceFilters.supplierName ? { supplierName: supplierServiceFilters.supplierName } : {}),
      ...(activeServiceId ? { editServiceId: activeServiceId } : {}),
      ...(activeAffiliateServiceId ? { editAffiliateServiceId: activeAffiliateServiceId } : {}),
      ...(creationDraft ? { createSupplierServiceId: creationDraft.supplierServiceId } : {}),
    }),
  );

  return (
    <AdminCatalogPage
      session={session}
      filters={filters}
      supplierServiceFilters={supplierServiceFilters}
      creationDraft={creationDraft}
      activeServiceId={activeServiceId}
      activeAffiliateServiceId={activeAffiliateServiceId}
    />
  );
}
