"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionLabel = getSessionLabel;
function getSessionLabel(session) {
    if (session.status === 'guest') {
        return 'Sessao nao autenticada';
    }
    return `${session.user.name} / ${session.user.role} / ${session.user.status}`;
}
