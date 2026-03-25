'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { AuthFormState } from '@/modules/auth/types';

type AuthField = {
  name: 'name' | 'email' | 'phone' | 'password';
  label: string;
  type: 'text' | 'email' | 'tel' | 'password';
  placeholder: string;
  autoComplete: string;
};

type AuthFormProps = {
  title: string;
  eyebrow: string;
  description: string;
  fields: AuthField[];
  submitLabel: string;
  alternateHref: string;
  alternateLabel: string;
  alternatePrompt: string;
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  initialState: AuthFormState;
};

export function AuthForm({
  title,
  eyebrow,
  description,
  fields,
  submitLabel,
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
        <div className="auth-intro">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="section-copy">{description}</p>
        </div>

        <form action={formAction} className="auth-form">
          {fields.map((field) => (
            <label key={field.name} className="auth-field">
              <span>{field.label}</span>
              <input
                type={field.type}
                name={field.name}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                required
              />
            </label>
          ))}

          {state.status === 'error' ? <p className="auth-error">{state.message}</p> : null}

          <SubmitButton label={submitLabel} />
        </form>

        <p className="auth-alt">
          {alternatePrompt} <Link href={alternateHref}>{alternateLabel}</Link>
        </p>
      </section>
    </main>
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
