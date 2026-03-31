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
        <div className="detail-card detail-card-wide">
          <h2>Como usar</h2>
          <dl className="detail-list">
            <div>
              <dt>Adicionar saldo</dt>
              <dd>Use credito com ajuste manual.</dd>
            </div>
            <div>
              <dt>Remover saldo</dt>
              <dd>Use debito com reversao manual.</dd>
            </div>
            <div>
              <dt>Tipo do lancamento</dt>
              <dd>O tipo registra o motivo administrativo da movimentacao.</dd>
            </div>
          </dl>
        </div>

        <label className="admin-user-field">
          <span>ID do usuario</span>
          <input type="text" name="userId" defaultValue={defaultUserId ?? ''} placeholder="ID do usuario" />
        </label>

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

        <label className="admin-user-field">
          <span>Motivo do lancamento</span>
          <select name="type" defaultValue="wallet_adjustment_admin">
            <option value="wallet_adjustment_admin">Ajuste manual</option>
            <option value="wallet_reversal_admin">Reversao manual</option>
          </select>
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>Observacao</span>
          <input type="text" name="reason" placeholder="Ex.: bonus, correcao manual ou estorno" />
        </label>
      </div>
    </AdminActionForm>
  );
}
