"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionFormView = getTransactionFormView;
function getTransactionFormView(content, state) {
    return {
        title: content.title,
        description: content.description,
        children: content.children,
        hiddenReturnTo: content.returnTo ?? null,
        error: state.status === 'error'
            ? state.message ?? 'Nao foi possivel concluir a operacao.'
            : null,
        submitLabel: content.submitLabel,
        pendingLabel: 'Processando...',
    };
}
