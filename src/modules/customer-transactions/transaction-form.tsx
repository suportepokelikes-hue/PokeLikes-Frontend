'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { TransactionFormState } from '@/modules/customer-transactions/types';

type TransactionFormProps = {
  title: string;
  description: string;
  action: (state: TransactionFormState, formData: FormData) => Promise<TransactionFormState>;
  initialState: TransactionFormState;
  children: React.ReactNode;
  submitLabel: string;
};

export function TransactionForm({
  title,
  description,
  action,
  initialState,
  children,
  submitLabel,
}: TransactionFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <section className="detail-card">
      <div className="panel-heading">
        <div className="stack-item">
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
      </div>

      <form action={formAction} className="transaction-form">
        {children}
        {state.status === 'error' ? <p className="auth-error">{state.message}</p> : null}
        <SubmitButton label={submitLabel} />
      </form>
    </section>
  );
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

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="auth-submit" disabled={pending}>
      {pending ? 'Processando...' : label}
    </button>
  );
}
