import { requireCustomerSession } from '@/lib/auth/guards';
import { CustomerProfilePage } from '@/modules/customer-dashboard/customer-profile-page';

type CustomerProfileRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerProfileRoute({ searchParams }: CustomerProfileRouteProps) {
  const resolvedSearchParams = await searchParams;
  const rawEdit = Array.isArray(resolvedSearchParams.edit) ? resolvedSearchParams.edit[0] : resolvedSearchParams.edit;
  const isEditOpen = rawEdit === '1';
  const session = await requireCustomerSession(isEditOpen ? '/app/profile?edit=1' : '/app/profile');

  return <CustomerProfilePage session={session} isEditOpen={isEditOpen} />;
}
