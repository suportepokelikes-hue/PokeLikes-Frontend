import test from 'node:test';
import assert from 'node:assert/strict';

import {
  customerProfileEditContract,
  mapCustomerProfileEditError,
  parseCustomerProfileEditDraft,
} from '../src/modules/customer-dashboard/customer-profile-edit';
import { ApiClientError } from '../src/lib/api/http';

test('customer profile edit parser keeps only supported editable fields', () => {
  const formData = new FormData();
  formData.set('name', '  Maria Souza  ');
  formData.set('phone', '  (31) 99999-0000  ');
  formData.set('taxId', ' 123.456.789-09 ');
  formData.set('email', 'maria@example.com');

  const parsed = parseCustomerProfileEditDraft(formData);

  assert.ok('value' in parsed);
  assert.deepEqual(parsed.value, {
    name: 'Maria Souza',
    phone: '(31) 99999-0000',
    taxId: '123.456.789-09',
  });
});

test('customer profile edit parser requires a visible account name', () => {
  const formData = new FormData();
  formData.set('name', '   ');

  assert.deepEqual(parseCustomerProfileEditDraft(formData), {
    error: {
      status: 'error',
      message: 'Informe o nome que deve aparecer na sua conta.',
    },
  });
});

test('customer profile edit contract exposes the supported editable fields', () => {
  assert.equal(customerProfileEditContract.endpoint, 'PATCH /me');
  assert.equal(customerProfileEditContract.isAvailable, true);
  assert.deepEqual(customerProfileEditContract.editableFields, ['name', 'phone', 'taxId']);
  assert.deepEqual(customerProfileEditContract.readonlyFields, ['email']);
});

test('customer profile edit parser rejects invalid tax ids before sending to backend', () => {
  const formData = new FormData();
  formData.set('name', 'Maria Souza');
  formData.set('taxId', '12345');

  assert.deepEqual(parseCustomerProfileEditDraft(formData), {
    error: {
      status: 'error',
      message: 'Informe um CPF ou CNPJ valido para liberar a geracao de PIX.',
    },
  });
});

test('customer profile edit maps backend errors to inline feedback', () => {
  const error = new ApiClientError('Telefone invalido para este cadastro.', 400, 'validation_error');

  assert.deepEqual(mapCustomerProfileEditError(error), {
    status: 'error',
    message: 'Telefone invalido para este cadastro.',
  });
});

test('customer profile edit falls back to a generic inline error when needed', () => {
  assert.deepEqual(mapCustomerProfileEditError(new Error('boom')), {
    status: 'error',
    message: 'Nao foi possivel atualizar seus dados agora.',
  });
});
