import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

import { CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { StatusBadge } from '@/components/ui/status-badge';
import type { SupportTicketMessageResource } from '@/lib/api/contracts';
import { getCustomerSupportTicketDetail } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';

import { SupportTicketReplyForm } from './support-forms';
import { getSupportMessageSenderLabel, getSupportTicketStatusView } from './support-view';

type CustomerSupportDetailPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  ticketId: string;
};

export async function CustomerSupportDetailPage({ session, ticketId }: CustomerSupportDetailPageProps) {
  try {
    const ticket = await getCustomerSupportTicketDetail({ accessToken: session.accessToken }, ticketId);
    const statusView = getSupportTicketStatusView(ticket.status);
    const messages = sortMessages(ticket.messages ?? []);

    return (
      <main className="page page-customer customer-support-detail-page">
        <CustomerSectionCard
          title={ticket.subject}
          meta={<StatusBadge label={statusView.label} tone={statusView.tone} />}
          actions={
            <Link href="/app/support" className="secondary-action">
              <ArrowLeft size={16} strokeWidth={2.15} aria-hidden="true" />
              Voltar
            </Link>
          }
        >
          <div className="customer-dashboard-inline-stats">
            <div>
              <span>Aberto em</span>
              <strong>{formatDateTime(ticket.createdAt)}</strong>
            </div>
            <div>
              <span>Ultima mensagem</span>
              <strong>{formatDateTime(ticket.lastMessageAt || ticket.updatedAt)}</strong>
            </div>
            <div>
              <span>Ticket</span>
              <strong>{ticket.id}</strong>
            </div>
          </div>
        </CustomerSectionCard>

        <CustomerSectionCard title="Conversa" className="customer-support-chat-card">
          {messages.length === 0 ? (
            <EmptyState
              title="Nenhuma mensagem encontrada"
              description="Quando houver interacao neste ticket, a conversa aparece aqui."
            />
          ) : (
            <div className="support-chat" aria-label="Mensagens do ticket">
              {messages.map((message) => (
                <SupportChatMessage key={message.id} message={message} />
              ))}
            </div>
          )}
        </CustomerSectionCard>

        {statusView.canReply ? (
          <CustomerSectionCard title="Responder">
            <SupportTicketReplyForm ticketId={ticket.id} returnTo={`/app/support/${ticket.id}`} />
          </CustomerSectionCard>
        ) : (
          <section className="auth-notice auth-notice-warning support-closed-notice" role="status">
            <Lock size={17} strokeWidth={2.1} aria-hidden="true" />
            <div>
              <strong>Ticket fechado</strong>
              <p>Este atendimento foi encerrado. Abra um novo ticket se precisar continuar com outro problema.</p>
            </div>
          </section>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel abrir este ticket"
          description={error instanceof ApiClientError ? error.message : 'Tente voltar para a lista e abrir a conversa novamente.'}
          actionHref="/app/support"
          actionLabel="Voltar para suporte"
        />
      </main>
    );
  }
}

function SupportChatMessage({ message }: { message: SupportTicketMessageResource }) {
  const isCustomer = message.senderRole === 'customer';
  const className = `support-message ${isCustomer ? 'support-message-customer' : 'support-message-admin'}`;

  return (
    <article className={className}>
      <div className="support-message-head">
        <strong>{getSupportMessageSenderLabel(message.senderRole)}</strong>
        <span>{formatDateTime(message.createdAt)}</span>
      </div>
      <p>{message.message}</p>
    </article>
  );
}

function sortMessages(messages: SupportTicketMessageResource[]) {
  return [...messages].sort((first, second) => {
    const firstDate = new Date(first.createdAt).getTime();
    const secondDate = new Date(second.createdAt).getTime();

    return firstDate - secondDate;
  });
}
