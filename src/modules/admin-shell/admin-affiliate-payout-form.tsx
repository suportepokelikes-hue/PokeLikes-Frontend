import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import type { AdminActionState } from '@/modules/admin-shell/actions';

type AffiliatePayoutAction = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

type AdminAffiliatePayoutFormProps = {
  action: AffiliatePayoutAction;
  returnTo: string;
  defaultAffiliateProfileId?: string;
};

export function AdminAffiliatePayoutForm({ action, returnTo, defaultAffiliateProfileId }: AdminAffiliatePayoutFormProps) {
  return (
    <AdminActionForm
      action={action}
      submitLabel="Registrar payout"
      pendingLabel="Registrando..."
      tone="primary"
      returnTo={returnTo}
    >
      <div className="admin-user-form">
        <div className="admin-form-note">
          <strong>Payout PIX via Asaas</strong>
          <p>Selecione comissoes aprovadas. O backend calcula o valor e cria a solicitacao antes da transferencia.</p>
        </div>

        <label className="admin-user-field">
          <span>ID do perfil</span>
          <input type="text" name="affiliateProfileId" inputMode="numeric" defaultValue={defaultAffiliateProfileId ?? ''} placeholder="Cole o ID numerico" />
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>IDs de comissoes aprovadas</span>
          <textarea
            name="commissionIds"
            rows={4}
            placeholder="Cole IDs numericos separados por virgula ou quebra de linha"
          />
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>Observacao adicional</span>
          <textarea
            name="notes"
            rows={4}
            placeholder="Opcional. Ex.: fechamento validado pelo financeiro."
          />
        </label>

        <p className="panel-meta">
          O PIX e disparado depois, ao processar o payout. Use apenas comissoes aprovadas do mesmo afiliado.
        </p>
      </div>
    </AdminActionForm>
  );
}
