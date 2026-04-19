'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Rocket, Sparkles } from 'lucide-react';

import { CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { StatusBadge } from '@/components/ui/status-badge';
import { initialAffiliateApplyFormState } from './affiliate-form-state';
import { applyToAffiliateProgramAction } from './customer-affiliate-actions';

export function AffiliateApplyForm() {
  const [state, formAction] = useActionState(applyToAffiliateProgramAction, initialAffiliateApplyFormState);

  return (
    <CustomerSectionCard
      eyebrow="Entrada no programa"
      title="Solicitar participacao"
      description="A solicitacao cria seu painel de afiliado para acompanhar codigo, status e comissoes."
      meta={<StatusBadge label="entrada disponivel" tone="info" />}
      className="customer-affiliate-apply-card"
    >
      <div className="customer-dashboard-inline-stats">
        <div>
          <span>Fluxo</span>
          <strong>Solicitar agora</strong>
        </div>
        <div>
          <span>Status inicial</span>
          <strong>Pendente</strong>
        </div>
        <div>
          <span>Painel</span>
          <strong>Codigo e comissoes</strong>
        </div>
      </div>

      <form action={formAction} className="feedback-actions">
        <ApplySubmitButton />
      </form>

      {state.status === 'error' && state.message ? <p className="auth-error">{state.message}</p> : null}
    </CustomerSectionCard>
  );
}

function ApplySubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="primary-action" disabled={pending}>
      {pending ? (
        <>
          <Sparkles size={16} strokeWidth={2.15} aria-hidden="true" />
          Solicitando...
        </>
      ) : (
        <>
          <Rocket size={16} strokeWidth={2.15} aria-hidden="true" />
          Entrar no programa
        </>
      )}
    </button>
  );
}
