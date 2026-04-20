"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBadge = StatusBadge;
const jsx_runtime_1 = require("react/jsx-runtime");
function StatusBadge({ label, tone = 'neutral' }) {
    return ((0, jsx_runtime_1.jsxs)("span", { className: `status-badge status-${tone}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "status-badge-dot", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { className: "status-badge-label", children: label })] }));
}
