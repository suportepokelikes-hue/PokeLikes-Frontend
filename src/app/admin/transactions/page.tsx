import { requireAdminSession } from '@/lib/auth/guards';
import { buildAdminPath, parseAdminTransactionsParams } from '@/modules/admin-shell/query';
import { AdminTransactionsPage } from '@/modules/admin-shell/admin-transactions-page';

type AdminTransactionsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminTransactionsRoute({ searchParams }: AdminTransactionsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminTransactionsParams(resolvedSearchParams);
  const rawAdjust = Array.isArray(resolvedSearchParams.adjust) ? resolvedSearchParams.adjust[0] : resolvedSearchParams.adjust;
  const isAdjustOpen = rawAdjust === '1';
  const session = await requireAdminSession(
    buildAdminPath('/admin/transactions', {
      ...filters,
      ...(isAdjustOpen ? { adjust: 1 } : {}),
    }),
  );

  return <AdminTransactionsPage session={session} filters={filters} isAdjustOpen={isAdjustOpen} />;
}
