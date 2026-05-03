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
    { href: '/#inicio', label: 'Inicio', match: (pathname) => pathname === '/' },
    { href: '/#servicos', label: 'Servicos', match: (pathname) => pathname === '/' },
    { href: '/#como-funciona', label: 'Como Funciona', match: (pathname) => pathname === '/' },
    { href: '/#beneficios', label: 'Beneficios', match: (pathname) => pathname === '/' },
    { href: '/#depoimentos', label: 'Depoimentos', match: (pathname) => pathname === '/' },
    { href: '/#faq', label: 'FAQ', match: (pathname) => pathname === '/' },
];
function PublicShell({ session, children }) {
    const pathname = (0, navigation_1.usePathname)();
    const [isMenuOpen, setIsMenuOpen] = (0, react_1.useState)(false);
    const { appName } = (0, env_1.getPublicEnv)();
    (0, react_1.useEffect)(() => {
        setIsMenuOpen(false);
    }, [pathname]);
    const accountHref = session.status === 'authenticated'
        ? session.user.role === 'admin'
            ? '/admin'
            : '/app/services'
        : '/register';
    const accountLabel = session.status === 'authenticated'
        ? 'Minha area'
        : 'Criar conta';
    return ((0, jsx_runtime_1.jsxs)("div", { className: "public-shell-v3", children: [(0, jsx_runtime_1.jsx)("header", { className: "public-header-v3", children: (0, jsx_runtime_1.jsxs)("div", { className: "public-header-inner-v3", children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: "/", className: "public-brand-v3", "aria-label": `Ir para a home da ${appName}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "public-brand-mark-v3", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "/brand/logo.jpeg", alt: appName, width: 48, height: 48, className: "brand-logo-image", priority: true }) }), (0, jsx_runtime_1.jsx)("span", { className: "public-brand-copy-v3", children: (0, jsx_runtime_1.jsx)("strong", { children: appName }) })] }), (0, jsx_runtime_1.jsx)("nav", { className: "public-nav-v3", "aria-label": "Navegacao principal", children: publicLinks.map((link) => ((0, jsx_runtime_1.jsx)(link_1.default, { href: link.href, className: `public-nav-link-v3${link.match(pathname) ? ' is-current' : ''}`, children: link.label }, link.href))) }), (0, jsx_runtime_1.jsx)("div", { className: "public-header-actions-v3", children: session.status === 'authenticated' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: accountHref, className: "public-shell-primary-v3", children: [accountLabel, (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16, strokeWidth: 2.1, "aria-hidden": "true" })] }), (0, jsx_runtime_1.jsx)(logout_button_1.LogoutButton, { label: "Sair" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/login", className: "public-shell-inline-link-v3", children: "Entrar" }), (0, jsx_runtime_1.jsxs)(link_1.default, { href: "/register", className: "public-shell-primary-v3", children: ["Criar conta", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16, strokeWidth: 2.1, "aria-hidden": "true" })] })] })) }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "public-mobile-toggle-v3", "aria-label": isMenuOpen ? 'Fechar menu' : 'Abrir menu', "aria-expanded": isMenuOpen, onClick: () => setIsMenuOpen((current) => !current), children: isMenuOpen ? (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 18, strokeWidth: 2.1, "aria-hidden": "true" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { size: 18, strokeWidth: 2.1, "aria-hidden": "true" }) })] }) }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: `public-mobile-backdrop-v3${isMenuOpen ? ' is-visible' : ''}`, "aria-label": "Fechar menu", onClick: () => setIsMenuOpen(false) }), (0, jsx_runtime_1.jsxs)("div", { className: `public-mobile-panel-v3${isMenuOpen ? ' is-open' : ''}`, children: [(0, jsx_runtime_1.jsx)("nav", { className: "public-mobile-nav-v3", "aria-label": "Navegacao mobile", children: publicLinks.map((link) => ((0, jsx_runtime_1.jsx)(link_1.default, { href: link.href, className: `public-mobile-link-v3${link.match(pathname) ? ' is-current' : ''}`, children: link.label }, link.href))) }), (0, jsx_runtime_1.jsx)("div", { className: "public-mobile-actions-v3", children: session.status === 'authenticated' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: accountHref, className: "public-shell-primary-v3", children: accountLabel }), (0, jsx_runtime_1.jsx)(logout_button_1.LogoutButton, { label: "Sair" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/register", className: "public-shell-primary-v3", children: "Criar conta" }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/login", className: "public-shell-secondary-v3", children: "Entrar" })] })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "public-shell-main-v3", children: children }), (0, jsx_runtime_1.jsx)("footer", { className: "public-footer-v3", children: (0, jsx_runtime_1.jsx)("div", { className: "public-footer-inner-v3", children: (0, jsx_runtime_1.jsxs)("p", { children: ["\u00A9 2025 ", appName, ". Todos os direitos reservados."] }) }) })] }));
}
