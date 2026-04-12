'use client';

import { useState } from 'react';

import type { AdminCatalogAffiliateSettingsResource, CatalogServiceResource } from '@/lib/api/contracts';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import type { AdminActionState } from '@/modules/admin-shell/actions';

type AffiliateSettingsAction = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

type AdminCatalogAffiliateSettingsFormProps = {
  action: AffiliateSettingsAction;
  returnTo: string;
  service: Pick<CatalogServiceResource, 'id' | 'name'>;
  settings?: AdminCatalogAffiliateSettingsResource | null;
};

export function AdminCatalogAffiliateSettingsForm({
  action,
  returnTo,
  service,
  settings,
}: AdminCatalogAffiliateSettingsFormProps) {
  const initialEnabled = settings?.affiliateEnabled ?? false;
  const [affiliateEnabled, setAffiliateEnabled] = useState(initialEnabled);
  const currentPercent = settings?.affiliateCommissionPercent ?? '';

  return (
    <AdminActionForm
      action={action}
      submitLabel="Salvar afiliacao"
      pendingLabel="Salvando..."
      tone="secondary"
      returnTo={returnTo}
      hiddenFields={[{ name: 'serviceId', value: service.id }]}
    >
      <div className="admin-user-form">
        <div className="admin-user-static admin-user-field-wide">
          <span>Servico publicado</span>
          <strong>{service.name}</strong>
          <small>ID {service.id}</small>
        </div>

        <label className="admin-user-field">
          <span>Afiliavel</span>
          <select
            name="affiliateEnabled"
            defaultValue={initialEnabled ? 'true' : 'false'}
            onChange={(event) => setAffiliateEnabled(event.currentTarget.value === 'true')}
          >
            <option value="false">Desligado</option>
            <option value="true">Ligado</option>
          </select>
        </label>

        <label className="admin-user-field">
          <span>Percentual de comissao</span>
          <input
            type="text"
            name="affiliateCommissionPercent"
            inputMode="decimal"
            defaultValue={currentPercent}
            placeholder={affiliateEnabled ? '30.00' : 'Ative a afiliacao para editar'}
            disabled={!affiliateEnabled}
            aria-disabled={!affiliateEnabled}
          />
        </label>

        <div className="admin-user-static admin-user-field-wide">
          <span>Regra</span>
          <strong>Use percentual humano</strong>
          <small>30.00 = 30% e 12.50 = 12,5%.</small>
        </div>

        {!affiliateEnabled ? (
          <div className="admin-user-static admin-user-field-wide">
            <span>Percentual atual</span>
            <strong>{formatPercentLabel(currentPercent)}</strong>
            <small>Com a afiliacao desligada, o percentual fica somente como referencia visual.</small>
          </div>
        ) : null}
      </div>
    </AdminActionForm>
  );
}

function formatPercentLabel(value: string) {
  if (!value) {
    return 'Sem percentual ativo';
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return `${value}%`;
  }

  return `${new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: parsed % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(parsed)}%`;
}
