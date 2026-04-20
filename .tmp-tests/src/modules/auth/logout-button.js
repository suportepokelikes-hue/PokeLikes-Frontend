'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutButton = LogoutButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_dom_1 = require("react-dom");
const logout_button_content_1 = require("./logout-button-content");
const actions_1 = require("@/modules/auth/actions");
function LogoutButton({ label = 'Sair' }) {
    return ((0, jsx_runtime_1.jsx)("form", { action: actions_1.logoutAction, children: (0, jsx_runtime_1.jsx)(LogoutSubmitButton, { label: label }) }));
}
function LogoutSubmitButton({ label }) {
    const { pending } = (0, react_dom_1.useFormStatus)();
    const view = (0, logout_button_content_1.getLogoutButtonView)(label, pending);
    return ((0, jsx_runtime_1.jsx)("button", { type: "submit", className: "logout-button", disabled: view.disabled, children: view.visibleLabel }));
}
