import type { CatalogServiceResource } from '@/lib/api/contracts';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { AdminCatalogCategoryField } from '@/modules/admin-shell/admin-catalog-category-field';
import type { AdminActionState } from '@/modules/admin-shell/actions';
import {
  buildEstimatedMarginText,
  formatSupplierOriginalRate,
  getSupplierRateBrlAmount,
  getSupplierRateBrlText,
  getSupplierRateConversionWarning,
} from '@/modules/admin-shell/catalog-rate-info';
import type { AdminCatalogCreationDraft } from '@/modules/admin-shell/query';

type CatalogAction = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

type AdminCatalogMutationFormProps = {
  mode: 'create' | 'update';
  action: CatalogAction;
  returnTo: string;
  service?: CatalogServiceResource;
  creationDraft?: AdminCatalogCreationDraft;
  publicCategories?: string[];
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
  publicCategories = [],
}: AdminCatalogMutationFormProps) {
  const isCreate = mode === 'create';
  const inheritedService = service
    ? {
        supplierName: service.supplierService.supplierName,
        supplierServiceId: service.supplierService.supplierServiceId,
        rate: service.supplierService.rate,
        rateInfo: service.supplierService.rateInfo,
        supplierEstimatedDeliveryTime: service.supplierService.estimatedDeliveryTime,
        estimatedDeliveryTime: service.estimatedDeliveryTime,
        category: service.supplierService.category ?? '',
        type: service.supplierService.type ?? service.type,
        minQuantity: service.minQuantity,
        maxQuantity: service.maxQuantity,
      }
    : creationDraft;
  const inheritedDeliveryTime = inheritedService
    ? 'supplierEstimatedDeliveryTime' in inheritedService
      ? inheritedService.supplierEstimatedDeliveryTime
      : inheritedService.estimatedDeliveryTime
    : undefined;
  const originalRateText = inheritedService ? formatSupplierOriginalRate(inheritedService) : null;
  const rateBrlText = inheritedService ? getSupplierRateBrlText(inheritedService) : null;
  const rateConversionWarning = inheritedService ? getSupplierRateConversionWarning(inheritedService) : null;
  const supplierRateBrl = inheritedService ? getSupplierRateBrlAmount(inheritedService) : null;
  const estimatedDeliveryTimeDefault =
    service?.estimatedDeliveryTime ?? service?.supplierService.estimatedDeliveryTime ?? creationDraft?.estimatedDeliveryTime ?? '';
  const marginText = buildEstimatedMarginText(service?.publicPrice.amount, supplierRateBrl);

  if (isCreate && !creationDraft) {
    return (
      <div className="stack-list">
        <div className="stack-item">
          <strong>Selecione um servico sincronizado</strong>
          <p>Abra um item da lista acima.</p>
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
        {inheritedService ? <SupplierReference service={inheritedService} deliveryTime={inheritedDeliveryTime} /> : null}

        <label className="admin-user-field">
          <span>Nome publico</span>
          <input
            type="text"
            name="name"
            defaultValue={service?.name ?? creationDraft?.name ?? ''}
            placeholder="Nome publico do servico"
          />
        </label>

        <label className="admin-user-field">
          <span>Preco publico</span>
          <input type="text" name="publicPrice" defaultValue={service?.publicPrice.amount ?? ''} placeholder="12.90" />
          {originalRateText ? (
            <small className="panel-meta">
              Fornecedor: {originalRateText}
              {rateBrlText ? ` / BRL: ${rateBrlText}` : ''}
              {marginText
                ? ` / ${marginText}`
                : ` / ${rateConversionWarning ?? 'sem rate convertido para BRL'}`}
            </small>
          ) : null}
        </label>

        <label className="admin-user-field">
          <span>Tempo estimado</span>
          <input type="hidden" name="clearEstimatedDeliveryTime" value="true" />
          <input
            type="text"
            name="estimatedDeliveryTime"
            defaultValue={estimatedDeliveryTimeDefault}
            placeholder="Ex: 1 a 3 dias, 24h, entrega gradual"
          />
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

        <AdminCatalogCategoryField
          categories={publicCategories}
          defaultValue={service?.category}
        />

        <label className="admin-user-field">
          <span>Status</span>
          <select name="status" defaultValue={service?.status ?? 'active'}>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </label>

        <label className="admin-user-field admin-user-field-wide">
          <span>Descricao</span>
          <textarea
            name="description"
            defaultValue={service?.description ?? ''}
            className="admin-catalog-textarea"
            placeholder="Descricao publica"
          />
        </label>
      </div>
    </AdminActionForm>
  );
}

function SupplierReference({
  service,
  deliveryTime,
}: {
  service: {
    supplierName: string;
    supplierServiceId: number;
    category: string;
    minQuantity: number;
    maxQuantity: number;
  };
  deliveryTime?: string | null;
}) {
  return (
    <p className="panel-meta admin-user-field-wide">
      Fornecedor: {service.supplierName} / SID {service.supplierServiceId} / Categoria do fornecedor: {service.category || '-'} / Faixa:{' '}
      {service.minQuantity} - {service.maxQuantity}
      {deliveryTime ? ` / Tempo: ${deliveryTime}` : ''}
    </p>
  );
}

