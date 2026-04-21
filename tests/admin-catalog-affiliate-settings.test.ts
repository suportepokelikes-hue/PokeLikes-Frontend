import test from 'node:test';
import assert from 'node:assert/strict';

import { parseCatalogAffiliateSettingsUpdatePayload } from '../src/modules/admin-shell/action-helpers';

test('catalog affiliate settings parser enforces a human commission percent only when enabled', () => {
  const enabledForm = new FormData();
  enabledForm.set('affiliateEnabled', 'true');
  enabledForm.set('affiliateCommissionPercent', '12,5');

  const enabledParsed = parseCatalogAffiliateSettingsUpdatePayload(enabledForm);

  assert.ok('value' in enabledParsed);
  assert.deepEqual(enabledParsed.value, {
    isAffiliateEnabled: true,
    affiliateCommissionPercent: '12.5',
  });

  const disabledForm = new FormData();
  disabledForm.set('affiliateEnabled', 'false');

  const disabledParsed = parseCatalogAffiliateSettingsUpdatePayload(disabledForm);

  assert.ok('value' in disabledParsed);
  assert.deepEqual(disabledParsed.value, {
    isAffiliateEnabled: false,
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
