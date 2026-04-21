import { requireAdminSession } from '@/lib/auth/guards';
import { AdminAffiliatePayoutsPage } from '@/modules/admin-shell/admin-affiliate-payouts-page';
import {
  buildAdminPath,
  parseAdminAffiliatePayoutCreationDraft,
  parseAdminAffiliatePayoutsParams,
} from '@/modules/admin-shell/query';

type AdminAffiliatePayoutsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminAffiliatePayoutsRoute({ searchParams }: AdminAffiliatePayoutsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminAffiliatePayoutsParams(resolvedSearchParams);
  const creationDraft = parseAdminAffiliatePayoutCreationDraft(resolvedSearchParams);
  const rawCreate = Array.isArray(resolvedSearchParams.create) ? resolvedSearchParams.create[0] : resolvedSearchParams.create;
  const isCreateOpen = rawCreate === '1';
  const session = await requireAdminSession(
    buildAdminPath('/admin/affiliate-payouts', {
      ...filters,
      ...(isCreateOpen ? { create: 1 } : {}),
    }),
  );

  return (
    <AdminAffiliatePayoutsPage
      session={session}
      filters={filters}
      isCreateOpen={isCreateOpen}
      creationDraft={creationDraft}
    />
  );
}
