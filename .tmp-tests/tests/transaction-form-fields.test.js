"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const server_1 = require("react-dom/server");
const transaction_form_1 = require("../src/modules/customer-transactions/transaction-form");
(0, node_test_1.default)('TransactionField renders number constraints and readOnly state', () => {
    const html = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(transaction_form_1.TransactionField, { label: "Quantidade", name: "quantity", type: "number", placeholder: "100", required: true, min: 50, max: 5000, step: 10, defaultValue: 250, readOnly: true }));
    strict_1.default.match(html, /Quantidade/);
    strict_1.default.match(html, /name="quantity"/);
    strict_1.default.match(html, /type="number"/);
    strict_1.default.match(html, /placeholder="100"/);
    strict_1.default.match(html, /required=""/);
    strict_1.default.match(html, /min="50"/);
    strict_1.default.match(html, /max="5000"/);
    strict_1.default.match(html, /step="10"/);
    strict_1.default.match(html, /value="250"/);
    strict_1.default.match(html, /readOnly=""/);
    strict_1.default.match(html, /transaction-input/);
});
(0, node_test_1.default)('TransactionTextarea renders label, name and placeholder', () => {
    const html = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(transaction_form_1.TransactionTextarea, { label: "Comments", name: "comments", placeholder: "Um comentario por linha" }));
    strict_1.default.match(html, /Comments/);
    strict_1.default.match(html, /name="comments"/);
    strict_1.default.match(html, /placeholder="Um comentario por linha"/);
    strict_1.default.match(html, /transaction-textarea/);
    strict_1.default.match(html, /rows="4"/);
});
