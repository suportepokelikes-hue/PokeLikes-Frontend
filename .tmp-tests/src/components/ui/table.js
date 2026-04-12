"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = DataTable;
const jsx_runtime_1 = require("react/jsx-runtime");
function DataTable({ columns, children }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "table-shell", children: [(0, jsx_runtime_1.jsxs)("table", { className: "data-table", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsx)("tr", { children: columns.map((column) => ((0, jsx_runtime_1.jsx)("th", { children: column }, column))) }) }), (0, jsx_runtime_1.jsx)("tbody", { children: children })] }), (0, jsx_runtime_1.jsx)("div", { className: "table-fade", "aria-hidden": "true" })] }));
}
