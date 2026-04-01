import type { CatalogServiceResource } from '@/lib/api/contracts';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import type { AdminActionState } from '@/modules/admin-shell/actions';
import type { AdminCatalogCreationDraft } from '@/modules/admin-shell/query';

type CatalogAction = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

type AdminCatalogMutationFormProps = {
  mode: 'create' | 'update';
  action: CatalogAction;
  returnTo: string;
  service?: CatalogServiceResource;
  creationDraft?: AdminCatalogCreationDraft;
};

const socialNetworkOptions = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'X', value: 'x' },
  { label: 'Telegram', value: 'telegram' },
];

export function AdminCatalogMutationForm({
  mode,
  action,
  returnTo,
  service,
  creationDraft,
}: AdminCatalogMutationFormProps) {
  const isCreate = mode === 'create';

  if (isCreate && !creationDraft) {
    return (
      <div className="stack-list">
        <div className="stack-item">
          <strong>Selecione um servico sincronizado</strong>
          <p>Escolha um item na lista acima para preencher automaticamente fornecedor, categoria, tipo e limites.</p>
        </div>
      </div>
    );
  }

  const hiddenFields = service
    ? [{ name: 'serviceId', value: service.id }]
    : creationDraft
      ? [
          { name: 'supplierServiceId', value: String(creationDraft.supplierServiceId) },
          { name: 'supplierName', value: creationDraft.supplierName },
          { name: 'category', value: creationDraft.category },
          { name: 'type', value: creationDraft.type },
          { name: 'minQuantity', value: String(creationDraft.minQuantity) },
          { name: 'maxQuantity', value: String(creationDraft.maxQuantity) },
        ]
      : [];

  return (
    <AdminActionForm
      action={action}
      submitLabel={isCreate ? 'Publicar servico' : 'Salvar servico'}
      pendingLabel={isCreate ? 'Publicando...' : 'Salvando...'}
      tone={isCreate ? 'primary' : 'secondary'}
      returnTo={returnTo}
      hiddenFields={hiddenFields}
    >
      <div className="admin-catalog-form">
        {isCreate && creationDraft ? (
          <div className="detail-card detail-card-wide">
            <h2>Servico sincronizado</h2>
            <dl className="detail-list">
              <div>
                <dt>Fornecedor</dt>
                <dd>{creationDraft.supplierName}</dd>
              </div>
              <div>
                <dt>SID</dt>
                <dd>{creationDraft.supplierServiceId}</dd>
              </div>
              <div>
                <dt>Categoria</dt>
                <dd>{creationDraft.category}</dd>
              </div>
              <div>
                <dt>Tipo</dt>
                <dd>{creationDraft.type}</dd>
              </div>
              <div>
                <dt>Faixa minima</dt>
                <dd>{creationDraft.minQuantity}</dd>
              </div>
              <div>
                <dt>Faixa maxima</dt>
                <dd>{creationDraft.maxQuantity}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        <label className="admin-user-field admin-user-field-wide">
          <span>Nome publico</span>
          <input
            type="text"
            name="name"
            defaultValue={service?.name ?? creationDraft?.name ?? ''}
            placeholder="Nome publico do servico"
          />
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>Descricao</span>
          <textarea
            name="description"
            defaultValue={service?.description ?? ''}
            className="admin-catalog-textarea"
            placeholder="Descreva o servico para o catalogo publico"
          />
        </label>

        <label className="admin-user-field">
          <span>Preco publico</span>
          <input type="text" name="publicPrice" defaultValue={service?.publicPrice.amount ?? ''} placeholder="12.90" />
        </label>

        <label className="admin-user-field">
          <span>Rede social</span>
          <select name="socialNetwork" defaultValue={service?.socialNetwork ?? 'instagram'}>
            {socialNetworkOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-user-field">
          <span>Status</span>
          <select name="status" defaultValue={service?.status ?? 'active'}>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </label>
      </div>
    </AdminActionForm>
  );
}
