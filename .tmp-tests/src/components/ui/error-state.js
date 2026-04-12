"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorState = ErrorState;
const jsx_runtime_1 = require("react/jsx-runtime");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
function ErrorState({ title, description, actionHref, actionLabel }) {
    return ((0, jsx_runtime_1.jsxs)("section", { className: "feedback-panel feedback-error", children: [(0, jsx_runtime_1.jsxs)("div", { className: "feedback-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "feedback-title-group", children: [(0, jsx_runtime_1.jsx)("span", { className: "feedback-icon feedback-icon-danger", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TriangleAlert, { size: 18, strokeWidth: 2.1 }) }), (0, jsx_runtime_1.jsx)("p", { className: "eyebrow", children: "Erro de integracao" })] }), (0, jsx_runtime_1.jsx)("span", { className: "feedback-kicker", children: "Estado de erro" })] }), (0, jsx_runtime_1.jsx)("h2", { children: title }), (0, jsx_runtime_1.jsx)("p", { className: "section-copy", children: description }), actionHref && actionLabel ? ((0, jsx_runtime_1.jsx)("div", { className: "feedback-actions", children: (0, jsx_runtime_1.jsxs)(link_1.default, { href: actionHref, className: "secondary-action", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16, strokeWidth: 2.15, "aria-hidden": "true" }), actionLabel] }) })) : null] }));
}
