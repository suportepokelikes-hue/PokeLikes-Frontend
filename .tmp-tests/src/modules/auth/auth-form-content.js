"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthFormView = getAuthFormView;
function getAuthFormView(content, state) {
    return {
        notice: content.notice ?? null,
        hiddenReturnTo: content.returnTo ?? null,
        fields: content.fields,
        error: state.status === 'error'
            ? {
                title: 'Falha na autenticacao',
                message: state.message ?? 'Nao foi possivel concluir a autenticacao.',
            }
            : null,
        submitLabel: content.submitLabel,
        pendingLabel: content.pendingLabel,
        alternateHref: content.alternateHref,
        alternateLabel: content.alternateLabel,
        alternatePrompt: content.alternatePrompt,
        footnote: content.footnote,
    };
}
