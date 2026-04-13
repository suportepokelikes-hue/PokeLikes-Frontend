"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageHeader = PageHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
function PageHeader({ eyebrow, title, description, actions, compact = false }) {
    const isCompact = compact || !description;
    return ((0, jsx_runtime_1.jsxs)("section", { className: `section-header${isCompact ? ' section-header-compact' : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header-copy", children: [eyebrow ? (0, jsx_runtime_1.jsx)("p", { className: "eyebrow", children: eyebrow }) : null, (0, jsx_runtime_1.jsx)("h1", { children: title }), description ? (0, jsx_runtime_1.jsx)("p", { className: "section-copy", children: description }) : null] }), actions ? (0, jsx_runtime_1.jsx)("div", { className: "page-actions", children: actions }) : null] }));
}
