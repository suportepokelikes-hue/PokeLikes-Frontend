import { requireAdminSession } from '@/lib/auth/guards';
import { buildAdminPath, parseAdminTransactionsParams } from '@/modules/admin-shell/query';
import { AdminTransactionsPage } from '@/modules/admin-shell/admin-transactions-page';

type AdminTransactionsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminTransactionsRoute({ searchParams }: AdminTransactionsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminTransactionsParams(resolvedSearchParams);
  const session = await requireAdminSession(buildAdminPath('/admin/transactions', filters));

  return <AdminTransactionsPage session={session} filters={filters} />;
}
