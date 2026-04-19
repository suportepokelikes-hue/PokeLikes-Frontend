import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Clock3, PackageSearch, Wallet } from 'lucide-react';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { appendAffiliateCodeToPath } from '@/lib/affiliate-code';
import { getCatalogService } from '@/lib/api/catalog';
import { ApiClientError } from '@/lib/api/http';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath, getRegisterPath } from '@/lib/auth/navigation';
import { formatDateTime, formatMoney } from '@/lib/format';
import { PublicShell } from '@/modules/app-shell/public-shell';
import { createOrderAction } from '@/modules/customer-transactions/actions';
import { TransactionField, TransactionForm, TransactionTextarea } from '@/modules/customer-transactions/transaction-form';
import { initialTransactionFormState } from '@/modules/customer-transactions/types';
import { AffiliateCodeCapture } from './affiliate-code-capture';
import { AffiliateCodeInput } from './affiliate-code-input';
import { getCatalogAlternativePath, getCatalogAvailabilityView } from './availability-view';

type CatalogDetailPageProps = {
  serviceId: string;
  affiliateCodeFromUrl?: string;
};

export async function CatalogDetailPage({ serviceId, affiliateCodeFromUrl }: CatalogDetailPageProps) {
  const session = await getServerSession();

  try {
    const service = await getCatalogService(serviceId);
    const returnTo = appendAffiliateCodeToPath(`/catalog/${serviceId}`, affiliateCodeFromUrl);
    const availabilityView = getCatalogAvailabilityView(service);
    const alternativeCatalogPath = appendAffiliateCodeToPath(getCatalogAlternativePath(service), affiliateCodeFromUrl);
    const catalogPath = appendAffiliateCodeToPath('/catalog', affiliateCodeFromUrl);
    const canPurchase =
      session.status === 'authenticated' && session.user.role === 'customer' && service.availability.isPurchasable;
    const shouldShowGuestPrompt = session.status !== 'authenticated' || session.user.role !== 'customer';
    const shouldShowBlockedCheckout = !service.availability.isPurchasable;

    return (
      <PublicShell session={session}>
        <main className="page page-public">
          <AffiliateCodeCapture initialAffiliateCode={affiliateCodeFromUrl} />
          <PageHeader
            eyebrow="Catalogo"
            title={service.name}
            description={availabilityView.detailDescription}
            actions={
              <div className="page-actions">
                <StatusBadge label={availabilityView.badgeLabel} tone={availabilityView.badgeTone} />
                {service.availability.isPurchasable ? (
                  session.status === 'authenticated' && session.user.role === 'customer' ? (
                    <Link href="#checkout" className="primary-action">
                      Comprar agora
                    </Link>
                  ) : null
                ) : (
                  <Link href={alternativeCatalogPath} className="primary-action">
                    Ver outra opcao
                  </Link>
                )}
                <Link href={catalogPath} className="secondary-action">
                  Voltar ao catalogo
                </Link>
              </div>
            }
          />

          <section className="public-hero-grid public-section">
            <article className="public-spotlight">
              <div className="public-spotlight-head">
                <span className="eyebrow">Servico</span>
                <StatusBadge label={availabilityView.badgeLabel} tone={availabilityView.badgeTone} />
              </div>
              <h2>{formatMoney(service.publicPrice)}</h2>
              <div className={`availability-callout availability-callout-${availabilityView.badgeTone}`}>
                <strong>{availabilityView.detailHeadline}</strong>
                <p>{availabilityView.detailDescription}</p>
              </div>
              <p>{service.description ? summarizeCopy(service.description, 140) : availabilityView.cardDescription}</p>
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
                  <span>Compra</span>
                  <strong>{availabilityView.purchaseLabel}</strong>
                </div>
              </div>
            </article>

            {canPurchase ? (
              <div id="checkout" className="detail-checkout-shell detail-checkout-stack">
                {availabilityView.state === 'degraded' ? (
                  <section className="detail-card detail-note detail-note-warning">
                    <strong>Compra aberta, mas com atencao</strong>
                    <p>{availabilityView.nextStep}</p>
                  </section>
                ) : null}
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
            ) : shouldShowBlockedCheckout ? (
              <article id="checkout" className="detail-card detail-checkout-card detail-checkout-decision">
                <div className="stack-item">
                  <strong>{availabilityView.detailHeadline}</strong>
                  <p>{availabilityView.detailDescription}</p>
                </div>

                <div className={`availability-callout availability-callout-${availabilityView.badgeTone}`}>
                  <strong>O que voce pode fazer agora</strong>
                  <p>{availabilityView.nextStep}</p>
                </div>

                <div className="detail-follow-up-grid">
                  <Link href={catalogPath} className="secondary-action">
                    <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
                    Voltar ao catalogo
                  </Link>
                  <Link href={alternativeCatalogPath} className="primary-action">
                    <PackageSearch size={16} strokeWidth={2.15} aria-hidden="true" />
                    Procurar outro servico
                  </Link>
                  {session.status === 'authenticated' && session.user.role === 'customer' ? (
                    <Link href="/app/orders" className="secondary-action">
                      <Clock3 size={16} strokeWidth={2.15} aria-hidden="true" />
                      Ver meus pedidos
                    </Link>
                  ) : null}
                  {session.status === 'authenticated' && session.user.role === 'customer' ? (
                    <Link href="/app/wallet" className="secondary-action">
                      <Wallet size={16} strokeWidth={2.15} aria-hidden="true" />
                      Ver carteira
                    </Link>
                  ) : null}
                </div>
              </article>
            ) : shouldShowGuestPrompt ? (
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
            ) : (
              <article id="checkout" className="detail-card detail-checkout-card">
                <div className="stack-item">
                  <strong>Este acesso nao pode finalizar compra</strong>
                  <p>Volte ao catalogo ou entre com uma conta de cliente para continuar.</p>
                </div>
              </article>
            )}
          </section>

          <section className="detail-grid public-section">
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
                  <dd>{availabilityView.purchaseLabel}</dd>
                </div>
                <div>
                  <dt>Situacao</dt>
                  <dd>{availabilityView.badgeLabel}</dd>
                </div>
                <div>
                  <dt>Leitura do momento</dt>
                  <dd>{availabilityView.detailDescription}</dd>
                </div>
                <div>
                  <dt>O que fazer agora</dt>
                  <dd>{availabilityView.nextStep}</dd>
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
      </PublicShell>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound();
    }

    return (
      <PublicShell session={session}>
        <main className="page page-public">
          <ErrorState
            title="Nao foi possivel carregar o servico"
            description="Nao foi possivel buscar os dados deste servico."
          />
        </main>
      </PublicShell>
    );
  }
}

function summarizeCopy(value: string, maxLength: number) {
  const compact = value.replace(/\s+/g, ' ').trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, Math.max(maxLength - 1, 1)).trimEnd()}...`;
}
