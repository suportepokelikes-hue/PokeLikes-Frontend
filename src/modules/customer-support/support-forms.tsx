'use client';

import { Paperclip, Send } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import {
  createSupportTicketAction,
  createSupportTicketMessageAction,
} from './actions';
import { initialSupportFormState, type SupportFormState } from './form-state';

type SupportTicketFormProps = {
  returnTo: string;
};

type SupportTicketReplyFormProps = {
  ticketId: string;
  returnTo: string;
};

export function SupportTicketForm({ returnTo }: SupportTicketFormProps) {
  const [state, formAction] = useActionState(createSupportTicketAction, initialSupportFormState);

  return (
    <form action={formAction} className="support-ticket-form">
      <input type="hidden" name="returnTo" value={returnTo} />

      <label className="auth-field">
        <span>Assunto</span>
        <input
          type="text"
          name="subject"
          maxLength={160}
          required
          className="transaction-input"
          placeholder="Ex: duvida sobre um pedido"
        />
      </label>

      <label className="auth-field">
        <span>Mensagem</span>
        <textarea
          name="message"
          maxLength={5000}
          required
          rows={6}
          className="transaction-textarea"
          placeholder="Descreva o que aconteceu e inclua IDs de pedido ou pagamento quando houver."
        />
      </label>

      <button type="button" className="support-attachment-disabled" disabled aria-disabled="true">
        <Paperclip size={16} strokeWidth={2.1} aria-hidden="true" />
        Anexar arquivo
        <span>Em breve</span>
      </button>

      <SupportFormFeedback state={state} />
      <SubmitButton label="Enviar ticket" pendingLabel="Enviando..." />
    </form>
  );
}

export function SupportTicketReplyForm({ ticketId, returnTo }: SupportTicketReplyFormProps) {
  const [state, formAction] = useActionState(createSupportTicketMessageAction, initialSupportFormState);

  return (
    <form action={formAction} className="support-reply-form">
      <input type="hidden" name="ticketId" value={ticketId} />
      <input type="hidden" name="returnTo" value={returnTo} />

      <label className="auth-field">
        <span>Responder</span>
        <textarea
          name="message"
          maxLength={5000}
          required
          rows={4}
          className="transaction-textarea"
          placeholder="Escreva sua resposta para o suporte."
        />
      </label>

      <SupportFormFeedback state={state} />
      <SubmitButton label="Enviar resposta" pendingLabel="Enviando..." />
    </form>
  );
}

function SupportFormFeedback({ state }: { state: SupportFormState }) {
  if (state.status !== 'error' || !state.message) {
    return null;
  }

  return (
    <p className="auth-error" role="alert" aria-live="polite">
      {state.message}
    </p>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="auth-submit support-submit" disabled={pending}>
      <Send size={16} strokeWidth={2.1} aria-hidden="true" />
      {pending ? pendingLabel : label}
    </button>
  );
}
