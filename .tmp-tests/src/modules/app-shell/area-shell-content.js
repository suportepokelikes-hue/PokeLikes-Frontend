"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAreaShellView = getAreaShellView;
exports.isCurrentPath = isCurrentPath;
const areaConfig = {
    customer: {
        label: 'Area cliente',
        brandMeta: 'Conta do cliente',
        sectionDescription: 'Saldo, pagamentos, pedidos e afiliados.',
        links: [
            { href: '/', label: 'Publico', icon: 'public', description: 'Landing e catalogo' },
            { href: '/app', label: 'Dashboard', icon: 'dashboard', description: 'Painel central' },
            { href: '/app/profile', label: 'Perfil', icon: 'profile', description: 'Conta e referral' },
            { href: '/app/affiliate', label: 'Afiliados', icon: 'affiliate', description: 'Codigo e ganhos' },
            { href: '/app/wallet', label: 'Carteira', icon: 'wallet', description: 'Saldo e extrato' },
            { href: '/app/payments', label: 'Pagamentos', icon: 'payments', description: 'PIX e status' },
            { href: '/app/orders', label: 'Pedidos', icon: 'orders', description: 'Fila e andamento' },
        ],
    },
    admin: {
        label: 'Area admin',
        brandMeta: 'Operacao Pokelike',
        sectionDescription: 'Operacao, monitoramento e acoes administrativas.',
        links: [
            { href: '/admin', label: 'Dashboard', icon: 'dashboard', description: 'Resumo da operacao' },
            { href: '/admin/users', label: 'Usuarios', icon: 'users', description: 'Acesso e carteira' },
            { href: '/admin/affiliates', label: 'Afiliados', icon: 'affiliate', description: 'Perfis e status' },
            { href: '/admin/affiliate-commissions', label: 'Comissoes afiliados', icon: 'affiliate', description: 'Receita atribuida' },
            { href: '/admin/affiliate-payouts', label: 'Payouts afiliados', icon: 'affiliate', description: 'Registro financeiro' },
            { href: '/admin/catalog', label: 'Catalogo', icon: 'catalog', description: 'Publicacao e afiliacao' },
            { href: '/admin/payments', label: 'Pagamentos', icon: 'payments', description: 'Conciliacao e status' },
            { href: '/admin/orders', label: 'Pedidos', icon: 'orders', description: 'Fila e sincronizacao' },
            { href: '/admin/supplier', label: 'Fornecedores', icon: 'suppliers', description: 'Saude e sync' },
            { href: '/admin/alerts', label: 'Alertas', icon: 'alerts', description: 'Pendencias agora' },
            { href: '/admin/audits', label: 'Auditoria', icon: 'audits', description: 'Rastro administrativo' },
            { href: '/admin/transactions', label: 'Transacoes', icon: 'transactions', description: 'Ledger e ajustes' },
        ],
    },
};
function getAreaShellView(options) {
    const { area, user, title, pathname, children } = options;
    const config = areaConfig[area];
    const currentLink = config.links.find((link) => isCurrentPath(pathname, link.href));
    return {
        areaClassName: `area-shell area-shell-${area}`,
        brandTitle: area === 'admin' ? 'Pokelike Ops' : 'Pokelike',
        brandMeta: config.brandMeta,
        eyebrow: config.label,
        title,
        currentSectionLabel: currentLink?.label ?? title,
        currentSectionDescription: config.sectionDescription,
        userName: user.name,
        userMeta: user.email,
        navigationLabel: `${config.label} navigation`,
        links: config.links.map((link) => ({
            ...link,
            isCurrent: isCurrentPath(pathname, link.href),
        })),
        children,
    };
}
function isCurrentPath(pathname, href) {
    if (href === '/') {
        return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}
