'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionForm = TransactionForm;
exports.TransactionField = TransactionField;
exports.TransactionTextarea = TransactionTextarea;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const transaction_form_content_1 = require("./transaction-form-content");
function TransactionForm({ title, description, action, initialState, children, submitLabel, returnTo, surface = 'card', }) {
    const [state, formAction] = (0, react_1.useActionState)(action, initialState);
    const view = (0, transaction_form_content_1.getTransactionFormView)({
        title,
        description,
        children,
        submitLabel,
        returnTo,
    }, state);
    const content = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "panel-heading", children: (0, jsx_runtime_1.jsxs)("div", { className: "stack-item", children: [(0, jsx_runtime_1.jsx)("strong", { children: view.title }), view.description ? (0, jsx_runtime_1.jsx)("p", { children: view.description }) : null] }) }), (0, jsx_runtime_1.jsxs)("form", { action: formAction, className: "transaction-form", children: [view.hiddenReturnTo ? (0, jsx_runtime_1.jsx)("input", { type: "hidden", name: "returnTo", value: view.hiddenReturnTo }) : null, view.children, view.feedback ? (view.feedback.tone === 'blocked' ? ((0, jsx_runtime_1.jsxs)("div", { className: "auth-notice auth-notice-warning", role: "alert", "aria-live": "polite", children: [(0, jsx_runtime_1.jsx)("strong", { children: "CPF/CNPJ necessario para PIX" }), (0, jsx_runtime_1.jsx)("p", { children: view.feedback.message }), view.feedback.actionHref && view.feedback.actionLabel ? ((0, jsx_runtime_1.jsx)("a", { href: view.feedback.actionHref, className: "secondary-action", children: view.feedback.actionLabel })) : null] })) : ((0, jsx_runtime_1.jsx)("p", { className: "auth-error", role: "alert", "aria-live": "polite", children: view.feedback.message }))) : null, (0, jsx_runtime_1.jsx)(SubmitButton, { label: view.submitLabel, pendingLabel: view.pendingLabel })] })] }));
    if (surface === 'plain') {
        return (0, jsx_runtime_1.jsx)("div", { className: "transaction-form-shell", children: content });
    }
    return (0, jsx_runtime_1.jsx)("section", { className: "detail-card", children: content });
}
function TransactionField({ label, type = 'text', placeholder, required = false, ...props }) {
    return ((0, jsx_runtime_1.jsxs)("label", { className: "auth-field", children: [(0, jsx_runtime_1.jsx)("span", { children: label }), (0, jsx_runtime_1.jsx)("input", { type: type, placeholder: placeholder, required: required, className: "transaction-input", ...props })] }));
}
function TransactionTextarea({ label, name, placeholder }) {
    return ((0, jsx_runtime_1.jsxs)("label", { className: "auth-field", children: [(0, jsx_runtime_1.jsx)("span", { children: label }), (0, jsx_runtime_1.jsx)("textarea", { name: name, placeholder: placeholder, className: "transaction-textarea", rows: 4 })] }));
}
function SubmitButton({ label, pendingLabel }) {
    const { pending } = (0, react_dom_1.useFormStatus)();
    return ((0, jsx_runtime_1.jsx)("button", { type: "submit", className: "auth-submit", disabled: pending, children: pending ? pendingLabel : label }));
}
