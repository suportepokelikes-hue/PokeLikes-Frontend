import test from 'node:test';
import assert from 'node:assert/strict';

import { getAdminActionFormView } from '../src/modules/admin-shell/admin-action-form-content';
import type { AdminActionState } from '../src/modules/admin-shell/actions';

test('getAdminActionFormView exposes default tone, labels and hidden fields', () => {
  const view = getAdminActionFormView(
    {
      submitLabel: 'Resolver alerta',
      hiddenFields: [
        { name: 'alertId', value: '42' },
        { name: 'scope', value: 'orders' },
      ],
      returnTo: '/admin/alerts?page=2',
    },
    { status: 'idle' },
  );

  assert.equal(view.submitLabel, 'Resolver alerta');
  assert.equal(view.pendingLabel, 'Processando...');
  assert.equal(view.tone, 'secondary');
  assert.equal(view.hiddenReturnTo, '/admin/alerts?page=2');
  assert.deepEqual(view.hiddenFields, [
    { name: 'alertId', value: '42' },
    { name: 'scope', value: 'orders' },
  ]);
  assert.equal(view.message, null);
});

test('getAdminActionFormView exposes success and error messages from action state', () => {
  const successState: AdminActionState = {
    status: 'success',
    message: 'Alerta resolvido.',
  };
  const errorState: AdminActionState = {
    status: 'error',
    message: 'Nao foi possivel reconciliar.',
  };

  assert.deepEqual(
    getAdminActionFormView(
      {
        submitLabel: 'Salvar',
        pendingLabel: 'Salvando...',
        tone: 'primary',
      },
      successState,
    ).message,
    {
      status: 'success',
      text: 'Alerta resolvido.',
    },
  );

  assert.deepEqual(
    getAdminActionFormView(
      {
        submitLabel: 'Salvar',
        tone: 'danger',
      },
      errorState,
    ).message,
    {
      status: 'error',
      text: 'Nao foi possivel reconciliar.',
    },
  );
});
