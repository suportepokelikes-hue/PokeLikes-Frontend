'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { getAdminActionFormView, type AdminActionFormContent } from './admin-action-form-content';
import type { AdminActionState } from '@/modules/admin-shell/actions';

type AdminActionFormProps = AdminActionFormContent & {
  action: (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;
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
  const view = getAdminActionFormView(
    {
      submitLabel,
      pendingLabel,
      tone,
      children,
      hiddenFields,
      returnTo,
    },
    state,
  );

  return (
    <form action={formAction} className="admin-action-form">
      {view.hiddenReturnTo ? <input type="hidden" name="returnTo" value={view.hiddenReturnTo} /> : null}

      {view.hiddenFields.map((field) => (
        <input key={`${field.name}-${field.value}`} type="hidden" name={field.name} value={field.value} />
      ))}

      {view.children}

      <SubmitButton submitLabel={view.submitLabel} pendingLabel={view.pendingLabel} tone={view.tone} />

      {view.message ? (
        <p className={`admin-action-message admin-action-${view.message.status}`}>{view.message.text}</p>
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
