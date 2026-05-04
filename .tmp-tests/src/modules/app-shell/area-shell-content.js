"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAreaShellView = getAreaShellView;
exports.isCurrentPath = isCurrentPath;
const format_1 = require("../../lib/format");
const areaConfig = {
    customer: {
        label: 'Area cliente',
        brandMeta: 'Cliente',
        sectionDescription: 'Conta, saldo e pedidos.',
        links: [
            { href: '/app/new-order', label: 'Novo pedido', icon: 'orders' },
            { href: '/app/services', label: 'Servicos', icon: 'catalog' },
            { href: '/app/orders', label: 'Pedidos', icon: 'orders' },
            { href: '/app/affiliate', label: 'Afiliados', icon: 'affiliate' },
            { href: '/app/wallet', label: 'Carteira', icon: 'wallet' },
            { href: '/app/payments', label: 'Pagamentos', icon: 'payments' },
        ],
        sections: [{ href: '/app/profile', label: 'Perfil' }],
    },
    admin: {
        label: 'Area admin',
        brandMeta: 'Operacao',
        sectionDescription: 'Operacao e monitoramento.',
        links: [
            { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
            { href: '/admin/users', label: 'Usuarios', icon: 'users' },
            { href: '/admin/affiliates', label: 'Afiliados', icon: 'affiliate' },
            { href: '/admin/affiliate-commissions', label: 'Comissoes afiliados', icon: 'affiliate' },
            { href: '/admin/affiliate-payouts', label: 'Payouts afiliados', icon: 'affiliate' },
            { href: '/admin/catalog', label: 'Catalogo', icon: 'catalog' },
            { href: '/admin/payments', label: 'Pagamentos', icon: 'payments' },
            { href: '/admin/orders', label: 'Pedidos', icon: 'orders' },
            { href: '/admin/supplier', label: 'Fornecedores', icon: 'suppliers' },
            { href: '/admin/alerts', label: 'Alertas', icon: 'alerts' },
            { href: '/admin/audits', label: 'Auditoria', icon: 'audits' },
            { href: '/admin/transactions', label: 'Transacoes', icon: 'transactions' },
        ],
        sections: [],
    },
};
function getAreaShellView(options) {
    const { area, user, title, pathname, walletSummary, children } = options;
    const config = areaConfig[area];
    const currentSection = [...config.links, ...config.sections].find((link) => isCurrentPath(pathname, link.href));
    const walletLabel = walletSummary ? (0, format_1.formatMoney)(walletSummary.availableBalance) : 'Saldo indisponivel';
    return {
        areaClassName: `area-shell area-shell-${area}`,
        brandTitle: area === 'admin' ? 'Pokelike Ops' : 'Pokelike',
        brandMeta: config.brandMeta,
        title,
        currentSectionLabel: currentSection?.label ?? title,
        currentSectionDescription: config.sectionDescription,
        userName: user.name,
        userMeta: user.email,
        navigationLabel: `${config.label} navigation`,
        links: config.links.map((link) => ({
            ...link,
            isCurrent: isCurrentPath(pathname, link.href),
        })),
        walletShortcut: area === 'customer'
            ? {
                href: '/app/wallet',
                label: walletLabel,
                ariaLabel: walletSummary ? `Abrir carteira com saldo ${walletLabel}` : 'Abrir carteira',
            }
            : null,
        profileShortcut: area === 'customer'
            ? {
                href: '/app/profile',
                label: 'Abrir perfil',
                ariaLabel: user.emailVerified ? 'Abrir perfil' : 'Abrir perfil, email pendente',
                hasNotification: !user.emailVerified,
            }
            : null,
        children,
    };
}
function isCurrentPath(pathname, href) {
    if (href === '/') {
        return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}
