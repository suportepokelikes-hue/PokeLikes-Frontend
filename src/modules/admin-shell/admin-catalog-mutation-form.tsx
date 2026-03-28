import type { CatalogServiceResource } from '@/lib/api/contracts';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import type { AdminActionState } from '@/modules/admin-shell/actions';

type CatalogAction = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

type AdminCatalogMutationFormProps = {
  mode: 'create' | 'update';
  action: CatalogAction;
  returnTo: string;
  service?: CatalogServiceResource;
};

export function AdminCatalogMutationForm({ mode, action, returnTo, service }: AdminCatalogMutationFormProps) {
  const isCreate = mode === 'create';
  const metadataValue = service?.metadata ? JSON.stringify(service.metadata) : '';

  return (
    <AdminActionForm
      action={action}
      submitLabel={isCreate ? 'Criar servico' : 'Salvar servico'}
      pendingLabel={isCreate ? 'Criando...' : 'Salvando...'}
      tone={isCreate ? 'primary' : 'secondary'}
      returnTo={returnTo}
      hiddenFields={service ? [{ name: 'serviceId', value: service.id }] : []}
    >
      <div className="admin-catalog-form">
        <label className="admin-user-field admin-user-field-wide">
          <span>Nome</span>
          <input type="text" name="name" defaultValue={service?.name ?? ''} placeholder="Nome publico do servico" />
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>Descricao</span>
          <textarea
            name="description"
            defaultValue={service?.description ?? ''}
            className="admin-catalog-textarea"
            placeholder="Contexto operacional opcional"
          />
        </label>

        <label className="admin-user-field">
          <span>Preco publico</span>
          <input type="text" name="publicPrice" defaultValue={service?.publicPrice.amount ?? ''} placeholder="12.90" />
        </label>

        <label className="admin-user-field">
          <span>Status</span>
          <select name="status" defaultValue={service?.status ?? 'active'}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </label>

        <label className="admin-user-field">
          <span>Rede social</span>
          <input type="text" name="socialNetwork" defaultValue={service?.socialNetwork ?? ''} placeholder="instagram" />
        </label>

        <label className="admin-user-field">
          <span>Categoria</span>
          <input type="text" name="category" defaultValue={service?.category ?? ''} placeholder="followers" />
        </label>

        <label className="admin-user-field">
          <span>Tipo</span>
          <input type="text" name="type" defaultValue={service?.type ?? ''} placeholder="default" />
        </label>

        <label className="admin-user-field">
          <span>Sort order</span>
          <input type="number" name="sortOrder" defaultValue={service?.sortOrder ?? ''} min={0} placeholder="0" />
        </label>

        <label className="admin-user-field">
          <span>Quantidade minima</span>
          <input type="number" name="minQuantity" defaultValue={service?.minQuantity ?? ''} min={1} placeholder="100" />
        </label>

        <label className="admin-user-field">
          <span>Quantidade maxima</span>
          <input type="number" name="maxQuantity" defaultValue={service?.maxQuantity ?? ''} min={1} placeholder="10000" />
        </label>

        <label className="admin-user-field">
          <span>Fornecedor</span>
          <input
            type="text"
            name="supplierName"
            defaultValue={service?.supplierService.supplierName ?? ''}
            placeholder="Nome do provider"
          />
        </label>

        <label className="admin-user-field">
          <span>Supplier service id</span>
          <input
            type="number"
            name="supplierServiceId"
            defaultValue={service?.supplierService.supplierServiceId ?? ''}
            min={1}
            placeholder="12345"
          />
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>Metadata JSON</span>
          <textarea
            name="metadata"
            defaultValue={metadataValue}
            className="admin-catalog-textarea admin-catalog-textarea-code"
            placeholder='{"key":"value"}'
          />
        </label>

        {!isCreate ? (
          <>
            <label className="admin-user-toggle">
              <input type="checkbox" name="clearDescription" value="true" />
              <span>Limpar descricao ao atualizar.</span>
            </label>
            <label className="admin-user-toggle">
              <input type="checkbox" name="clearMetadata" value="true" />
              <span>Limpar metadata ao atualizar.</span>
            </label>
          </>
        ) : null}
      </div>
    </AdminActionForm>
  );
}
