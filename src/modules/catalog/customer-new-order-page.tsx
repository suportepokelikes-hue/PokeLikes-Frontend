import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { appendAffiliateCodeToPath } from '@/lib/affiliate-code';
import { listCatalogServicesForOrderForm } from '@/lib/api/catalog';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { AffiliateCodeCapture } from './affiliate-code-capture';
import { CustomerNewOrderForm, type CustomerNewOrderService } from './customer-new-order-form';

type CustomerNewOrderPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  affiliateCodeFromUrl?: string;
  initialServiceId?: string;
  initialCategory?: string;
  initialSearch?: string;
};

export async function CustomerNewOrderPage({
  session,
  affiliateCodeFromUrl,
  initialServiceId,
  initialCategory,
  initialSearch,
}: CustomerNewOrderPageProps) {
  try {
    const services = await listCatalogServicesForOrderForm({ accessToken: session.accessToken });
    const serializableServices: CustomerNewOrderService[] = services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      publicPrice: service.publicPrice,
      socialNetwork: service.socialNetwork,
      category: service.category,
      type: service.type,
      minQuantity: service.minQuantity,
      maxQuantity: service.maxQuantity,
      availability: service.availability,
    }));
    const returnTo = appendAffiliateCodeToPath('/app/new-order', affiliateCodeFromUrl);

    return (
      <main className="page page-customer">
        <AffiliateCodeCapture initialAffiliateCode={affiliateCodeFromUrl} />
        <PageHeader eyebrow="Novo pedido" title="Novo pedido" compact />

        {serializableServices.length === 0 ? (
          <EmptyState
            title="Nenhum servico disponivel"
            description="Nao encontramos servicos suficientes para abrir o pedido rapido agora."
            actionHref={appendAffiliateCodeToPath('/app/services', affiliateCodeFromUrl)}
            actionLabel="Abrir servicos"
          />
        ) : (
          <CustomerNewOrderForm
            services={serializableServices}
            affiliateCodeFromUrl={affiliateCodeFromUrl}
            returnTo={returnTo}
            initialServiceId={initialServiceId}
            initialCategory={initialCategory}
            initialSearch={initialSearch}
          />
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel abrir o novo pedido"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel carregar os servicos agora.'}
        />
      </main>
    );
  }
}
