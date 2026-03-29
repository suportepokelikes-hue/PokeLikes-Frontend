import test from 'node:test';
import assert from 'node:assert/strict';

import { getAreaShellView, isCurrentPath } from '../src/modules/app-shell/area-shell-content';
import type { UserSummary } from '../src/lib/api/contracts';

const user: UserSummary = {
  id: '7',
  role: 'admin',
  name: 'Operador',
  email: 'ops@likesuai.com',
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
  assert.equal(view.eyebrow, 'Area admin');
  assert.equal(view.title, 'Pedidos');
  assert.equal(view.userName, 'Operador');
  assert.equal(view.userMeta, 'ops@likesuai.com / active');
  assert.equal(view.navigationLabel, 'Area admin navigation');
  assert.equal(view.children, 'conteudo');
  assert.equal(view.links.find((link) => link.href === '/admin/orders')?.isCurrent, true);
  assert.equal(view.links.find((link) => link.href === '/admin/users')?.isCurrent, false);
});
