'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { BadgeDollarSign, Save } from 'lucide-react';

import { CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { StatusBadge } from '@/components/ui/status-badge';
import type { AffiliateProfileResource } from '@/lib/api/contracts';
import { updateAffiliatePixAction, type AffiliatePixFormState } from './customer-affiliate-actions';

type AffiliatePixFormProps = {
  profile: AffiliateProfileResource;
};

const initialState: AffiliatePixFormState = {
  status: 'idle',
};

const pixKeyTypes = [
  { value: 'cpf', label: 'CPF' },
  { value: 'cnpj', label: 'CNPJ' },
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' },
  { value: 'random', label: 'Chave aleatoria' },
] as const;

export function AffiliatePixForm({ profile }: AffiliatePixFormProps) {
  const [state, formAction] = useActionState(updateAffiliatePixAction, initialState);
  const hasPixKey = Boolean(profile.pixKey && profile.pixKeyType);

  return (
    <CustomerSectionCard
      eyebrow="Recebimento"
      title="Chave PIX de payout"
      description="Os payouts de afiliado usam esta chave PIX. O pagamento continua operacional e manual nesta fase."
      meta={<StatusBadge label={hasPixKey ? 'PIX cadastrado' : 'PIX pendente'} tone={hasPixKey ? 'success' : 'warning'} />}
    >
      {!hasPixKey ? (
        <div className="auth-notice auth-notice-warning" role="status">
          <strong>Cadastre sua chave PIX</strong>
          <p>Sem uma chave PIX, o financeiro pode bloquear ou adiar o payout.</p>
        </div>
      ) : (
        <div className="customer-dashboard-inline-stats">
          <div>
            <span>Tipo</span>
            <strong>{formatPixKeyType(profile.pixKeyType)}</strong>
          </div>
          <div>
            <span>Chave</span>
            <strong>{profile.pixKey}</strong>
          </div>
        </div>
      )}

      <form action={formAction} className="admin-user-form">
        <label className="admin-user-field">
          <span>Tipo da chave</span>
          <select name="pixKeyType" defaultValue={profile.pixKeyType ?? ''}>
            <option value="">Selecione</option>
            {pixKeyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-user-field">
          <span>Chave PIX</span>
          <input type="text" name="pixKey" defaultValue={profile.pixKey ?? ''} placeholder="Informe sua chave PIX" />
        </label>

        <div className="feedback-actions">
          <PixSubmitButton />
        </div>
      </form>

      {state.status === 'error' && state.message ? <p className="auth-error">{state.message}</p> : null}

      {state.status === 'success' && state.message ? (
        <div className="auth-notice auth-notice-success" role="status" aria-live="polite">
          <strong>PIX atualizado</strong>
          <p>{state.message}</p>
        </div>
      ) : null}
    </CustomerSectionCard>
  );
}

function PixSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="primary-action" disabled={pending}>
      {pending ? (
        <>
          <BadgeDollarSign size={16} strokeWidth={2.15} aria-hidden="true" />
          Salvando...
        </>
      ) : (
        <>
          <Save size={16} strokeWidth={2.15} aria-hidden="true" />
          Salvar chave PIX
        </>
      )}
    </button>
  );
}

function formatPixKeyType(value?: string | null) {
  const match = pixKeyTypes.find((type) => type.value === value);
  return match?.label ?? value ?? '-';
}
