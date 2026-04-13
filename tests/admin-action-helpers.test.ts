import test from 'node:test';
import assert from 'node:assert/strict';

import { ApiClientError } from '../src/lib/api/http';
import {
  mapAdminActionError,
  parseAffiliatePayoutPayload,
  parseCatalogAffiliateSettingsUpdatePayload,
  parseCatalogCreatePayload,
  parseCatalogUpdatePayload,
  readRole,
  readStatus,
  readSupplierSyncName,
  readWalletAdjustmentType,
  readWalletDirection,
} from '../src/modules/admin-shell/action-helpers';

test('catalog create parser builds a valid payload from supported fields', () => {
  const formData = new FormData();
  formData.set('name', 'Instagram Likes');
  formData.set('publicPrice', '12.50');
  formData.set('socialNetwork', 'instagram');
  formData.set('category', 'likes');
  formData.set('type', 'default');
  formData.set('minQuantity', '100');
  formData.set('maxQuantity', '5000');
  formData.set('supplierServiceId', '123');
  formData.set('supplierName', 'main-supplier');
  formData.set('metadata', '{"speed":"fast"}');

  const parsed = parseCatalogCreatePayload(formData);

  assert.ok('value' in parsed);
  assert.deepEqual(parsed.value, {
    name: 'Instagram Likes',
    publicPrice: '12.50',
    socialNetwork: 'instagram',
    category: 'likes',
    type: 'default',
    minQuantity: 100,
    maxQuantity: 5000,
    supplierServiceId: 123,
    supplierName: 'main-supplier',
    metadata: { speed: 'fast' },
  });
});

test('catalog create parser rejects invalid ranges and malformed metadata', () => {
  const invalidRange = new FormData();
  invalidRange.set('name', 'Service');
  invalidRange.set('publicPrice', '9.99');
  invalidRange.set('socialNetwork', 'instagram');
  invalidRange.set('category', 'likes');
  invalidRange.set('type', 'default');
  invalidRange.set('minQuantity', '1000');
  invalidRange.set('maxQuantity', '10');
  invalidRange.set('supplierServiceId', '4');

  assert.deepEqual(parseCatalogCreatePayload(invalidRange), {
    error: {
      status: 'error',
      message: 'A quantidade maxima nao pode ser menor que a minima.',
    },
  });

  const invalidJson = new FormData();
  invalidJson.set('name', 'Service');
  invalidJson.set('publicPrice', '9.99');
  invalidJson.set('socialNetwork', 'instagram');
  invalidJson.set('category', 'likes');
  invalidJson.set('type', 'default');
  invalidJson.set('minQuantity', '10');
  invalidJson.set('maxQuantity', '100');
  invalidJson.set('supplierServiceId', '4');
  invalidJson.set('metadata', '{broken');

  assert.deepEqual(parseCatalogCreatePayload(invalidJson), {
    error: {
      status: 'error',
      message: 'Metadata precisa ser um JSON valido quando preenchido.',
    },
  });
});

test('catalog update parser supports explicit clearing of nullable fields', () => {
  const formData = new FormData();
  formData.set('clearDescription', 'true');
  formData.set('clearMetadata', 'true');
  formData.set('status', 'inactive');

  const parsed = parseCatalogUpdatePayload(formData);

  assert.ok('value' in parsed);
  assert.deepEqual(parsed.value, {
    description: null,
    metadata: null,
    status: 'inactive',
  });
});

test('catalog affiliate settings parser enforces a human commission percent only when enabled', () => {
  const enabledForm = new FormData();
  enabledForm.set('affiliateEnabled', 'true');
  enabledForm.set('affiliateCommissionPercent', '12,5');

  const enabledParsed = parseCatalogAffiliateSettingsUpdatePayload(enabledForm);

  assert.ok('value' in enabledParsed);
  assert.deepEqual(enabledParsed.value, {
    affiliateEnabled: true,
    affiliateCommissionPercent: '12.5',
  });

  const disabledForm = new FormData();
  disabledForm.set('affiliateEnabled', 'false');

  const disabledParsed = parseCatalogAffiliateSettingsUpdatePayload(disabledForm);

  assert.ok('value' in disabledParsed);
  assert.deepEqual(disabledParsed.value, {
    affiliateEnabled: false,
  });

  const invalidEnabledForm = new FormData();
  invalidEnabledForm.set('affiliateEnabled', 'true');
  invalidEnabledForm.set('affiliateCommissionPercent', '0');

  assert.deepEqual(parseCatalogAffiliateSettingsUpdatePayload(invalidEnabledForm), {
    error: {
      status: 'error',
      message: 'Informe um percentual maior que zero para ativar a afiliacao.',
    },
  });
});

test('admin helper readers and error mapping keep only supported values', () => {
  const formData = new FormData();
  formData.set('role', 'admin');
  formData.set('status', 'disabled');
  formData.set('direction', 'credit');
  formData.set('type', 'wallet_reversal_admin');

  assert.equal(readRole(formData), 'admin');
  assert.equal(readStatus(formData), 'disabled');
  assert.equal(readWalletDirection(formData), 'credit');
  assert.equal(readWalletAdjustmentType(formData), 'wallet_reversal_admin');
  assert.equal(readSupplierSyncName(formData), undefined);

  formData.set('supplierName', 'cheapsmmglobal');
  assert.equal(readSupplierSyncName(formData), 'cheapsmmglobal');

  assert.deepEqual(mapAdminActionError(new ApiClientError('Falha operacional', 500), 'fallback'), {
    status: 'error',
    message: 'Falha operacional',
  });

  assert.deepEqual(mapAdminActionError(new Error('boom'), 'fallback'), {
    status: 'error',
    message: 'fallback',
  });
});

test('affiliate payout parser keeps commission references only inside note for the current contract', () => {
  const formData = new FormData();
  formData.set('affiliateProfileId', 'aff-123');
  formData.set('amount', '150.00');
  formData.set('commissionIds', ' com-1,\ncom-2\ncom-1 ');
  formData.set('note', 'Validado pelo financeiro');

  const parsed = parseAffiliatePayoutPayload(formData);

  assert.ok('value' in parsed);
  assert.deepEqual(parsed.commissionIds, ['com-1', 'com-2']);
  assert.deepEqual(parsed.value, {
    affiliateProfileId: 'aff-123',
    amount: '150.00',
    note: 'Comissoes consideradas: com-1, com-2\nObservacao: Validado pelo financeiro',
  });

  const missingIds = new FormData();
  missingIds.set('affiliateProfileId', 'aff-123');
  missingIds.set('amount', '150.00');

  assert.deepEqual(parseAffiliatePayoutPayload(missingIds), {
    error: {
      status: 'error',
      message: 'Informe ao menos um ID de comissao aprovada para rastreio operacional.',
    },
  });
});
