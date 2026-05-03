import type { Metadata } from 'next';

import { requireCustomerSession } from '@/lib/auth/guards';
import { CustomerNewOrderPage } from '@/modules/catalog/customer-new-order-page';

export const metadata: Metadata = {
  title: 'Novo pedido | Pokelike',
};

type CustomerNewOrderRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerNewOrderRoute({ searchParams }: CustomerNewOrderRouteProps) {
  const session = await requireCustomerSession();
  const resolved = await searchParams;

  return <CustomerNewOrderPage session={session} affiliateCodeFromUrl={readString(resolved.aff)} />;
}

function readString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
