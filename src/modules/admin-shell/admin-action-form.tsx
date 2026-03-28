'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { AdminActionState } from '@/modules/admin-shell/actions';

type AdminActionFormProps = {
  action: (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  submitLabel: string;
  pendingLabel?: string;
  tone?: 'primary' | 'secondary' | 'danger';
  children?: React.ReactNode;
  hiddenFields?: Array<{ name: string; value: string }>;
  returnTo?: string;
  initialState?: AdminActionState;
};

const defaultState: AdminActionState = {
  status: 'idle',
};

export function AdminActionForm({
  action,
  submitLabel,
  pendingLabel = 'Processando...',
  tone = 'secondary',
  children,
  hiddenFields = [],
  returnTo,
  initialState = defaultState,
}: AdminActionFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="admin-action-form">
      {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}

      {hiddenFields.map((field) => (
        <input key={`${field.name}-${field.value}`} type="hidden" name={field.name} value={field.value} />
      ))}

      {children}

      <SubmitButton submitLabel={submitLabel} pendingLabel={pendingLabel} tone={tone} />

      {state.status !== 'idle' ? (
        <p className={`admin-action-message admin-action-${state.status}`}>{state.message}</p>
      ) : null}
    </form>
  );
}

function SubmitButton({
  submitLabel,
  pendingLabel,
  tone,
}: {
  submitLabel: string;
  pendingLabel: string;
  tone: 'primary' | 'secondary' | 'danger';
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={`admin-action-button admin-action-button-${tone}`} disabled={pending}>
      {pending ? pendingLabel : submitLabel}
    </button>
  );
}
