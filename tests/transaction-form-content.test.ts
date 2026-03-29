import test from 'node:test';
import assert from 'node:assert/strict';

import { getTransactionFormView } from '../src/modules/customer-transactions/transaction-form-content';

test('getTransactionFormView exposes returnTo and submit labels for happy path', () => {
  const child = 'campo';
  const view = getTransactionFormView(
    {
      title: 'Criar PIX',
      description: 'Gera uma cobranca real.',
      children: child,
      submitLabel: 'Gerar PIX',
      returnTo: '/app/payments',
    },
    { status: 'idle' },
  );

  assert.equal(view.title, 'Criar PIX');
  assert.equal(view.description, 'Gera uma cobranca real.');
  assert.equal(view.children, child);
  assert.equal(view.hiddenReturnTo, '/app/payments');
  assert.equal(view.error, null);
  assert.equal(view.submitLabel, 'Gerar PIX');
  assert.equal(view.pendingLabel, 'Processando...');
});

test('getTransactionFormView builds fallback error when action returns no message', () => {
  const explicitError = getTransactionFormView(
    {
      title: 'Criar pedido',
      description: 'Fluxo do cliente.',
      children: null,
      submitLabel: 'Enviar pedido',
    },
    { status: 'error', message: 'Saldo insuficiente' },
  );

  assert.equal(explicitError.hiddenReturnTo, null);
  assert.equal(explicitError.error, 'Saldo insuficiente');

  const fallbackError = getTransactionFormView(
    {
      title: 'Criar pedido',
      description: 'Fluxo do cliente.',
      children: null,
      submitLabel: 'Enviar pedido',
    },
    { status: 'error' },
  );

  assert.equal(fallbackError.error, 'Nao foi possivel concluir a operacao.');
});
