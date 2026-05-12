import { requireCustomerSession } from '@/lib/auth/guards';
import type { SupportTicketStatus } from '@/lib/api/contracts';
import { buildAdminPath } from '@/modules/admin-shell/query';
import { CustomerSupportPage } from '@/modules/customer-support/customer-support-page';

const SUPPORT_STATUS_VALUES = ['open', 'waiting_customer', 'closed'] as const;

type CustomerSupportRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerSupportRoute({ searchParams }: CustomerSupportRouteProps) {
  const resolvedSearchParams = await searchParams;
  const rawPage = readSingle(resolvedSearchParams.page);
  const rawStatus = readSingle(resolvedSearchParams.status);
  const rawSearch = readSingle(resolvedSearchParams.search);
  const page = parsePositivePage(rawPage);
  const status = parseSupportStatus(rawStatus);
  const search = typeof rawSearch === 'string' && rawSearch.trim() ? rawSearch.trim() : undefined;
  const session = await requireCustomerSession(
    buildAdminPath('/app/support', {
      page: page > 1 ? page : undefined,
      status,
      search,
    }),
  );

  return <CustomerSupportPage session={session} page={page} status={status} search={search} />;
}

function parsePositivePage(value: string | undefined) {
  if (!value) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseSupportStatus(value: string | undefined): SupportTicketStatus | undefined {
  if (!value) {
    return undefined;
  }

  return SUPPORT_STATUS_VALUES.includes(value as SupportTicketStatus) ? (value as SupportTicketStatus) : undefined;
}

function readSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
