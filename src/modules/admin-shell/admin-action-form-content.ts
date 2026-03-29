import type { ReactNode } from 'react';

import type { AdminActionState } from './actions';

export type AdminActionFormContent = {
  submitLabel: string;
  pendingLabel?: string;
  tone?: 'primary' | 'secondary' | 'danger';
  children?: ReactNode;
  hiddenFields?: Array<{ name: string; value: string }>;
  returnTo?: string;
};

export function getAdminActionFormView(content: AdminActionFormContent, state: AdminActionState) {
  return {
    submitLabel: content.submitLabel,
    pendingLabel: content.pendingLabel ?? 'Processando...',
    tone: content.tone ?? 'secondary',
    children: content.children,
    hiddenReturnTo: content.returnTo ?? null,
    hiddenFields: content.hiddenFields ?? [],
    message:
      state.status !== 'idle'
        ? {
            status: state.status,
            text: state.message,
          }
        : null,
  };
}
