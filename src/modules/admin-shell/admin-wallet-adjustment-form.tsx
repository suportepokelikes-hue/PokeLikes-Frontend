import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import type { AdminActionState } from '@/modules/admin-shell/actions';

type WalletAdjustmentAction = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

type AdminWalletAdjustmentFormProps = {
  action: WalletAdjustmentAction;
  returnTo: string;
  defaultUserId?: string;
};

export function AdminWalletAdjustmentForm({ action, returnTo, defaultUserId }: AdminWalletAdjustmentFormProps) {
  return (
    <AdminActionForm action={action} submitLabel="Aplicar ajuste" pendingLabel="Aplicando..." tone="primary" returnTo={returnTo}>
      <div className="admin-user-form">
        <label className="admin-user-field">
          <span>ID do usuario</span>
          <input type="text" name="userId" defaultValue={defaultUserId ?? ''} placeholder="ID do usuario" />
        </label>

        <label className="admin-user-field">
          <span>Valor</span>
          <input type="text" name="amount" placeholder="25.00" />
        </label>

        <label className="admin-user-field">
          <span>Direcao</span>
          <select name="direction" defaultValue="credit">
            <option value="credit">credit</option>
            <option value="debit">debit</option>
          </select>
        </label>

        <label className="admin-user-field">
          <span>Tipo</span>
          <select name="type" defaultValue="wallet_adjustment_admin">
            <option value="wallet_adjustment_admin">wallet_adjustment_admin</option>
            <option value="wallet_reversal_admin">wallet_reversal_admin</option>
          </select>
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>Motivo</span>
          <input type="text" name="reason" placeholder="Contexto operacional do ajuste" />
        </label>
      </div>
    </AdminActionForm>
  );
}
