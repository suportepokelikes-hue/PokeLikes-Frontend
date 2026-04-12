"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = EmptyState;
const jsx_runtime_1 = require("react/jsx-runtime");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
function EmptyState({ title, description, actionHref, actionLabel }) {
    return ((0, jsx_runtime_1.jsxs)("section", { className: "feedback-panel", children: [(0, jsx_runtime_1.jsxs)("div", { className: "feedback-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "feedback-title-group", children: [(0, jsx_runtime_1.jsx)("span", { className: "feedback-icon", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Inbox, { size: 18, strokeWidth: 2.1 }) }), (0, jsx_runtime_1.jsx)("p", { className: "eyebrow", children: "Sem resultados" })] }), (0, jsx_runtime_1.jsx)("span", { className: "feedback-kicker", children: "Estado vazio" })] }), (0, jsx_runtime_1.jsx)("h2", { children: title }), (0, jsx_runtime_1.jsx)("p", { className: "section-copy", children: description }), actionHref && actionLabel ? ((0, jsx_runtime_1.jsx)("div", { className: "feedback-actions", children: (0, jsx_runtime_1.jsxs)(link_1.default, { href: actionHref, className: "secondary-action", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16, strokeWidth: 2.15, "aria-hidden": "true" }), actionLabel] }) })) : null] }));
}
