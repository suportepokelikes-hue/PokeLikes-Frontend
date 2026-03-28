import type { UserSummary } from '@/lib/api/contracts';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import type { AdminActionState } from '@/modules/admin-shell/actions';

type UserAction = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

type AdminUserMutationFormProps = {
  mode: 'create' | 'update';
  action: UserAction;
  returnTo: string;
  user?: UserSummary;
};

export function AdminUserMutationForm({ mode, action, returnTo, user }: AdminUserMutationFormProps) {
  const isCreate = mode === 'create';

  return (
    <AdminActionForm
      action={action}
      submitLabel={isCreate ? 'Criar usuario' : 'Salvar atualizacao'}
      pendingLabel={isCreate ? 'Criando...' : 'Salvando...'}
      tone={isCreate ? 'primary' : 'secondary'}
      returnTo={returnTo}
      hiddenFields={user ? [{ name: 'userId', value: user.id }] : []}
    >
      <div className={`admin-user-form admin-user-form-${mode}`}>
        <label className="admin-user-field admin-user-field-wide">
          <span>Nome</span>
          <input
            type="text"
            name="name"
            defaultValue={user?.name ?? ''}
            placeholder={isCreate ? 'Nome completo' : 'Atualize o nome se necessario'}
          />
        </label>

        {isCreate ? (
          <label className="admin-user-field admin-user-field-wide">
            <span>Email</span>
            <input type="email" name="email" placeholder="usuario@likesuai.com" />
          </label>
        ) : (
          <div className="admin-user-static admin-user-field-wide">
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>
        )}

        <label className="admin-user-field">
          <span>{isCreate ? 'Senha inicial' : 'Nova senha'}</span>
          <input type="password" name="password" placeholder={isCreate ? 'Obrigatoria na criacao' : 'Opcional'} />
        </label>

        <label className="admin-user-field">
          <span>Telefone</span>
          <input type="text" name="phone" defaultValue={user?.phone ?? ''} placeholder="Opcional" />
        </label>

        <label className="admin-user-field">
          <span>Papel</span>
          <select name="role" defaultValue={user?.role ?? 'customer'}>
            <option value="customer">customer</option>
            <option value="admin">admin</option>
          </select>
        </label>

        <label className="admin-user-field">
          <span>Status</span>
          <select name="status" defaultValue={user?.status ?? 'active'}>
            <option value="active">active</option>
            <option value="disabled">disabled</option>
          </select>
        </label>

        {!isCreate ? (
          <label className="admin-user-toggle admin-user-field-wide">
            <input type="checkbox" name="clearPhone" value="true" />
            <span>Limpar telefone salvo ao atualizar este usuario.</span>
          </label>
        ) : null}
      </div>
    </AdminActionForm>
  );
}
