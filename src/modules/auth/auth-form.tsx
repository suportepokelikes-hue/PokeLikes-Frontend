'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { getAuthFormView, type AuthFormContent } from './auth-form-content';
import type { AuthFormState } from '@/modules/auth/types';

type AuthFormProps = AuthFormContent & {
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
  const view = getAuthFormView(
    {
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
    },
    state,
  );

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

          <div className="auth-metrics">
            <article className="auth-metric-card">
              <span>Fluxo</span>
              <strong>Autenticacao real</strong>
            </article>
            <article className="auth-metric-card">
              <span>Destino</span>
              <strong>Cliente ou admin</strong>
            </article>
          </div>
        </div>

        <div className="auth-surface">
          <form action={formAction} className="auth-form">
            {view.notice ? (
              <div className={`auth-notice auth-notice-${view.notice.tone}`} role="status" aria-live="polite">
                <strong>{view.notice.title}</strong>
                <p>{view.notice.description}</p>
              </div>
            ) : null}

            {view.hiddenReturnTo ? <input type="hidden" name="returnTo" value={view.hiddenReturnTo} /> : null}

            {view.fields.map((field) => (
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

            {view.error ? (
              <div className="auth-error" role="alert" aria-live="polite">
                <strong>{view.error.title}</strong>
                <p>{view.error.message}</p>
              </div>
            ) : null}

            <SubmitButton label={view.submitLabel} pendingLabel={view.pendingLabel} />
          </form>

          <div className="auth-footer">
            <p className="auth-footnote">{view.footnote}</p>
            <p className="auth-alt">
              {view.alternatePrompt} <Link href={view.alternateHref}>{view.alternateLabel}</Link>
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
