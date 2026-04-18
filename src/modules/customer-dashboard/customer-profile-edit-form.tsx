'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { UserSummary } from '@/lib/api/contracts';
import { updateCustomerProfileAction } from './customer-profile-edit-actions';
import { initialCustomerProfileEditState } from './customer-profile-edit';

type CustomerProfileEditFormProps = {
  profile: UserSummary;
};

export function CustomerProfileEditForm({ profile }: CustomerProfileEditFormProps) {
  const [state, formAction] = useActionState(updateCustomerProfileAction, initialCustomerProfileEditState);

  return (
    <form action={formAction} className="admin-action-form">
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
      </div>

      <div className="customer-profile-edit-note">
        <strong>Edicao preparada nesta tela</strong>
        <p>Assim que a atualizacao for liberada com seguranca, este mesmo painel passa a concluir o salvamento sem tirar voce de /app/profile.</p>
      </div>

      <SubmitButton />

      {state.status !== 'idle' ? (
        <p
          className={`customer-profile-edit-message customer-profile-edit-message-${state.status}`}
          role="status"
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
