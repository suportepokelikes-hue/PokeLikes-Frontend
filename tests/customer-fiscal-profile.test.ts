import test from 'node:test';
import assert from 'node:assert/strict';

import {
  formatTaxIdForDisplay,
  getFiscalIdentityLabel,
  getUserFiscalProfile,
  getUserTaxId,
  hasUserFiscalIdentity,
  isValidTaxIdInput,
} from '../src/modules/customer-dashboard/customer-fiscal-profile';

test('customer fiscal profile prefers nested fiscalProfile and exposes label helpers', () => {
  const user = {
    taxId: '11122233344',
    fiscalProfile: {
      taxId: '12.345.678/0001-90',
      taxIdType: 'cnpj' as const,
    },
  };

  assert.deepEqual(getUserFiscalProfile(user), {
    taxId: '12.345.678/0001-90',
    taxIdType: 'cnpj',
  });
  assert.equal(getUserTaxId(user), '12.345.678/0001-90');
  assert.equal(getFiscalIdentityLabel(user), 'CNPJ');
  assert.equal(hasUserFiscalIdentity(user), true);
});

test('customer fiscal profile infers top-level taxId when nested payload is absent', () => {
  const user = {
    taxId: '12345678909',
    fiscalProfile: null,
  };

  assert.deepEqual(getUserFiscalProfile(user), {
    taxId: '12345678909',
    taxIdType: 'cpf',
  });
  assert.equal(getFiscalIdentityLabel(user), 'CPF');
  assert.equal(formatTaxIdForDisplay(getUserTaxId(user)), '123.456.789-09');
});

test('customer fiscal profile handles empty state and basic tax id validation', () => {
  const user = {
    taxId: undefined,
    fiscalProfile: null,
  };

  assert.equal(getUserFiscalProfile(user), null);
  assert.equal(hasUserFiscalIdentity(user), false);
  assert.equal(getFiscalIdentityLabel(user), 'CPF/CNPJ');
  assert.equal(formatTaxIdForDisplay(null), 'Nao informado');
  assert.equal(isValidTaxIdInput('123.456.789-09'), true);
  assert.equal(isValidTaxIdInput('12.345.678/0001-90'), true);
  assert.equal(isValidTaxIdInput('12345'), false);
});
