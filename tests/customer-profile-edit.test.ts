import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createCustomerProfileEditBlockedState,
  customerProfileEditContract,
  parseCustomerProfileEditDraft,
} from '../src/modules/customer-dashboard/customer-profile-edit';

test('customer profile edit parser keeps only supported editable fields', () => {
  const formData = new FormData();
  formData.set('name', '  Maria Souza  ');
  formData.set('phone', '  (31) 99999-0000  ');
  formData.set('email', 'maria@example.com');

  const parsed = parseCustomerProfileEditDraft(formData);

  assert.ok('value' in parsed);
  assert.deepEqual(parsed.value, {
    name: 'Maria Souza',
    phone: '(31) 99999-0000',
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

test('customer profile edit stays blocked while PATCH /me has no validated request body', () => {
  assert.equal(customerProfileEditContract.endpoint, 'PATCH /me');
  assert.equal(customerProfileEditContract.isAvailable, false);
  assert.match(customerProfileEditContract.reason, /request body/i);

  const state = createCustomerProfileEditBlockedState({
    name: 'Maria Souza',
    phone: '(31) 99999-0000',
  });

  assert.deepEqual(state, {
    status: 'blocked',
    message:
      'Seu painel de edicao ja esta pronto, mas o salvamento ainda depende da liberacao segura dessa atualizacao no backend. Enquanto isso, seu email, nome e telefone seguem como consulta.',
  });
});
