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
        <label className="admin-user-field">
          <span>ID do perfil</span>
          <input type="text" name="affiliateProfileId" defaultValue={defaultAffiliateProfileId ?? ''} placeholder="Cole o ID do perfil" />
        </label>

        <label className="admin-user-field">
          <span>Valor</span>
          <input type="text" name="amount" placeholder="125.00" />
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>IDs de comissoes aprovadas</span>
          <textarea
            name="commissionIds"
            rows={4}
            placeholder="Cole IDs separados por virgula ou quebra de linha"
          />
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>Observacao adicional</span>
          <textarea
            name="note"
            rows={4}
            placeholder="Opcional. Ex.: payout manual validado pelo financeiro."
          />
        </label>

        <p className="panel-meta">
          Use comissoes aprovadas do mesmo afiliado. Os IDs entram em `note`.
        </p>
      </div>
    </AdminActionForm>
  );
}
