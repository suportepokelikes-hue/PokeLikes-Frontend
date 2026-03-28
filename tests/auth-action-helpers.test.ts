import test from 'node:test';
import assert from 'node:assert/strict';

import { ApiClientError } from '../src/lib/api/http';
import { mapLoginError, mapRegisterError, readTrimmedString } from '../src/modules/auth/action-helpers';

test('readTrimmedString trims values and returns empty string for missing entries', () => {
  const formData = new FormData();
  formData.set('email', '  alice@likesuai.com  ');

  assert.equal(readTrimmedString(formData, 'email'), 'alice@likesuai.com');
  assert.equal(readTrimmedString(formData, 'missing'), '');
});

test('mapLoginError specializes unauthorized errors', () => {
  const mapped = mapLoginError(new ApiClientError('Backend unauthorized', 401));

  assert.deepEqual(mapped, {
    status: 'error',
    message: 'Email ou senha invalidos. Revise as credenciais e tente novamente.',
  });
});

test('mapRegisterError preserves backend validation messages for 400', () => {
  const mapped = mapRegisterError(new ApiClientError('Email ja cadastrado', 400));

  assert.deepEqual(mapped, {
    status: 'error',
    message: 'Email ja cadastrado',
  });
});

test('auth error mappers fall back for unexpected failures', () => {
  assert.deepEqual(mapLoginError(new Error('network')), {
    status: 'error',
    message: 'Nao foi possivel autenticar agora. Tente novamente em instantes.',
  });

  assert.deepEqual(mapRegisterError(new Error('network')), {
    status: 'error',
    message: 'Nao foi possivel concluir o cadastro agora. Tente novamente em instantes.',
  });
});
