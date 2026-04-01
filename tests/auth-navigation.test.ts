import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getAuthNotice,
  getLoginPath,
  getPostAuthRedirectPath,
  getRegisterPath,
  normalizeReferralCode,
  normalizeReturnTo,
} from '../src/lib/auth/navigation';

test('normalizeReturnTo rejects unsafe or auth entry paths', () => {
  assert.equal(normalizeReturnTo('https://evil.example'), null);
  assert.equal(normalizeReturnTo('//evil.example'), null);
  assert.equal(normalizeReturnTo('/login?reason=required'), null);
  assert.equal(normalizeReturnTo('/register'), null);
  assert.equal(normalizeReturnTo('/admin/users?page=2'), '/admin/users?page=2');
});

test('getLoginPath preserves safe returnTo and reason', () => {
  assert.equal(getLoginPath({ reason: 'required', returnTo: '/admin/users?page=2' }), '/login?reason=required&returnTo=%2Fadmin%2Fusers%3Fpage%3D2');
  assert.equal(getLoginPath({ reason: 'logged_out', returnTo: '/login' }), '/login?reason=logged_out');
});

test('auth entry paths preserve a normalized referral code when present', () => {
  assert.equal(getRegisterPath({ referralCode: ' INDICA123 ' }), '/register?ref=INDICA123');
  assert.equal(getLoginPath({ reason: 'required', referralCode: 'ABC' }), '/login?reason=required&ref=ABC');
  assert.equal(normalizeReferralCode('   '), null);
});

test('getPostAuthRedirectPath prevents crossing protected areas', () => {
  assert.equal(getPostAuthRedirectPath('customer', '/admin/users/123'), '/app');
  assert.equal(getPostAuthRedirectPath('admin', '/app/orders/1'), '/admin');
  assert.equal(getPostAuthRedirectPath('admin', '/admin/catalog/10'), '/admin/catalog/10');
});

test('getAuthNotice maps reason and returnTo into the correct notice copy', () => {
  assert.deepEqual(getAuthNotice({ reason: 'required', returnTo: '/catalog/10' }), {
    tone: 'info',
    title: 'Acesso necessario',
    description: 'Entre para continuar exatamente na rota protegida que originou este redirecionamento.',
  });

  assert.deepEqual(getAuthNotice({ reason: 'expired' }), {
    tone: 'warning',
    title: 'Sessao expirada',
    description: 'Sua sessao nao pode ser renovada. Entre novamente para continuar.',
  });
});
