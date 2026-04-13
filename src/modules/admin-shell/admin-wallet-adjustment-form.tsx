import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import type { AdminActionState } from '@/modules/admin-shell/actions';

type WalletAdjustmentAction = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

type AdminWalletAdjustmentFormProps = {
  action: WalletAdjustmentAction;
  returnTo: string;
  defaultUserId?: string;
};

export function AdminWalletAdjustmentForm({ action, returnTo, defaultUserId }: AdminWalletAdjustmentFormProps) {
  const hiddenFields = defaultUserId ? [{ name: 'userId', value: defaultUserId }] : [];

  return (
    <AdminActionForm
      action={action}
      submitLabel="Aplicar ajuste"
      pendingLabel="Aplicando..."
      tone="primary"
      returnTo={returnTo}
      hiddenFields={hiddenFields}
    >
      <div className="admin-user-form">
        {defaultUserId ? (
          <div className="admin-user-static">
            <span>Usuario</span>
            <strong>{defaultUserId}</strong>
          </div>
        ) : (
          <label className="admin-user-field">
            <span>ID do usuario</span>
            <input type="text" name="userId" placeholder="Cole o ID do usuario" />
          </label>
        )}

        <label className="admin-user-field">
          <span>Valor</span>
          <input type="text" name="amount" placeholder="25.00" />
        </label>

        <label className="admin-user-field">
          <span>Movimento</span>
          <select name="direction" defaultValue="credit">
            <option value="credit">Adicionar saldo</option>
            <option value="debit">Remover saldo</option>
          </select>
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>Motivo</span>
          <input type="text" name="reason" placeholder="Ex.: bonus, correcao manual ou estorno" />
        </label>
      </div>
    </AdminActionForm>
  );
}
