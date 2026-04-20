'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicShell = PublicShell;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const env_1 = require("@/lib/config/env");
const logout_button_1 = require("@/modules/auth/logout-button");
const publicLinks = [
    {
        href: '/',
        label: 'Inicio',
        match: (pathname) => pathname === '/',
    },
    {
        href: '/catalog',
        label: 'Catalogo',
        match: (pathname) => pathname === '/catalog' || pathname.startsWith('/catalog/'),
    },
];
function PublicShell({ session, children }) {
    const pathname = (0, navigation_1.usePathname)();
    const [isMenuOpen, setIsMenuOpen] = (0, react_1.useState)(false);
    const { appName } = (0, env_1.getPublicEnv)();
    (0, react_1.useEffect)(() => {
        setIsMenuOpen(false);
    }, [pathname]);
    const accountHref = session.status === 'authenticated' ? (session.user.role === 'admin' ? '/admin' : '/app') : '/register';
    const accountLabel = session.status === 'authenticated' ? 'Minha area' : 'Criar conta';
    const footerLinks = (0, react_1.useMemo)(() => [
        ...publicLinks.map(({ href, label }) => ({ href, label })),
        { href: '/login', label: 'Entrar' },
        { href: accountHref, label: accountLabel },
    ], [accountHref, accountLabel]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "public-shell", children: [(0, jsx_runtime_1.jsx)("header", { className: "public-header", children: (0, jsx_runtime_1.jsxs)("div", { className: "public-header-inner", children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: "/", className: "public-brand", "aria-label": `Ir para a home da ${appName}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "public-brand-mark", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "/brand/logo.jpeg", alt: appName, width: 52, height: 52, className: "brand-logo-image", priority: true }) }), (0, jsx_runtime_1.jsx)("span", { className: "public-brand-copy", children: (0, jsx_runtime_1.jsx)("strong", { children: appName }) })] }), (0, jsx_runtime_1.jsx)("nav", { className: "public-nav", "aria-label": "Navegacao principal", children: publicLinks.map((link) => ((0, jsx_runtime_1.jsx)(link_1.default, { href: link.href, className: `public-nav-link${link.match(pathname) ? ' is-current' : ''}`, children: link.label }, link.href))) }), (0, jsx_runtime_1.jsx)("div", { className: "public-header-actions", children: session.status === 'authenticated' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: accountHref, className: "primary-action", children: [accountLabel, (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16, strokeWidth: 2.15, "aria-hidden": "true" })] }), (0, jsx_runtime_1.jsx)(logout_button_1.LogoutButton, { label: "Sair" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/login", className: "secondary-action", children: "Entrar" }), (0, jsx_runtime_1.jsxs)(link_1.default, { href: "/register", className: "primary-action", children: ["Criar conta", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16, strokeWidth: 2.15, "aria-hidden": "true" })] })] })) }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "public-mobile-toggle", "aria-label": isMenuOpen ? 'Fechar menu' : 'Abrir menu', "aria-expanded": isMenuOpen, onClick: () => setIsMenuOpen((current) => !current), children: isMenuOpen ? (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 18, strokeWidth: 2.1, "aria-hidden": "true" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { size: 18, strokeWidth: 2.1, "aria-hidden": "true" }) })] }) }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: `public-mobile-backdrop${isMenuOpen ? ' is-visible' : ''}`, "aria-label": "Fechar menu", onClick: () => setIsMenuOpen(false) }), (0, jsx_runtime_1.jsxs)("div", { className: `public-mobile-panel${isMenuOpen ? ' is-open' : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "public-mobile-panel-copy", children: (0, jsx_runtime_1.jsx)("strong", { children: appName }) }), (0, jsx_runtime_1.jsx)("nav", { className: "public-mobile-nav", "aria-label": "Navegacao mobile", children: publicLinks.map((link) => ((0, jsx_runtime_1.jsx)(link_1.default, { href: link.href, className: `public-mobile-link${link.match(pathname) ? ' is-current' : ''}`, children: link.label }, link.href))) }), (0, jsx_runtime_1.jsx)("div", { className: "public-mobile-actions", children: session.status === 'authenticated' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: accountHref, className: "primary-action", children: accountLabel }), (0, jsx_runtime_1.jsx)(logout_button_1.LogoutButton, { label: "Sair" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/register", className: "primary-action", children: "Criar conta" }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/login", className: "secondary-action", children: "Entrar" })] })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "public-shell-main", children: children }), (0, jsx_runtime_1.jsx)("footer", { className: "public-footer", children: (0, jsx_runtime_1.jsxs)("div", { className: "public-footer-inner", children: [(0, jsx_runtime_1.jsxs)("div", { className: "public-footer-brand", children: [(0, jsx_runtime_1.jsx)("span", { className: "public-footer-mark", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "/brand/logo.jpeg", alt: appName, width: 48, height: 48, className: "brand-logo-image" }) }), (0, jsx_runtime_1.jsx)("div", { className: "public-footer-copy", children: (0, jsx_runtime_1.jsx)("strong", { children: appName }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "public-footer-links", children: footerLinks.map((link) => ((0, jsx_runtime_1.jsx)(link_1.default, { href: link.href, className: "public-footer-link", children: link.label }, `${link.href}-${link.label}`))) })] }) })] }));
}
