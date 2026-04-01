import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';

import type { AuthFormState } from './types';

export type AuthField = {
  name: 'name' | 'email' | 'phone' | 'password' | 'referralCode';
  label: string;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  autoComplete: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  description?: string;
  defaultValue?: string;
  required?: boolean;
};

export type AuthNotice = {
  tone: 'info' | 'warning' | 'success';
  title: string;
  description: string;
};

export type AuthFormContent = {
  brandLabel: string;
  title: string;
  eyebrow: string;
  description: string;
  notice?: AuthNotice | null;
  returnTo?: string | null;
  panelTitle: string;
  panelCopy: string;
  panelItems: string[];
  footnote: string;
  fields: AuthField[];
  submitLabel: string;
  pendingLabel: string;
  alternateHref: string;
  alternateLabel: string;
  alternatePrompt: string;
};

export function getAuthFormView(content: AuthFormContent, state: AuthFormState) {
  return {
    notice: content.notice ?? null,
    hiddenReturnTo: content.returnTo ?? null,
    fields: content.fields,
    error:
      state.status === 'error'
        ? {
            title: 'Falha na autenticacao',
            message: state.message ?? 'Nao foi possivel concluir a autenticacao.',
          }
        : null,
    submitLabel: content.submitLabel,
    pendingLabel: content.pendingLabel,
    alternateHref: content.alternateHref,
    alternateLabel: content.alternateLabel,
    alternatePrompt: content.alternatePrompt,
    footnote: content.footnote,
  };
}
