"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoginPageContent = getLoginPageContent;
exports.getRegisterPageContent = getRegisterPageContent;
const navigation_1 = require("../../lib/auth/navigation");
function getLoginPageContent(options) {
    const { reason, returnTo, notice, referralCode } = options;
    return {
        brandLabel: 'Likes Uai',
        title: 'Entre na sua conta.',
        eyebrow: 'Acesso',
        description: 'Use seu email e senha para entrar.',
        notice,
        returnTo,
        panelTitle: 'Acesso',
        panelCopy: 'Entre para seguir para a area correspondente ao seu perfil.',
        panelItems: [
            'clientes acessam saldo, pagamentos e pedidos',
            'admins acessam o painel operacional',
            'erros de acesso aparecem nesta tela',
        ],
        footnote: 'Se voce ja tem cadastro, entre com as credenciais da sua conta.',
        fields: [
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'voce@likesuai.com',
                autoComplete: 'email',
                inputMode: 'email',
                description: 'Informe o email da sua conta.',
            },
            {
                name: 'password',
                label: 'Senha',
                type: 'password',
                placeholder: 'Sua senha',
                autoComplete: 'current-password',
                description: 'Informe a senha da sua conta.',
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
    return {
        brandLabel: 'Likes Uai',
        title: 'Crie sua conta.',
        eyebrow: 'Cadastro',
        description: 'Preencha seus dados para comecar.',
        notice,
        returnTo,
        panelTitle: 'Cadastro',
        panelCopy: 'Depois do cadastro, sua conta ja fica pronta para uso.',
        panelItems: [
            'acesso a saldo, pagamentos e pedidos',
            'entrada imediata na area do cliente',
            'mensagens de erro exibidas na propria tela',
        ],
        footnote: 'Este cadastro cria conta de cliente.',
        fields: [
            {
                name: 'name',
                label: 'Nome',
                type: 'text',
                placeholder: 'Seu nome completo',
                autoComplete: 'name',
                description: 'Este nome sera exibido na sua conta.',
            },
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'voce@exemplo.com',
                autoComplete: 'email',
                inputMode: 'email',
                description: 'Sera usado para entrar na sua conta.',
            },
            {
                name: 'phone',
                label: 'Telefone',
                type: 'tel',
                placeholder: '(11) 99999-9999',
                autoComplete: 'tel',
                inputMode: 'tel',
                description: 'Informe um telefone valido.',
            },
            {
                name: 'password',
                label: 'Senha',
                type: 'password',
                placeholder: 'Crie uma senha',
                autoComplete: 'new-password',
                description: 'Crie uma senha para acessar sua conta.',
            },
            {
                name: 'referralCode',
                label: 'Codigo de indicacao',
                type: 'text',
                placeholder: 'Opcional',
                autoComplete: 'off',
                description: 'Se voce recebeu um codigo, confirme aqui para vincular a indicacao.',
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
