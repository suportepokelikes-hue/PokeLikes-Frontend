"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatCard = StatCard;
const jsx_runtime_1 = require("react/jsx-runtime");
function StatCard({ label, value, meta, tone = 'default' }) {
    return ((0, jsx_runtime_1.jsxs)("article", { className: `stat-card stat-${tone}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-card-label", children: label }), (0, jsx_runtime_1.jsx)("strong", { className: "stat-card-value", children: value }), meta ? (0, jsx_runtime_1.jsx)("p", { className: "stat-card-meta", children: meta }) : null] }));
}
