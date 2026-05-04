'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { getTransactionFormView, type TransactionFormContent } from './transaction-form-content';
import type { TransactionFormState } from '@/modules/customer-transactions/types';

type TransactionFormProps = TransactionFormContent & {
  action: (state: TransactionFormState, formData: FormData) => Promise<TransactionFormState>;
  initialState: TransactionFormState;
  surface?: 'card' | 'plain';
};

export function TransactionForm({
  title,
  description,
  action,
  initialState,
  children,
  submitLabel,
  returnTo,
  surface = 'card',
}: TransactionFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const view = getTransactionFormView(
    {
      title,
      description,
      children,
      submitLabel,
      returnTo,
    },
    state,
  );

  const content = (
    <>
      <div className="panel-heading">
        <div className="stack-item">
          <strong>{view.title}</strong>
          {view.description ? <p>{view.description}</p> : null}
        </div>
      </div>

      <form action={formAction} className="transaction-form">
        {view.hiddenReturnTo ? <input type="hidden" name="returnTo" value={view.hiddenReturnTo} /> : null}
        {view.children}
        {view.feedback ? (
          view.feedback.tone === 'blocked' ? (
            <div className="auth-notice auth-notice-warning" role="alert" aria-live="polite">
              <strong>Operacao indisponivel agora</strong>
              <p>{view.feedback.message}</p>
              {view.feedback.actionHref && view.feedback.actionLabel ? (
                <a href={view.feedback.actionHref} className="secondary-action">
                  {view.feedback.actionLabel}
                </a>
              ) : null}
            </div>
          ) : (
            <p className="auth-error" role="alert" aria-live="polite">
              {view.feedback.message}
            </p>
          )
        ) : null}
        <SubmitButton label={view.submitLabel} pendingLabel={view.pendingLabel} />
      </form>
    </>
  );

  if (surface === 'plain') {
    return <div className="transaction-form-shell">{content}</div>;
  }

  return <section className="detail-card">{content}</section>;
}

type TransactionFieldProps = {
  label: string;
  name: string;
  type?: 'text' | 'url' | 'number';
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
  readOnly?: boolean;
  min?: number;
  max?: number;
  step?: number;
};

export function TransactionField({
  label,
  type = 'text',
  placeholder,
  required = false,
  ...props
}: TransactionFieldProps) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="transaction-input"
        {...props}
      />
    </label>
  );
}

type TransactionTextareaProps = {
  label: string;
  name: string;
  placeholder?: string;
};

export function TransactionTextarea({ label, name, placeholder }: TransactionTextareaProps) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <textarea name={name} placeholder={placeholder} className="transaction-textarea" rows={4} />
    </label>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="auth-submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}
