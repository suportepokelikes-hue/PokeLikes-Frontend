'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { CatalogServiceResource } from '@/lib/api/contracts';
import { createAdminTestOrderAction, type AdminTestOrderActionState } from '@/modules/admin-shell/actions';

type AdminTestOrderFormProps = {
  service: CatalogServiceResource;
  returnTo: string;
};

const initialState: AdminTestOrderActionState = {
  status: 'idle',
};

export function AdminTestOrderForm({ service, returnTo }: AdminTestOrderFormProps) {
  const [state, formAction] = useActionState(createAdminTestOrderAction, initialState);

  return (
    <form action={formAction} className="admin-action-form">
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="catalogServiceId" value={service.id} />
      <input type="hidden" name="minQuantity" value={service.minQuantity} />
      <input type="hidden" name="maxQuantity" value={service.maxQuantity} />

      <div className="admin-user-form">
        <label className="admin-user-field admin-user-field-wide">
          <span>Link</span>
          <input type="url" name="link" required placeholder="https://instagram.com/perfil-ou-publicacao" />
        </label>

        <label className="admin-user-field">
          <span>Quantidade</span>
          <input
            type="number"
            name="quantity"
            required
            min={service.minQuantity}
            max={service.maxQuantity}
            defaultValue={service.minQuantity}
            inputMode="numeric"
          />
          <small className="panel-meta">
            Use entre {service.minQuantity} e {service.maxQuantity}.
          </small>
        </label>
      </div>

      <SubmitButton />

      {state.status === 'success' ? (
        <div className="auth-notice auth-notice-success" role="status" aria-live="polite">
          <strong>{state.message}</strong>
          <div className="feedback-actions">
            {state.orderId ? (
              <Link href={`/admin/orders/${state.orderId}`} className="secondary-action">
                Ver pedido
              </Link>
            ) : null}
            <Link href="/admin/orders" className="secondary-action">
              Abrir pedidos
            </Link>
          </div>
        </div>
      ) : null}

      {state.status === 'error' ? (
        <p className="admin-action-message admin-action-error" role="alert" aria-live="polite">
          {state.message ?? 'Nao foi possivel enviar o pedido de teste.'}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="admin-action-button admin-action-button-primary" disabled={pending}>
      {pending ? 'Enviando...' : 'Enviar pedido de teste'}
    </button>
  );
}
