import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { appendAffiliateCodeToPath } from '@/lib/affiliate-code';
import { getCatalogService } from '@/lib/api/catalog';
import type { CatalogServiceResource } from '@/lib/api/contracts';
import { ApiClientError } from '@/lib/api/http';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath, getRegisterPath } from '@/lib/auth/navigation';
import { formatDateTime, formatMoney } from '@/lib/format';
import { createOrderAction } from '@/modules/customer-transactions/actions';
import { TransactionField, TransactionForm, TransactionTextarea } from '@/modules/customer-transactions/transaction-form';
import { initialTransactionFormState } from '@/modules/customer-transactions/types';
import { AffiliateCodeCapture } from './affiliate-code-capture';
import { AffiliateCodeInput } from './affiliate-code-input';

type CatalogDetailPageProps = {
  serviceId: string;
  affiliateCodeFromUrl?: string;
};

export async function CatalogDetailPage({ serviceId, affiliateCodeFromUrl }: CatalogDetailPageProps) {
  try {
    const session = await getServerSession();
    const service = await getCatalogService(serviceId);
    const returnTo = appendAffiliateCodeToPath(`/catalog/${serviceId}`, affiliateCodeFromUrl);

    return (
      <main className="page page-public">
        <AffiliateCodeCapture initialAffiliateCode={affiliateCodeFromUrl} />
        <PageHeader
          eyebrow="Catalogo"
          title={service.name}
          actions={
            <div className="page-actions">
              <StatusBadge label={getAvailabilityLabel(service)} tone={mapAvailabilityTone(service)} />
              {session.status === 'authenticated' && session.user.role === 'customer' ? (
                <Link href="#checkout" className="primary-action">
                  Comprar agora
                </Link>
              ) : null}
              <Link href={appendAffiliateCodeToPath('/catalog', affiliateCodeFromUrl)} className="secondary-action">
                Voltar ao catalogo
              </Link>
            </div>
          }
        />

        <section className="public-hero-grid">
          <article className="public-spotlight">
            <div className="public-spotlight-head">
              <span className="eyebrow">Servico</span>
              <StatusBadge label={getAvailabilityLabel(service)} tone={mapAvailabilityTone(service)} />
            </div>
            <h2>{formatMoney(service.publicPrice)}</h2>
            <p>{service.description ? summarizeCopy(service.description, 140) : service.availability.reason}</p>
            <div className="public-highlight-list">
              <div>
                <span>Rede</span>
                <strong>{service.socialNetwork}</strong>
              </div>
              <div>
                <span>Categoria</span>
                <strong>{service.category}</strong>
              </div>
              <div>
                <span>Faixa</span>
                <strong>
                  {service.minQuantity} - {service.maxQuantity}
                </strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{service.status}</strong>
              </div>
            </div>
          </article>

          {session.status === 'authenticated' && session.user.role === 'customer' ? (
            <div id="checkout" className="detail-checkout-shell">
              <TransactionForm
                title="Criar pedido"
                description="Quantidade e link."
                action={createOrderAction}
                initialState={initialTransactionFormState}
                submitLabel="Confirmar pedido"
                returnTo={returnTo}
              >
                <input type="hidden" name="catalogServiceId" value={service.id} />
                <AffiliateCodeInput initialAffiliateCode={affiliateCodeFromUrl} />
                <div className="transaction-grid">
                  <TransactionField label="Servico" name="serviceName" defaultValue={service.name} readOnly />
                  <TransactionField
                    label="Quantidade"
                    name="quantity"
                    type="number"
                    required
                    min={service.minQuantity}
                    max={service.maxQuantity}
                  />
                </div>
                <div className="transaction-grid">
                  <TransactionField
                    label="Link do destino"
                    name="link"
                    type="url"
                    required
                    placeholder="https://instagram.com/seu-perfil"
                  />
                  <TransactionField label="Repeticoes" name="runs" type="number" placeholder="Opcional" />
                </div>
                <div className="transaction-grid">
                  <TransactionField label="Intervalo" name="interval" type="number" placeholder="Opcional" />
                  <TransactionField label="Numero de resposta" name="answerNumber" placeholder="Opcional" />
                </div>
                <TransactionTextarea
                  label="Comentarios"
                  name="comments"
                  placeholder="Um comentario por linha, se o servico exigir."
                />
              </TransactionForm>
            </div>
          ) : (
            <article id="checkout" className="detail-card detail-checkout-card">
              <div className="stack-item">
                <strong>Entre para comprar</strong>
                <p>Crie o pedido nesta mesma tela.</p>
                <div className="page-actions">
                  <Link href={getLoginPath({ reason: 'required', returnTo })} className="primary-action">
                    Entrar
                  </Link>
                  <Link href={getRegisterPath({ reason: 'required', returnTo })} className="secondary-action">
                    Criar conta
                  </Link>
                </div>
              </div>
            </article>
          )}
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Compra</h2>
            <dl className="detail-list">
              <div>
                <dt>Preco</dt>
                <dd>{formatMoney(service.publicPrice)}</dd>
              </div>
              <div>
                <dt>Minimo</dt>
                <dd>{service.minQuantity}</dd>
              </div>
              <div>
                <dt>Maximo</dt>
                <dd>{service.maxQuantity}</dd>
              </div>
              <div>
                <dt>Tipo</dt>
                <dd>{service.type}</dd>
              </div>
            </dl>
          </article>

          <article className="detail-card">
            <h2>Disponibilidade</h2>
            <dl className="detail-list">
              <div>
                <dt>Compra agora</dt>
                <dd>{service.availability.isPurchasable ? 'Liberada' : 'Em espera'}</dd>
              </div>
              <div>
                <dt>Situacao</dt>
                <dd>{getAvailabilityLabel(service)}</dd>
              </div>
              <div>
                <dt>Motivo</dt>
                <dd>{service.availability.reason}</dd>
              </div>
              <div>
                <dt>Ultima checagem</dt>
                <dd>{formatDateTime(service.supplierService.providerStatus?.lastCheckedAt)}</dd>
              </div>
            </dl>
          </article>

          {service.description ? (
            <article className="detail-card detail-card-wide">
              <h2>Sobre o servico</h2>
              <p>{service.description}</p>
            </article>
          ) : null}

          <article className="detail-card">
            <h2>Origem</h2>
            <dl className="detail-list">
              <div>
                <dt>Fornecedor</dt>
                <dd>{service.supplierService.supplierName}</dd>
              </div>
              <div>
                <dt>Codigo externo</dt>
                <dd>{service.supplierService.supplierServiceId}</dd>
              </div>
              <div>
                <dt>Nome de origem</dt>
                <dd>{service.supplierService.name || '-'}</dd>
              </div>
            </dl>
          </article>
        </section>
      </main>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound();
    }

    return (
      <main className="page page-public">
        <ErrorState
          title="Nao foi possivel carregar o servico"
          description="Nao foi possivel buscar os dados deste servico."
        />
      </main>
    );
  }
}

function mapAvailabilityTone(service: CatalogServiceResource) {
  if (!service.availability.isPurchasable) {
    return 'danger';
  }

  if (service.availability.providerStatus === 'degraded_low_balance') {
    return 'warning';
  }

  return 'success';
}

function getAvailabilityLabel(service: CatalogServiceResource) {
  if (!service.availability.isPurchasable) {
    return 'Indisponivel';
  }

  if (service.availability.providerStatus === 'degraded_low_balance') {
    return 'Com atencao';
  }

  return 'Disponivel';
}

function summarizeCopy(value: string, maxLength: number) {
  const compact = value.replace(/\s+/g, ' ').trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, Math.max(maxLength - 1, 1)).trimEnd()}...`;
}
