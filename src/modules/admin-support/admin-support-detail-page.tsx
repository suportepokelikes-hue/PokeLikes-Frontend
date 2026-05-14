import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Lock } from 'lucide-react';

import { AdminSectionCard } from '@/components/ui/admin-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import type { SupportTicketMessageResource } from '@/lib/api/contracts';
import { getAdminSupportTicketDetail } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import {
  closeAdminSupportTicketAction,
  createAdminSupportTicketMessageAction,
} from '@/modules/admin-shell/actions';

import {
  getAdminSupportMessageSenderLabel,
  getAdminSupportTicketStatusView,
  sortSupportMessages,
} from './support-view';

type AdminSupportDetailPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  ticketId: string;
};

export async function AdminSupportDetailPage({ session, ticketId }: AdminSupportDetailPageProps) {
  try {
    const ticket = await getAdminSupportTicketDetail(session.accessToken, ticketId);
    const statusView = getAdminSupportTicketStatusView(ticket.status);
    const messages = sortSupportMessages(ticket.messages ?? []);
    const returnTo = `/admin/support/${ticket.id}`;

    return (
      <main className="page page-admin admin-support-detail-page">
        <PageHeader
          eyebrow="Admin / suporte / ticket"
          title={ticket.subject}
          actions={
            <>
              <Link href="/admin/support" className="secondary-action">
                Voltar aos tickets
              </Link>
              <StatusBadge label={statusView.label} tone={statusView.tone} />
              {statusView.canReply ? (
                <AdminActionForm
                  action={closeAdminSupportTicketAction}
                  submitLabel="Fechar ticket"
                  pendingLabel="Fechando..."
                  tone="danger"
                  returnTo={returnTo}
                  hiddenFields={[{ name: 'ticketId', value: ticket.id }]}
                />
              ) : null}
            </>
          }
        />

        <section className="detail-grid admin-support-detail-grid">
          <AdminSectionCard title="Ticket" className="detail-card-wide admin-support-info-card">
            <dl className="detail-list admin-support-info-list">
              <div>
                <dt>Cliente</dt>
                <dd>{ticket.user?.name || 'Cliente nao associado'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{ticket.user?.email || '-'}</dd>
              </div>
              <div>
                <dt>ID do cliente</dt>
                <dd>{ticket.user?.id || ticket.userId}</dd>
              </div>
              <div>
                <dt>ID do ticket</dt>
                <dd>{ticket.id}</dd>
              </div>
              <div>
                <dt>Criado em</dt>
                <dd>{formatDateTime(ticket.createdAt)}</dd>
              </div>
              <div>
                <dt>Atualizado em</dt>
                <dd>{formatDateTime(ticket.updatedAt)}</dd>
              </div>
              {ticket.closedAt ? (
                <div>
                  <dt>Fechado em</dt>
                  <dd>{formatDateTime(ticket.closedAt)}</dd>
                </div>
              ) : null}
            </dl>
          </AdminSectionCard>

          <AdminSectionCard
            title="Conversa"
            className="detail-card-wide admin-support-chat-card"
          >
            {messages.length === 0 ? (
              <EmptyState title="Nenhuma mensagem encontrada" description="Quando houver interacao, ela aparece aqui." />
            ) : (
              <div className="support-chat admin-support-chat" aria-label="Mensagens do ticket">
                {messages.map((message) => (
                  <AdminSupportChatMessage key={message.id} message={message} />
                ))}
              </div>
            )}
          </AdminSectionCard>

          {statusView.canReply ? (
            <section className="admin-section-card detail-card-wide admin-support-reply-card">
              <AdminActionForm
                action={createAdminSupportTicketMessageAction}
                submitLabel="Enviar resposta"
                pendingLabel="Enviando..."
                tone="primary"
                returnTo={returnTo}
                hiddenFields={[{ name: 'ticketId', value: ticket.id }]}
              >
                <label className="auth-field admin-support-reply-field">
                  <span>Mensagem</span>
                  <textarea
                    name="message"
                    maxLength={5000}
                    required
                    rows={5}
                    className="transaction-textarea"
                    placeholder="Escreva a resposta para o cliente."
                  />
                </label>
              </AdminActionForm>
            </section>
          ) : (
            <section className="auth-notice auth-notice-warning support-closed-notice admin-support-closed-notice detail-card-wide" role="status">
              <Lock size={17} strokeWidth={2.1} aria-hidden="true" />
              <div>
                <strong>Ticket fechado</strong>
                <p>Resposta e fechamento ficam bloqueados nesse estado.</p>
              </div>
            </section>
          )}
        </section>
      </main>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound();
    }

    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar este ticket"
          description={error instanceof ApiClientError ? error.message : 'Tente voltar para a fila e abrir o atendimento novamente.'}
          actionHref="/admin/support"
          actionLabel="Voltar para tickets"
        />
      </main>
    );
  }
}

function AdminSupportChatMessage({ message }: { message: SupportTicketMessageResource }) {
  const isAdmin = message.senderRole === 'admin';
  const className = `support-message ${isAdmin ? 'admin-support-message-admin' : 'admin-support-message-customer'}`;

  return (
    <article className={className}>
      <div className="support-message-head">
        <strong>{getAdminSupportMessageSenderLabel(message.senderRole)}</strong>
        <span>{formatDateTime(message.createdAt)}</span>
      </div>
      <p>{message.message}</p>
    </article>
  );
}
