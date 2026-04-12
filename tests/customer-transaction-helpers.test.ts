import test from 'node:test';
import assert from 'node:assert/strict';

import { ApiClientError } from '../src/lib/api/http';
import {
  mapTransactionFormError,
  parseCreateOrderPayload,
  parseCreatePixPayload,
  readOptionalStringArray,
} from '../src/modules/customer-transactions/action-helpers';

test('parseCreatePixPayload requires amount', () => {
  const empty = new FormData();
  assert.deepEqual(parseCreatePixPayload(empty), {
    error: {
      status: 'error',
      message: 'Informe o valor para gerar a cobranca PIX.',
    },
  });

  const valid = new FormData();
  valid.set('amount', ' 25.50 ');

  assert.deepEqual(parseCreatePixPayload(valid), {
    value: { amount: '25.50' },
  });
});

test('parseCreateOrderPayload builds supported optional fields', () => {
  const formData = new FormData();
  formData.set('catalogServiceId', '10');
  formData.set('link', 'https://instagram.com/perfil');
  formData.set('quantity', '250');
  formData.set('affiliateCode', ' AFILIA30 ');
  formData.set('runs', '3');
  formData.set('interval', '15');
  formData.set('comments', 'primeiro\n\nsegundo');
  formData.set('answerNumber', '7');

  const parsed = parseCreateOrderPayload(formData);

  assert.ok('value' in parsed);
  assert.deepEqual(parsed.value, {
    catalogServiceId: 10,
    link: 'https://instagram.com/perfil',
    quantity: 250,
    affiliateCode: 'AFILIA30',
    runs: 3,
    interval: 15,
    comments: ['primeiro', 'segundo'],
    answerNumber: '7',
  });
});

test('parseCreateOrderPayload rejects invalid catalog service id and quantity/link', () => {
  const invalidService = new FormData();
  invalidService.set('catalogServiceId', 'abc');
  invalidService.set('link', 'https://instagram.com/perfil');
  invalidService.set('quantity', '10');

  assert.deepEqual(parseCreateOrderPayload(invalidService), {
    error: {
      status: 'error',
      message:
        'O contrato atual de criacao de pedido exige catalogServiceId numerico. Este servico nao pode ser convertido de forma segura.',
    },
  });

  const invalidFields = new FormData();
  invalidFields.set('catalogServiceId', '10');
  invalidFields.set('link', '');
  invalidFields.set('quantity', 'abc');

  assert.deepEqual(parseCreateOrderPayload(invalidFields), {
    error: {
      status: 'error',
      message: 'Informe link e quantidade validos para criar o pedido.',
    },
  });
});

test('readOptionalStringArray normalizes multiline comments', () => {
  const formData = new FormData();
  formData.set('comments', ' one \r\n\r\n two \n three ');

  assert.deepEqual(readOptionalStringArray(formData, 'comments'), ['one', 'two', 'three']);
});

test('mapTransactionFormError preserves backend message and fallback', () => {
  assert.deepEqual(mapTransactionFormError(new ApiClientError('Saldo insuficiente', 402), 'fallback'), {
    status: 'error',
    message: 'Saldo insuficiente',
  });

  assert.deepEqual(mapTransactionFormError(new Error('boom'), 'fallback'), {
    status: 'error',
    message: 'fallback',
  });
});
