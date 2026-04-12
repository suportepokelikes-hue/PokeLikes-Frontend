"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminActionFormView = getAdminActionFormView;
function getAdminActionFormView(content, state) {
    return {
        submitLabel: content.submitLabel,
        pendingLabel: content.pendingLabel ?? 'Processando...',
        tone: content.tone ?? 'secondary',
        children: content.children,
        hiddenReturnTo: content.returnTo ?? null,
        hiddenFields: content.hiddenFields ?? [],
        message: state.status !== 'idle'
            ? {
                status: state.status,
                text: state.message,
            }
            : null,
    };
}
