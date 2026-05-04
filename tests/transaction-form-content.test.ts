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
  assert.equal(view.feedback, null);
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
  assert.deepEqual(explicitError.feedback, {
    tone: 'error',
    message: 'Saldo insuficiente',
    actionHref: null,
    actionLabel: null,
  });

  const fallbackError = getTransactionFormView(
    {
      title: 'Criar pedido',
      description: 'Fluxo do cliente.',
      children: null,
      submitLabel: 'Enviar pedido',
    },
    { status: 'error' },
  );

  assert.deepEqual(fallbackError.feedback, {
    tone: 'error',
    message: 'Nao foi possivel concluir a operacao.',
    actionHref: null,
    actionLabel: null,
  });
});

test('getTransactionFormView exposes generic blocked CTA content', () => {
  const blocked = getTransactionFormView(
    {
      title: 'Criar PIX',
      description: 'Fluxo do cliente.',
      children: null,
      submitLabel: 'Gerar PIX',
    },
    {
      status: 'blocked',
      message: 'A operacao esta indisponivel no momento.',
      actionHref: '/app/payments',
      actionLabel: 'Tentar novamente',
    },
  );

  assert.deepEqual(blocked.feedback, {
    tone: 'blocked',
    message: 'A operacao esta indisponivel no momento.',
    actionHref: '/app/payments',
    actionLabel: 'Tentar novamente',
  });
});
