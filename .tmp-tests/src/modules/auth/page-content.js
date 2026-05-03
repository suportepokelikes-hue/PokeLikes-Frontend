"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoginPageContent = getLoginPageContent;
exports.getRegisterPageContent = getRegisterPageContent;
const navigation_1 = require("../../lib/auth/navigation");
const env_1 = require("../../lib/config/env");
function getLoginPageContent(options) {
    const { reason, returnTo, notice, referralCode } = options;
    const { appName } = (0, env_1.getPublicEnv)();
    return {
        mode: 'login',
        brandLabel: appName,
        title: 'Entrar',
        eyebrow: 'Acesso',
        description: 'Entre para continuar.',
        notice,
        returnTo,
        referralCode,
        panelTitle: '',
        panelCopy: '',
        panelItems: [],
        footnote: '',
        fields: [
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'voce@exemplo.com',
                autoComplete: 'email',
                inputMode: 'email',
            },
            {
                name: 'password',
                label: 'Senha',
                type: 'password',
                placeholder: 'Sua senha',
                autoComplete: 'current-password',
            },
        ],
        submitLabel: 'Entrar',
        pendingLabel: 'Validando acesso...',
        alternateHref: (0, navigation_1.getRegisterPath)({ reason, returnTo, referralCode }),
        alternateLabel: 'Criar conta',
        alternatePrompt: 'Ainda nao tem cadastro?',
    };
}
function getRegisterPageContent(options) {
    const { reason, returnTo, notice, referralCode } = options;
    const { appName } = (0, env_1.getPublicEnv)();
    return {
        mode: 'register',
        brandLabel: appName,
        title: 'Criar conta',
        eyebrow: 'Cadastro',
        description: 'Crie sua conta.',
        notice,
        returnTo,
        referralCode,
        panelTitle: '',
        panelCopy: '',
        panelItems: [],
        footnote: '',
        fields: [
            {
                name: 'name',
                label: 'Nome',
                type: 'text',
                placeholder: 'Seu nome completo',
                autoComplete: 'name',
            },
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'voce@exemplo.com',
                autoComplete: 'email',
                inputMode: 'email',
            },
            {
                name: 'phone',
                label: 'Telefone',
                type: 'tel',
                placeholder: '(11) 99999-9999',
                autoComplete: 'tel',
                inputMode: 'tel',
            },
            {
                name: 'password',
                label: 'Senha',
                type: 'password',
                placeholder: 'Crie uma senha',
                autoComplete: 'new-password',
            },
            {
                name: 'referralCode',
                label: 'Codigo de indicacao',
                type: 'text',
                placeholder: 'Opcional',
                autoComplete: 'off',
                defaultValue: referralCode ?? undefined,
                required: false,
            },
        ],
        submitLabel: 'Criar conta',
        pendingLabel: 'Criando conta...',
        alternateHref: (0, navigation_1.getLoginPath)({ reason, returnTo, referralCode }),
        alternateLabel: 'Entrar',
        alternatePrompt: 'Ja possui acesso?',
    };
}
