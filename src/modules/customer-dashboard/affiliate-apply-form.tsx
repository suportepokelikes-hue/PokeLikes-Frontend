'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { initialAffiliateApplyFormState } from './affiliate-form-state';
import { applyToAffiliateProgramAction } from './customer-affiliate-actions';

export function AffiliateApplyForm() {
  const [state, formAction] = useActionState(applyToAffiliateProgramAction, initialAffiliateApplyFormState);

  return (
    <section className="detail-card detail-card-wide">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Entrada no programa</p>
          <h2>Solicitar participacao</h2>
        </div>
      </div>

      <p className="section-copy">A solicitacao cria seu painel de afiliado para acompanhar status, codigo e comissoes.</p>

      <form action={formAction} className="feedback-actions">
        <ApplySubmitButton />
      </form>

      {state.status === 'error' && state.message ? <p className="auth-error">{state.message}</p> : null}
    </section>
  );
}

function ApplySubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="primary-action" disabled={pending}>
      {pending ? 'Solicitando...' : 'Entrar no programa'}
    </button>
  );
}
