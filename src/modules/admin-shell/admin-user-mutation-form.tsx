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
        <div className="admin-form-note">
          <strong>{isCreate ? 'Criacao controlada' : 'Atualizacao pontual'}</strong>
          <p>{isCreate ? 'Preencha os campos essenciais para liberar acesso sem ruido extra.' : 'Ajuste apenas o que mudou para preservar historico e contexto operacional.'}</p>
        </div>

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
            <input type="email" name="email" placeholder="usuario@exemplo.com" />
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
            <option value="customer">Cliente</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className="admin-user-field">
          <span>Status</span>
          <select name="status" defaultValue={user?.status ?? 'active'}>
            <option value="active">Ativo</option>
            <option value="disabled">Desativado</option>
          </select>
        </label>
      </div>
    </AdminActionForm>
  );
}
