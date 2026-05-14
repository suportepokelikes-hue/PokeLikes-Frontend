import { CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { StatusBadge } from '@/components/ui/status-badge';
import type { SessionState } from '@/lib/auth/session';

type CustomerAffiliatePageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function CustomerAffiliatePage({ session }: CustomerAffiliatePageProps) {
  void session;

  return (
    <main className="page page-customer">
      <section className="customer-dashboard-hero">
        <CustomerSectionCard title="Programa de afiliados" meta={<StatusBadge label="Em breve" tone="warning" />}>
          <div className="customer-dashboard-command-copy">
            <h2>Em breve</h2>
            <p>Estamos preparando uma experiencia mais segura e completa para afiliados.</p>
          </div>
        </CustomerSectionCard>
      </section>
    </main>
  );
}
