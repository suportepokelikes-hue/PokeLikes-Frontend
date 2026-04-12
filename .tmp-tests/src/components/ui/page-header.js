"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageHeader = PageHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
function PageHeader({ eyebrow, title, description, actions }) {
    return ((0, jsx_runtime_1.jsxs)("section", { className: "section-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header-copy", children: [(0, jsx_runtime_1.jsx)("p", { className: "eyebrow", children: eyebrow }), (0, jsx_runtime_1.jsx)("h1", { children: title }), (0, jsx_runtime_1.jsx)("p", { className: "section-copy", children: description })] }), actions ? (0, jsx_runtime_1.jsx)("div", { className: "page-actions", children: actions }) : null] }));
}
