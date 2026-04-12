"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const server_1 = require("react-dom/server");
const empty_state_1 = require("../src/components/ui/empty-state");
const error_state_1 = require("../src/components/ui/error-state");
const page_header_1 = require("../src/components/ui/page-header");
const status_badge_1 = require("../src/components/ui/status-badge");
(0, node_test_1.default)('EmptyState renders feedback copy and optional CTA', () => {
    const html = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(empty_state_1.EmptyState, { title: "Nada por aqui", description: "A consulta nao retornou itens.", actionHref: "/catalog", actionLabel: "Voltar ao catalogo" }));
    strict_1.default.match(html, /Sem resultados/);
    strict_1.default.match(html, /Nada por aqui/);
    strict_1.default.match(html, /A consulta nao retornou itens\./);
    strict_1.default.match(html, /href="\/catalog"/);
    strict_1.default.match(html, /Voltar ao catalogo/);
});
(0, node_test_1.default)('ErrorState renders error shell and CTA only when provided', () => {
    const html = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(error_state_1.ErrorState, { title: "Falha", description: "Nao foi possivel carregar.", actionHref: "/app", actionLabel: "Tentar de novo" }));
    strict_1.default.match(html, /Erro de integracao/);
    strict_1.default.match(html, /Estado de erro/);
    strict_1.default.match(html, /href="\/app"/);
    const withoutAction = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(error_state_1.ErrorState, { title: "Falha", description: "Sem acao." }));
    strict_1.default.doesNotMatch(withoutAction, /feedback-actions/);
});
(0, node_test_1.default)('StatusBadge and PageHeader expose the expected semantic content', () => {
    const badgeHtml = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(status_badge_1.StatusBadge, { label: "active", tone: "success" }));
    strict_1.default.match(badgeHtml, /status-badge status-success/);
    strict_1.default.match(badgeHtml, />active</);
    const headerHtml = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(page_header_1.PageHeader, { eyebrow: "Admin / testes", title: "Cabecalho", description: "Descricao do cabecalho.", actions: (0, jsx_runtime_1.jsx)("a", { href: "/admin", children: "Voltar" }) }));
    strict_1.default.match(headerHtml, /Admin \/ testes/);
    strict_1.default.match(headerHtml, /<h1>Cabecalho<\/h1>/);
    strict_1.default.match(headerHtml, /Descricao do cabecalho\./);
    strict_1.default.match(headerHtml, /href="\/admin"/);
});
