import { requireCustomerSession } from '@/lib/auth/guards';
import { CustomerProfilePage } from '@/modules/customer-dashboard/customer-profile-page';

type CustomerProfileRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerProfileRoute({ searchParams }: CustomerProfileRouteProps) {
  const resolvedSearchParams = await searchParams;
  const rawEdit = readSingle(resolvedSearchParams.edit);
  const rawUpdated = readSingle(resolvedSearchParams.updated);
  const isEditOpen = rawEdit === '1';
  const profileUpdated = rawUpdated === '1';
  const session = await requireCustomerSession(isEditOpen ? '/app/profile?edit=1' : '/app/profile');

  return <CustomerProfilePage session={session} isEditOpen={isEditOpen} profileUpdated={profileUpdated} />;
}

function readSingle(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
