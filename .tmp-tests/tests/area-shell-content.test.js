"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const area_shell_content_1 = require("../src/modules/app-shell/area-shell-content");
const user = {
    id: '7',
    role: 'admin',
    name: 'Operador',
    email: 'ops@exemplo.com',
    status: 'active',
};
(0, node_test_1.default)('isCurrentPath matches exact and nested routes without leaking to root', () => {
    strict_1.default.equal((0, area_shell_content_1.isCurrentPath)('/', '/'), true);
    strict_1.default.equal((0, area_shell_content_1.isCurrentPath)('/admin/orders', '/admin'), true);
    strict_1.default.equal((0, area_shell_content_1.isCurrentPath)('/admin/orders/10', '/admin/orders'), true);
    strict_1.default.equal((0, area_shell_content_1.isCurrentPath)('/catalog', '/'), false);
});
(0, node_test_1.default)('getAreaShellView marks the current admin link and exposes user meta', () => {
    const view = (0, area_shell_content_1.getAreaShellView)({
        area: 'admin',
        user,
        title: 'Pedidos',
        pathname: '/admin/orders/10',
        children: 'conteudo',
    });
    strict_1.default.equal(view.areaClassName, 'area-shell area-shell-admin');
    strict_1.default.equal(view.title, 'Pedidos');
    strict_1.default.equal(view.userName, 'Operador');
    strict_1.default.equal(view.userMeta, 'ops@exemplo.com');
    strict_1.default.equal(view.navigationLabel, 'Area admin navigation');
    strict_1.default.equal(view.children, 'conteudo');
    strict_1.default.equal(view.links.find((link) => link.href === '/admin/orders')?.isCurrent, true);
    strict_1.default.equal(view.links.find((link) => link.href === '/admin/users')?.isCurrent, false);
});
(0, node_test_1.default)('getAreaShellView includes the affiliate route in the customer shell', () => {
    const walletSummary = {
        id: 'wallet-1',
        availableBalance: { amount: '10', currency: 'BRL' },
    };
    const customerView = (0, area_shell_content_1.getAreaShellView)({
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
    strict_1.default.equal(customerView.links.find((link) => link.href === '/app/affiliate')?.isCurrent, true);
    strict_1.default.equal(customerView.links.some((link) => link.href === '/app/new-order'), true);
    strict_1.default.equal(customerView.links.some((link) => link.href === '/app/profile'), false);
    strict_1.default.equal(customerView.walletShortcut?.href, '/app/wallet');
    strict_1.default.equal(customerView.walletShortcut?.label, 'R$\u00a010,00');
    strict_1.default.equal(customerView.profileShortcut?.href, '/app/profile');
});
(0, node_test_1.default)('getAreaShellView keeps profile as a titled customer section outside the sidebar', () => {
    const customerView = (0, area_shell_content_1.getAreaShellView)({
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
    strict_1.default.equal(customerView.currentSectionLabel, 'Perfil');
    strict_1.default.equal(customerView.walletShortcut?.label, 'Saldo indisponivel');
});
(0, node_test_1.default)('getAreaShellView includes the affiliate route in the admin shell', () => {
    const adminView = (0, area_shell_content_1.getAreaShellView)({
        area: 'admin',
        user,
        title: 'Payouts afiliados',
        pathname: '/admin/affiliate-payouts',
        children: 'conteudo-admin',
    });
    strict_1.default.equal(adminView.links.find((link) => link.href === '/admin/affiliate-payouts')?.isCurrent, true);
    strict_1.default.equal(adminView.links.find((link) => link.href === '/admin/affiliate-commissions')?.isCurrent, false);
    strict_1.default.equal(adminView.links.find((link) => link.href === '/admin/orders')?.isCurrent, false);
});
