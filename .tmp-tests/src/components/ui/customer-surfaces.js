"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSectionCard = CustomerSectionCard;
exports.CustomerMetricCard = CustomerMetricCard;
exports.CustomerQuickActionCard = CustomerQuickActionCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const link_1 = __importDefault(require("next/link"));
function CustomerSectionCard({ eyebrow, title, meta, actions, children, className, }) {
    return ((0, jsx_runtime_1.jsxs)("section", { className: `customer-section-card${className ? ` ${className}` : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "customer-section-card-head", children: [(0, jsx_runtime_1.jsxs)("div", { className: "customer-section-card-copy", children: [eyebrow ? (0, jsx_runtime_1.jsx)("p", { className: "eyebrow", children: eyebrow }) : null, (0, jsx_runtime_1.jsx)("h2", { children: title })] }), meta || actions ? ((0, jsx_runtime_1.jsxs)("div", { className: "customer-section-card-meta", children: [meta ? (0, jsx_runtime_1.jsx)("div", { className: "customer-section-card-meta-node", children: meta }) : null, actions ? (0, jsx_runtime_1.jsx)("div", { className: "customer-section-card-actions", children: actions }) : null] })) : null] }), (0, jsx_runtime_1.jsx)("div", { className: "customer-section-card-body", children: children })] }));
}
function CustomerMetricCard({ label, value, meta, icon: Icon, tone = 'default', }) {
    return ((0, jsx_runtime_1.jsxs)("article", { className: `customer-metric-card customer-metric-card-${tone}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "customer-metric-card-head", children: [(0, jsx_runtime_1.jsx)("span", { className: "customer-metric-card-icon", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)(Icon, { size: 18, strokeWidth: 2.05 }) }), (0, jsx_runtime_1.jsx)("span", { className: "customer-metric-card-label", children: label })] }), (0, jsx_runtime_1.jsx)("strong", { className: "customer-metric-card-value", children: value }), meta ? (0, jsx_runtime_1.jsx)("p", { className: "customer-metric-card-meta", children: meta }) : null] }));
}
function CustomerQuickActionCard({ href, icon: Icon, title, meta, tone = 'default', }) {
    return ((0, jsx_runtime_1.jsxs)(link_1.default, { href: href, prefetch: false, className: `customer-quick-action customer-quick-action-${tone}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "customer-quick-action-head", children: [(0, jsx_runtime_1.jsx)("span", { className: "customer-quick-action-icon", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)(Icon, { size: 18, strokeWidth: 2.05 }) }), meta ? (0, jsx_runtime_1.jsx)("span", { className: "customer-quick-action-meta", children: meta }) : null] }), (0, jsx_runtime_1.jsx)("strong", { children: title })] }));
}
