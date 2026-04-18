"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionFormView = getTransactionFormView;
function getTransactionFormView(content, state) {
    return {
        title: content.title,
        description: content.description,
        children: content.children,
        hiddenReturnTo: content.returnTo ?? null,
        feedback: state.status === 'idle'
            ? null
            : {
                tone: state.status,
                message: state.message ?? 'Nao foi possivel concluir a operacao.',
                actionHref: state.actionHref ?? null,
                actionLabel: state.actionLabel ?? null,
            },
        submitLabel: content.submitLabel,
        pendingLabel: 'Processando...',
    };
}
