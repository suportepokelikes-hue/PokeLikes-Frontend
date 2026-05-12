import test from 'node:test';
import assert from 'node:assert/strict';

import { getAreaShellView, isCurrentPath } from '../src/modules/app-shell/area-shell-content';
import type { UserSummary, WalletSummary } from '../src/lib/api/contracts';

const user: UserSummary = {
  id: '7',
  role: 'admin',
  name: 'Operador',
  email: 'ops@exemplo.com',
  status: 'active',
};

test('isCurrentPath matches exact and nested routes without leaking to root', () => {
  assert.equal(isCurrentPath('/', '/'), true);
  assert.equal(isCurrentPath('/admin/orders', '/admin'), true);
  assert.equal(isCurrentPath('/admin/orders/10', '/admin/orders'), true);
  assert.equal(isCurrentPath('/catalog', '/'), false);
});

test('getAreaShellView marks the current admin link and exposes user meta', () => {
  const view = getAreaShellView({
    area: 'admin',
    user,
    title: 'Pedidos',
    pathname: '/admin/orders/10',
    children: 'conteudo',
  });

  assert.equal(view.areaClassName, 'area-shell area-shell-admin');
  assert.equal(view.title, 'Pedidos');
  assert.equal(view.userName, 'Operador');
  assert.equal(view.userMeta, 'ops@exemplo.com');
  assert.equal(view.navigationLabel, 'Area admin navigation');
  assert.equal(view.children, 'conteudo');
  assert.equal(view.links.find((link) => link.href === '/admin/orders')?.isCurrent, true);
  assert.equal(view.links.find((link) => link.href === '/admin/users')?.isCurrent, false);
  assert.equal(view.profileShortcut?.href, '/admin/users?editUserId=7');
  assert.equal(view.profileShortcut?.ariaLabel, 'Abrir meu perfil');
  assert.equal(view.profileShortcut?.hasNotification, undefined);
});

test('getAreaShellView includes the affiliate route in the customer shell', () => {
  const walletSummary: WalletSummary = {
    id: 'wallet-1',
    availableBalance: { amount: '10', currency: 'BRL' },
  };
  const customerView = getAreaShellView({
    area: 'customer',
    user: {
      id: '11',
      role: 'customer',
      name: 'Cliente',
      email: 'cliente@exemplo.com',
      status: 'active',
    },
    title: 'Afiliados',
    pathname: '/app/affiliate',
    walletSummary,
    children: 'conteudo-cliente',
  });

  assert.equal(customerView.links.find((link) => link.href === '/app/affiliate')?.isCurrent, true);
  assert.equal(customerView.links.some((link) => link.href === '/app/new-order'), true);
  assert.equal(customerView.links.some((link) => link.href === '/app/support'), true);
  assert.equal(customerView.links.some((link) => link.href === '/app/profile'), false);
  assert.equal(customerView.walletShortcut?.href, '/app/wallet');
  assert.equal(customerView.walletShortcut?.label, 'R$\u00a010,00');
  assert.equal(customerView.profileShortcut?.href, '/app/profile');
});

test('getAreaShellView keeps profile as a titled customer section outside the sidebar', () => {
  const customerView = getAreaShellView({
    area: 'customer',
    user: {
      id: '12',
      role: 'customer',
      name: 'Cliente',
      email: 'cliente@exemplo.com',
      status: 'active',
    },
    title: 'Minha conta',
    pathname: '/app/profile',
    children: 'conteudo-cliente',
  });

  assert.equal(customerView.currentSectionLabel, 'Perfil');
  assert.equal(customerView.walletShortcut?.label, 'Saldo indisponivel');
});

test('getAreaShellView includes the affiliate route in the admin shell', () => {
  const adminView = getAreaShellView({
    area: 'admin',
    user,
    title: 'Payouts afiliados',
    pathname: '/admin/affiliate-payouts',
    children: 'conteudo-admin',
  });

  assert.equal(adminView.links.find((link) => link.href === '/admin/affiliate-payouts')?.isCurrent, true);
  assert.equal(adminView.links.find((link) => link.href === '/admin/affiliate-commissions')?.isCurrent, false);
  assert.equal(adminView.links.find((link) => link.href === '/admin/orders')?.isCurrent, false);
});
