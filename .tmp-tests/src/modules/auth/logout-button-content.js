"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogoutButtonView = getLogoutButtonView;
function getLogoutButtonView(label = 'Sair', pending = false) {
    return {
        label,
        disabled: pending,
        visibleLabel: pending ? 'Saindo...' : label,
    };
}
