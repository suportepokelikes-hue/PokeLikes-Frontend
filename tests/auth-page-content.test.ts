import test from 'node:test';
import assert from 'node:assert/strict';

import { getLoginPageContent, getRegisterPageContent } from '../src/modules/auth/page-content';

test('getLoginPageContent preserves auth return flow and login-specific copy', () => {
  const content = getLoginPageContent({
    reason: 'required',
    returnTo: '/admin/users/42',
    referralCode: 'INDIQUE42',
    notice: {
      tone: 'info',
      title: 'Acesso necessario',
      description: 'Entre para continuar.',
    },
  });

  assert.equal(content.title, 'Entrar');
  assert.equal(content.mode, 'login');
  assert.equal(content.notice?.title, 'Acesso necessario');
  assert.equal(content.returnTo, '/admin/users/42');
  assert.equal(content.referralCode, 'INDIQUE42');
  assert.equal(content.alternateHref, '/register?reason=required&returnTo=%2Fadmin%2Fusers%2F42&ref=INDIQUE42');
  assert.equal(content.fields.length, 2);
  assert.deepEqual(
    content.fields.map((field) => field.name),
    ['email', 'password'],
  );
});

test('getRegisterPageContent preserves register-specific fields and alternate login link', () => {
  const content = getRegisterPageContent({
    reason: 'expired',
    returnTo: '/catalog/10',
    referralCode: 'GANHE5',
    notice: {
      tone: 'warning',
      title: 'Sessao expirada',
      description: 'Entre novamente.',
    },
  });

  assert.equal(content.title, 'Criar conta');
  assert.equal(content.mode, 'register');
  assert.equal(content.notice?.tone, 'warning');
  assert.equal(content.referralCode, 'GANHE5');
  assert.equal(content.alternateHref, '/login?reason=expired&returnTo=%2Fcatalog%2F10&ref=GANHE5');
  assert.equal(content.fields.length, 5);
  assert.deepEqual(
    content.fields.map((field) => field.name),
    ['name', 'email', 'phone', 'password', 'referralCode'],
  );
  assert.equal(content.fields[4]?.defaultValue, 'GANHE5');
  assert.equal(content.fields[4]?.required, false);
});
