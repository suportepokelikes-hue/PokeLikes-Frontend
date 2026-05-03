'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useActionState, useEffect, useId, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';

import { getPublicEnv } from '@/lib/config/env';
import { createGuestSession } from '@/lib/auth/session';
import { PublicShell } from '@/modules/app-shell/public-shell';
import { getAuthFormView, type AuthFormContent } from './auth-form-content';
import type { AuthFormState } from '@/modules/auth/types';

const REFERRAL_COOKIE_NAME = 'likes_uai_referral_code';

type AuthFormProps = AuthFormContent & {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  googleAction: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  initialState: AuthFormState;
};

export function AuthForm({
  mode,
  brandLabel,
  title,
  eyebrow,
  description,
  notice,
  returnTo,
  referralCode,
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
  googleAction,
  initialState,
}: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [googleState, setGoogleState] = useState<AuthFormState>(initialState);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleScriptError, setGoogleScriptError] = useState<string | null>(null);
  const [googleButtonWidth, setGoogleButtonWidth] = useState(320);
  const [isGooglePending, startGoogleTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleInitializedRef = useRef(false);
  const router = useRouter();
  const buttonId = useId();
  const { googleClientId } = getPublicEnv();
  const isRegister = mode === 'register';
  const view = getAuthFormView(
    {
      mode,
      brandLabel,
      title,
      eyebrow,
      description,
      notice,
      returnTo,
      referralCode,
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

  useEffect(() => {
    if (!googleButtonRef.current) {
      return;
    }

    const container = googleButtonRef.current;
    const updateWidth = () => {
      const nextWidth = Math.max(220, Math.min(320, Math.floor(container.clientWidth)));
      setGoogleButtonWidth((current) => (current === nextWidth ? current : nextWidth));
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isRegister) {
      return;
    }

    syncReferralCookie(readReferralCode(formRef.current, view.referralCode));
  }, [isRegister, view.referralCode]);

  useEffect(() => {
    if (!googleClientId || !googleReady || !window.google || !googleButtonRef.current) {
      return;
    }

    const container = googleButtonRef.current;

    if (!googleInitializedRef.current) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        ux_mode: 'popup',
        context: isRegister ? 'signup' : 'signin',
        callback: (response) => {
          const credential = response.credential?.trim();

          if (!credential) {
            setGoogleState({
              status: 'error',
              message: 'O Google nao retornou uma credencial valida. Tente novamente.',
            });
            return;
          }

          const formData = new FormData();
          formData.set('idToken', credential);

          if (view.hiddenReturnTo) {
            formData.set('returnTo', view.hiddenReturnTo);
          }

          if (isRegister) {
            const currentReferralCode = readReferralCode(formRef.current, view.referralCode);

            if (currentReferralCode) {
              formData.set('referralCode', currentReferralCode);
            }

            syncReferralCookie(currentReferralCode);
          }

          setGoogleState(initialState);
          setGoogleScriptError(null);

          startGoogleTransition(async () => {
            const result = await googleAction(initialState, formData);

            if (result.status === 'success') {
              router.replace(result.redirectPath);
              return;
            }

            setGoogleState(result);
          });
        },
      });

      googleInitializedRef.current = true;
    }

    container.innerHTML = '';

    window.google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: isRegister ? 'signup_with' : 'continue_with',
      width: googleButtonWidth,
      logo_alignment: 'left',
    });
  }, [googleAction, googleButtonWidth, googleClientId, googleReady, initialState, isRegister, router, view.hiddenReturnTo, view.referralCode]);

  return (
    <PublicShell session={createGuestSession()}>
      {googleClientId ? (
        <Script
          id={`google-identity-${buttonId}`}
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={() => {
            setGoogleReady(true);
            setGoogleScriptError(null);
          }}
          onError={() => {
            setGoogleScriptError('Nao foi possivel carregar o login com Google agora. Tente novamente em instantes.');
          }}
        />
      ) : null}

      <main className="page auth-page">
        <section className="auth-card">
          <div className="auth-hero">
            <div className="auth-brand">
              <div className="auth-brand-logo">
                <Image src="/brand/logo.jpeg" alt={brandLabel} width={64} height={64} className="auth-brand-logo-image" priority />
              </div>
              <div className="auth-brand-copy">
                <span>{brandLabel}</span>
                <strong>{eyebrow}</strong>
              </div>
            </div>

            <div className="auth-intro">
              <h1>{title}</h1>
              {description ? <p className="section-copy">{description}</p> : null}
            </div>

            {panelTitle || panelCopy || panelItems.length ? (
              <section className="auth-context" aria-label={panelTitle || title}>
                {panelTitle ? <p className="auth-context-title">{panelTitle}</p> : null}
                {panelCopy ? <p className="auth-context-copy">{panelCopy}</p> : null}
                {panelItems.length ? (
                  <ul className="auth-context-list">
                    {panelItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ) : null}
          </div>

          <div className="auth-surface">
            <form action={formAction} className="auth-form" ref={formRef}>
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
                    defaultValue={field.defaultValue}
                    required={field.required ?? true}
                  />
                </label>
              ))}

              {view.error ? (
                <div className="auth-error" role="alert" aria-live="polite">
                  <strong>{view.error.title}</strong>
                  <p>{view.error.message}</p>
                </div>
              ) : null}

              {googleClientId ? (
                <div className="auth-google-block">
                  <div className="auth-google-button-shell">
                    <div
                      ref={googleButtonRef}
                      className={`auth-google-button${googleReady && !googleScriptError ? ' is-ready' : ''}`}
                      aria-live="polite"
                    />

                    {!googleReady && !googleScriptError ? (
                      <button type="button" className="auth-google-placeholder" disabled>
                        Carregando Google...
                      </button>
                    ) : null}

                    {googleScriptError ? (
                      <button type="button" className="auth-google-placeholder" disabled>
                        Continuar com Google indisponivel
                      </button>
                    ) : null}
                  </div>

                  <div className="auth-divider" aria-hidden="true">
                    <span>ou</span>
                  </div>

                  {googleScriptError ? (
                    <div className="auth-google-feedback" role="alert" aria-live="polite">
                      <p>{googleScriptError}</p>
                    </div>
                  ) : null}

                  {googleState.status === 'error' ? (
                    <div className="auth-google-feedback" role="alert" aria-live="polite">
                      <p>{googleState.message}</p>
                    </div>
                  ) : null}

                  {isGooglePending ? (
                    <div className="auth-google-feedback" role="status" aria-live="polite">
                      <p>Validando sua conta Google...</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <SubmitButton label={view.submitLabel} pendingLabel={view.pendingLabel} />
            </form>

            <div className="auth-footer">
              <p className="auth-alt">
                {view.alternatePrompt} <Link href={view.alternateHref}>{view.alternateLabel}</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
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

function readReferralCode(form: HTMLFormElement | null, fallback?: string | null) {
  const value = form?.elements.namedItem('referralCode');

  if (value instanceof HTMLInputElement) {
    const trimmed = value.value.trim();
    return trimmed || readCookie(REFERRAL_COOKIE_NAME) || fallback || '';
  }

  return readCookie(REFERRAL_COOKIE_NAME) || fallback || '';
}

function syncReferralCookie(referralCode?: string | null) {
  if (typeof document === 'undefined') {
    return;
  }

  if (!referralCode) {
    document.cookie = `${REFERRAL_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
    return;
  }

  document.cookie = `${REFERRAL_COOKIE_NAME}=${encodeURIComponent(referralCode)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

function readCookie(name: string) {
  if (typeof document === 'undefined') {
    return '';
  }

  const prefix = `${name}=`;

  for (const cookie of document.cookie.split(';')) {
    const normalized = cookie.trim();

    if (normalized.startsWith(prefix)) {
      return decodeURIComponent(normalized.slice(prefix.length));
    }
  }

  return '';
}
