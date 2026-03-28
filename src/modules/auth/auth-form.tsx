'use client';

import Link from 'next/link';
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { AuthFormState } from '@/modules/auth/types';

type AuthField = {
  name: 'name' | 'email' | 'phone' | 'password';
  label: string;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  autoComplete: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  description?: string;
};

type AuthFormProps = {
  brandLabel: string;
  title: string;
  eyebrow: string;
  description: string;
  notice?: {
    tone: 'info' | 'warning' | 'success';
    title: string;
    description: string;
  } | null;
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
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  initialState: AuthFormState;
};

export function AuthForm({
  brandLabel,
  title,
  eyebrow,
  description,
  notice,
  returnTo,
  panelTitle,
  panelCopy,
  panelItems,
  footnote,
  fields,
  submitLabel,
  pendingLabel,
  alternateHref,
  alternateLabel,
  alternatePrompt,
  action,
  initialState,
}: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <main className="page auth-page">
      <section className="auth-card">
        <div className="auth-hero">
          <div className="auth-brand">
            <span>{brandLabel}</span>
            <strong>{eyebrow}</strong>
          </div>

          <div className="auth-intro">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="section-copy">{description}</p>
          </div>

          <section className="auth-context" aria-label={panelTitle}>
            <p className="auth-context-title">{panelTitle}</p>
            <p className="auth-context-copy">{panelCopy}</p>
            <ul className="auth-context-list">
              {panelItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="auth-surface">
          <form action={formAction} className="auth-form">
            {notice ? (
              <div className={`auth-notice auth-notice-${notice.tone}`} role="status" aria-live="polite">
                <strong>{notice.title}</strong>
                <p>{notice.description}</p>
              </div>
            ) : null}

            {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}

            {fields.map((field) => (
              <label key={field.name} className="auth-field">
                <span>{field.label}</span>
                <input
                  type={field.type}
                  name={field.name}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  inputMode={field.inputMode}
                  required
                />
                {field.description ? <small>{field.description}</small> : null}
              </label>
            ))}

            {state.status === 'error' ? (
              <div className="auth-error" role="alert" aria-live="polite">
                <strong>Falha na autenticacao</strong>
                <p>{state.message}</p>
              </div>
            ) : null}

            <SubmitButton label={submitLabel} pendingLabel={pendingLabel} />
          </form>

          <div className="auth-footer">
            <p className="auth-footnote">{footnote}</p>
            <p className="auth-alt">
              {alternatePrompt} <Link href={alternateHref}>{alternateLabel}</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
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
