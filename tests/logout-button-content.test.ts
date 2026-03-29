import test from 'node:test';
import assert from 'node:assert/strict';

import { getLogoutButtonView } from '../src/modules/auth/logout-button-content';

test('getLogoutButtonView keeps custom label when not pending', () => {
  assert.deepEqual(getLogoutButtonView('Encerrar sessao', false), {
    label: 'Encerrar sessao',
    disabled: false,
    visibleLabel: 'Encerrar sessao',
  });
});

test('getLogoutButtonView switches to pending copy and disables button', () => {
  assert.deepEqual(getLogoutButtonView('Sair', true), {
    label: 'Sair',
    disabled: true,
    visibleLabel: 'Saindo...',
  });
});
