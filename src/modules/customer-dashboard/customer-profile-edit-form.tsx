'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { UserSummary } from '@/lib/api/contracts';
import { formatTaxIdForDisplay, getFiscalIdentityLabel, getUserTaxId } from './customer-fiscal-profile';
import { updateCustomerProfileAction } from './customer-profile-edit-actions';
import { initialCustomerProfileEditState } from './customer-profile-edit';

type CustomerProfileEditFormProps = {
  profile: UserSummary;
};

export function CustomerProfileEditForm({ profile }: CustomerProfileEditFormProps) {
  const [state, formAction] = useActionState(updateCustomerProfileAction, initialCustomerProfileEditState);
  const taxId = getUserTaxId(profile);
  const fiscalIdentityLabel = getFiscalIdentityLabel(profile);

  return (
    <form action={formAction} className="admin-action-form customer-profile-edit-shell">
      <div className="customer-profile-edit-intro">
        <div className="customer-dashboard-inline-stats">
          <div>
            <span>Email atual</span>
            <strong>{profile.email}</strong>
          </div>
          <div>
            <span>{fiscalIdentityLabel}</span>
            <strong>{formatTaxIdForDisplay(taxId)}</strong>
          </div>
          <div>
            <span>Status da conta</span>
            <strong>{profile.status}</strong>
          </div>
        </div>
      </div>

      <div className="admin-user-form customer-profile-edit-form">
        <label className="admin-user-field admin-user-field-wide">
          <span>Nome</span>
          <input type="text" name="name" defaultValue={profile.name} placeholder="Como seu nome deve aparecer" />
        </label>

        <div className="admin-user-static admin-user-field-wide">
          <span>Email</span>
          <strong>{profile.email}</strong>
          <p>Seu email segue sendo usado para entrar e receber avisos. A troca dele ainda nao acontece por esta tela.</p>
        </div>

        <label className="admin-user-field admin-user-field-wide">
          <span>Telefone</span>
          <input type="text" name="phone" defaultValue={profile.phone ?? ''} placeholder="Opcional" />
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>{fiscalIdentityLabel}</span>
          <input
            type="text"
            name="taxId"
            defaultValue={taxId ?? ''}
            placeholder="Informe seu CPF ou CNPJ"
            inputMode="numeric"
            autoComplete="off"
          />
          <p>Use CPF ou CNPJ real. Esse dado e necessario para gerar novas cobrancas PIX.</p>
        </label>
      </div>

      <div className="customer-profile-edit-note">
        <strong>O que voce ajusta neste drawer</strong>
        <p>
          Atualize nome, telefone e CPF/CNPJ sem sair da conta. O email continua somente para leitura nesta versao.
        </p>
        <p>{taxId ? `Identidade atual: ${formatTaxIdForDisplay(taxId)}.` : 'Sem CPF/CNPJ cadastrado no momento.'}</p>
      </div>

      <SubmitButton />

      {state.status !== 'idle' ? (
        <p
          className={`customer-profile-edit-message customer-profile-edit-message-${state.status}`}
          role="alert"
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="primary-action customer-profile-edit-submit" disabled={pending}>
      {pending ? 'Salvando...' : 'Salvar alteracoes'}
    </button>
  );
}
