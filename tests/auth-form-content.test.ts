import test from 'node:test';
import assert from 'node:assert/strict';

import { getAuthFormView, type AuthFormContent } from '../src/modules/auth/auth-form-content';

const baseContent: AuthFormContent = {
  brandLabel: 'Pokelike',
  title: 'Entrar',
  eyebrow: 'Acesso',
  description: 'Descricao do fluxo.',
  notice: {
    tone: 'info',
    title: 'Sessao expirada',
    description: 'Entre novamente.',
  },
  returnTo: '/admin/orders',
  panelTitle: 'Painel',
  panelCopy: 'Resumo',
  panelItems: ['item 1', 'item 2'],
  footnote: 'Rodape operacional.',
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'voce@exemplo.com',
      autoComplete: 'email',
      inputMode: 'email',
      description: 'Campo principal.',
    },
    {
      name: 'password',
      label: 'Senha',
      type: 'password',
      placeholder: 'Sua senha',
      autoComplete: 'current-password',
    },
  ],
  submitLabel: 'Entrar',
  pendingLabel: 'Validando acesso...',
  alternateHref: '/register?returnTo=%2Fadmin%2Forders',
  alternateLabel: 'Criar conta',
  alternatePrompt: 'Ainda nao tem cadastro?',
};

test('getAuthFormView exposes notice, hidden returnTo and field descriptors', () => {
  const view = getAuthFormView(baseContent, { status: 'idle' });

  assert.deepEqual(view.notice, baseContent.notice);
  assert.equal(view.hiddenReturnTo, '/admin/orders');
  assert.equal(view.fields.length, 2);
  assert.equal(view.fields[0]?.name, 'email');
  assert.equal(view.fields[0]?.description, 'Campo principal.');
  assert.equal(view.error, null);
  assert.equal(view.alternateHref, '/register?returnTo=%2Fadmin%2Forders');
});

test('getAuthFormView builds auth error copy and fallback message', () => {
  const explicitError = getAuthFormView(baseContent, {
    status: 'error',
    message: 'Credenciais invalidas.',
  });

  assert.deepEqual(explicitError.error, {
    title: 'Falha na autenticacao',
    message: 'Credenciais invalidas.',
  });

  const fallbackError = getAuthFormView(
    {
      ...baseContent,
      notice: null,
      returnTo: null,
    },
    { status: 'error' },
  );

  assert.equal(fallbackError.notice, null);
  assert.equal(fallbackError.hiddenReturnTo, null);
  assert.deepEqual(fallbackError.error, {
    title: 'Falha na autenticacao',
    message: 'Nao foi possivel concluir a autenticacao.',
  });
});
