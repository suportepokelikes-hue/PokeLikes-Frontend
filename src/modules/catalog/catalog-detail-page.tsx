import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Clock3, PackageSearch, Wallet } from 'lucide-react';

import { ErrorState } from '@/components/ui/error-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { appendAffiliateCodeToPath } from '@/lib/affiliate-code';
import { getCatalogService } from '@/lib/api/catalog';
import { getWalletSummary } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath, getRegisterPath } from '@/lib/auth/navigation';
import { formatMoney } from '@/lib/format';
import { PublicShell } from '@/modules/app-shell/public-shell';
import { createOrderAction } from '@/modules/customer-transactions/actions';
import { TransactionField, TransactionForm } from '@/modules/customer-transactions/transaction-form';
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
    let walletSummary: Awaited<ReturnType<typeof getWalletSummary>> | null = null;
    let isWalletSummaryUnavailable = false;

    if (session.status === 'authenticated' && session.user.role === 'customer') {
      try {
        walletSummary = await getWalletSummary({ accessToken: session.accessToken });
      } catch {
        isWalletSummaryUnavailable = true;
      }
    }

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
          <section className="public-section">
            <div className="detail-product-shell">
              <div className="detail-product-back">
                <Link href={catalogPath} className="secondary-action">
                  Voltar ao catalogo
                </Link>
              </div>

              <article className="detail-product-card">
                <div className="detail-product-grid">
                  <div className="detail-product-summary">
                    <div className="detail-product-head">
                      <div className="stack-item">
                        <span className="eyebrow">Servico</span>
                        <h1>{service.name}</h1>
                      </div>
                      <StatusBadge label={availabilityView.badgeLabel} tone={availabilityView.badgeTone} />
                    </div>

                    <div className="detail-product-price">
                      <span>A partir de</span>
                      <strong>{formatMoney(service.publicPrice)}</strong>
                    </div>

                    <div className="detail-product-meta">
                      <div>
                        <span>Rede</span>
                        <strong>{service.socialNetwork}</strong>
                      </div>
                      <div>
                        <span>Categoria</span>
                        <strong>{service.category}</strong>
                      </div>
                      <div>
                        <span>Faixa permitida</span>
                        <strong>
                          {service.minQuantity} - {service.maxQuantity}
                        </strong>
                      </div>
                      {walletSummary ? (
                        <div>
                          <span>Saldo disponivel</span>
                          <strong>{formatMoney(walletSummary.availableBalance)}</strong>
                        </div>
                      ) : isWalletSummaryUnavailable ? (
                        <div>
                          <span>Saldo disponivel</span>
                          <strong>Indisponivel agora</strong>
                        </div>
                      ) : null}
                    </div>

                    {service.description ? <p className="detail-product-description">{summarizeCopy(service.description, 220)}</p> : null}
                  </div>

                  <div id="checkout" className="detail-product-action">
                    {canPurchase ? (
                      <TransactionForm
                        title="Finalize seu pedido"
                        action={createOrderAction}
                        initialState={initialTransactionFormState}
                        submitLabel="Confirmar pedido"
                        returnTo={returnTo}
                        surface="plain"
                      >
                        <input type="hidden" name="catalogServiceId" value={service.id} />
                        <p className="checkout-summary-note">
                          A cobranca final depende da quantidade informada dentro da faixa permitida do servico.
                        </p>
                        <AffiliateCodeInput initialAffiliateCode={affiliateCodeFromUrl} />
                        <label className="auth-field">
                          <span>Quantidade</span>
                          <input
                            name="quantity"
                            type="number"
                            required
                            min={service.minQuantity}
                            max={service.maxQuantity}
                            className="transaction-input"
                          />
                          <small className="transaction-help">
                            Informe uma quantidade entre {service.minQuantity} e {service.maxQuantity} para este servico.
                          </small>
                        </label>
                        <TransactionField
                          label="Link do destino"
                          name="link"
                          type="url"
                          required
                          placeholder="https://instagram.com/seu-perfil"
                        />
                      </TransactionForm>
                    ) : shouldShowBlockedCheckout ? (
                      <div className="detail-product-state detail-checkout-decision">
                        <div className="stack-item">
                          <strong>Este servico nao esta disponivel para compra agora</strong>
                          <p>Escolha outra opcao do catalogo para continuar.</p>
                        </div>

                        <div className="detail-follow-up-grid">
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
                      </div>
                    ) : shouldShowGuestPrompt ? (
                      <div className="detail-product-state">
                        <div className="stack-item">
                          <strong>Entre para comprar</strong>
                          <p>Crie o pedido nesta mesma tela.</p>
                        </div>
                        <div className="detail-follow-up-grid">
                          <Link href={getLoginPath({ reason: 'required', returnTo })} className="primary-action">
                            Entrar
                          </Link>
                          <Link href={getRegisterPath({ reason: 'required', returnTo })} className="secondary-action">
                            Criar conta
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="detail-product-state">
                        <div className="stack-item">
                          <strong>Este acesso nao pode finalizar compra</strong>
                          <p>Volte ao catalogo ou entre com uma conta de cliente para continuar.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </div>
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
