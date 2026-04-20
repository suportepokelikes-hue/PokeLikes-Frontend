"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSectionCard = AdminSectionCard;
exports.AdminMetricCard = AdminMetricCard;
exports.AdminQuickLinkCard = AdminQuickLinkCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const link_1 = __importDefault(require("next/link"));
function AdminSectionCard({ eyebrow, title, description, meta, actions, children, className, }) {
    return ((0, jsx_runtime_1.jsxs)("section", { className: `admin-section-card${className ? ` ${className}` : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "admin-section-card-head", children: [(0, jsx_runtime_1.jsxs)("div", { className: "admin-section-card-copy", children: [eyebrow ? (0, jsx_runtime_1.jsx)("p", { className: "eyebrow", children: eyebrow }) : null, (0, jsx_runtime_1.jsx)("h2", { children: title }), description ? (0, jsx_runtime_1.jsx)("p", { children: description }) : null] }), meta || actions ? ((0, jsx_runtime_1.jsxs)("div", { className: "admin-section-card-meta", children: [meta ? (0, jsx_runtime_1.jsx)("div", { className: "admin-section-card-meta-node", children: meta }) : null, actions ? (0, jsx_runtime_1.jsx)("div", { className: "admin-section-card-actions", children: actions }) : null] })) : null] }), (0, jsx_runtime_1.jsx)("div", { className: "admin-section-card-body", children: children })] }));
}
function AdminMetricCard({ label, value, meta, icon: Icon, tone = 'default', }) {
    return ((0, jsx_runtime_1.jsxs)("article", { className: `admin-metric-card admin-metric-card-${tone}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "admin-metric-card-head", children: [(0, jsx_runtime_1.jsx)("span", { className: "admin-metric-card-icon", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)(Icon, { size: 18, strokeWidth: 2.05 }) }), (0, jsx_runtime_1.jsx)("span", { className: "admin-metric-card-label", children: label })] }), (0, jsx_runtime_1.jsx)("strong", { className: "admin-metric-card-value", children: value }), meta ? (0, jsx_runtime_1.jsx)("p", { className: "admin-metric-card-meta", children: meta }) : null] }));
}
function AdminQuickLinkCard({ href, icon: Icon, title, description, meta, tone = 'default', }) {
    return ((0, jsx_runtime_1.jsxs)(link_1.default, { href: href, prefetch: false, className: `admin-quick-link admin-quick-link-${tone}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "admin-quick-link-head", children: [(0, jsx_runtime_1.jsx)("span", { className: "admin-quick-link-icon", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)(Icon, { size: 18, strokeWidth: 2.05 }) }), meta ? (0, jsx_runtime_1.jsx)("span", { className: "admin-quick-link-meta", children: meta }) : null] }), (0, jsx_runtime_1.jsx)("strong", { children: title }), (0, jsx_runtime_1.jsx)("p", { children: description })] }));
}
