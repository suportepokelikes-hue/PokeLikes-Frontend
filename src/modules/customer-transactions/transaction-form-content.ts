import type { ReactNode } from 'react';

import type { TransactionFormState } from './types';

export type TransactionFormContent = {
  title: string;
  description: string;
  children: ReactNode;
  submitLabel: string;
  returnTo?: string;
};

export function getTransactionFormView(content: TransactionFormContent, state: TransactionFormState) {
  return {
    title: content.title,
    description: content.description,
    children: content.children,
    hiddenReturnTo: content.returnTo ?? null,
    feedback:
      state.status === 'idle'
        ? null
        : {
            tone: state.status,
            message: state.message ?? 'Nao foi possivel concluir a operacao.',
            actionHref: state.actionHref ?? null,
            actionLabel: state.actionLabel ?? null,
          },
    submitLabel: content.submitLabel,
    pendingLabel: 'Processando...',
  };
}
