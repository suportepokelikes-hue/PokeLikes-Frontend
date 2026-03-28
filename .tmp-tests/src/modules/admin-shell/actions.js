'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserAction = createUserAction;
exports.updateUserAction = updateUserAction;
exports.createCatalogServiceAction = createCatalogServiceAction;
exports.updateCatalogServiceAction = updateCatalogServiceAction;
exports.createWalletAdjustmentAction = createWalletAdjustmentAction;
exports.resolveAlertAction = resolveAlertAction;
exports.refreshSupplierProvidersAction = refreshSupplierProvidersAction;
exports.syncSupplierServicesAction = syncSupplierServicesAction;
exports.reconcilePaymentsAction = reconcilePaymentsAction;
exports.reconcilePaymentAction = reconcilePaymentAction;
exports.syncOrdersAction = syncOrdersAction;
exports.syncOrderAction = syncOrderAction;
const cache_1 = require("next/cache");
const navigation_1 = require("next/navigation");
const admin_1 = require("@/lib/api/admin");
const cookies_1 = require("@/lib/auth/cookies");
const navigation_2 = require("@/lib/auth/navigation");
const action_helpers_1 = require("@/modules/admin-shell/action-helpers");
async function createUserAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const name = (0, action_helpers_1.readRequiredString)(formData, 'name');
    const email = (0, action_helpers_1.readRequiredString)(formData, 'email');
    const password = (0, action_helpers_1.readRequiredString)(formData, 'password');
    const phone = (0, action_helpers_1.readRequiredString)(formData, 'phone');
    const role = (0, action_helpers_1.readRole)(formData);
    const status = (0, action_helpers_1.readStatus)(formData);
    if (!name || !email || !password) {
        return {
            status: 'error',
            message: 'Nome, email e senha sao obrigatorios para criar o usuario.',
        };
    }
    try {
        await (0, admin_1.createAdminUser)(session.accessToken, {
            name,
            email,
            password,
            ...(phone ? { phone } : {}),
            ...(role ? { role } : {}),
            ...(status ? { status } : {}),
        });
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel criar o usuario agora.');
    }
    (0, cache_1.revalidatePath)('/admin');
    (0, cache_1.revalidatePath)('/admin/users');
    return {
        status: 'success',
        message: 'Usuario criado com sucesso.',
    };
}
async function updateUserAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const userId = (0, action_helpers_1.readRequiredString)(formData, 'userId');
    const name = (0, action_helpers_1.readRequiredString)(formData, 'name');
    const password = (0, action_helpers_1.readRequiredString)(formData, 'password');
    const role = (0, action_helpers_1.readRole)(formData);
    const status = (0, action_helpers_1.readStatus)(formData);
    const clearPhone = (0, action_helpers_1.readRequiredString)(formData, 'clearPhone') === 'true';
    const phone = clearPhone ? '' : (0, action_helpers_1.readRequiredString)(formData, 'phone');
    if (!userId) {
        return {
            status: 'error',
            message: 'Informe um usuario valido para atualizar.',
        };
    }
    const payload = {
        ...(name ? { name } : {}),
        ...(password ? { password } : {}),
        ...(clearPhone ? { phone: null } : phone ? { phone } : {}),
        ...(role ? { role } : {}),
        ...(status ? { status } : {}),
    };
    if (Object.keys(payload).length === 0) {
        return {
            status: 'error',
            message: 'Informe ao menos um campo antes de salvar a atualizacao.',
        };
    }
    try {
        await (0, admin_1.updateAdminUser)(session.accessToken, userId, payload);
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel atualizar o usuario agora.');
    }
    (0, cache_1.revalidatePath)('/admin');
    (0, cache_1.revalidatePath)('/admin/users');
    return {
        status: 'success',
        message: 'Usuario atualizado com sucesso.',
    };
}
async function createCatalogServiceAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const payload = (0, action_helpers_1.parseCatalogCreatePayload)(formData);
    if ('error' in payload) {
        return payload.error;
    }
    try {
        await (0, admin_1.createAdminCatalogService)(session.accessToken, payload.value);
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel criar o servico de catalogo agora.');
    }
    (0, cache_1.revalidatePath)('/admin');
    (0, cache_1.revalidatePath)('/admin/catalog');
    return {
        status: 'success',
        message: 'Servico de catalogo criado com sucesso.',
    };
}
async function updateCatalogServiceAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const serviceId = (0, action_helpers_1.readRequiredString)(formData, 'serviceId');
    if (!serviceId) {
        return {
            status: 'error',
            message: 'Informe um servico valido para atualizar.',
        };
    }
    const payload = (0, action_helpers_1.parseCatalogUpdatePayload)(formData);
    if ('error' in payload) {
        return payload.error;
    }
    if (Object.keys(payload.value).length === 0) {
        return {
            status: 'error',
            message: 'Informe ao menos um campo valido antes de salvar a atualizacao.',
        };
    }
    try {
        await (0, admin_1.updateAdminCatalogService)(session.accessToken, serviceId, payload.value);
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel atualizar o servico de catalogo agora.');
    }
    (0, cache_1.revalidatePath)('/admin');
    (0, cache_1.revalidatePath)('/admin/catalog');
    return {
        status: 'success',
        message: 'Servico de catalogo atualizado com sucesso.',
    };
}
async function createWalletAdjustmentAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const userId = (0, action_helpers_1.readRequiredString)(formData, 'userId');
    const amount = (0, action_helpers_1.readRequiredString)(formData, 'amount');
    const direction = (0, action_helpers_1.readWalletDirection)(formData);
    const type = (0, action_helpers_1.readWalletAdjustmentType)(formData);
    const reason = (0, action_helpers_1.readOptionalString)(formData, 'reason');
    if (!userId || !amount || !direction) {
        return {
            status: 'error',
            message: 'User ID, valor e direcao sao obrigatorios para ajustar a carteira.',
        };
    }
    try {
        const result = await (0, admin_1.createAdminWalletAdjustment)(session.accessToken, userId, {
            amount,
            direction,
            ...(type ? { type } : {}),
            ...(reason ? { reason } : {}),
        });
        (0, cache_1.revalidatePath)('/admin');
        (0, cache_1.revalidatePath)('/admin/transactions');
        (0, cache_1.revalidatePath)('/admin/users');
        return {
            status: 'success',
            message: `Ajuste aplicado. Novo saldo disponivel: ${result.wallet.availableBalance.amount} ${result.wallet.availableBalance.currency}.`,
        };
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel aplicar o ajuste de carteira agora.');
    }
}
async function resolveAlertAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const alertId = (0, action_helpers_1.readRequiredString)(formData, 'alertId');
    if (!alertId) {
        return {
            status: 'error',
            message: 'Informe um alerta valido para resolver.',
        };
    }
    try {
        await (0, admin_1.resolveAdminAlert)(session.accessToken, alertId);
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel resolver o alerta agora.');
    }
    (0, cache_1.revalidatePath)('/admin');
    (0, cache_1.revalidatePath)('/admin/alerts');
    return {
        status: 'success',
        message: 'Alerta resolvido com sucesso.',
    };
}
async function refreshSupplierProvidersAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    try {
        await (0, admin_1.refreshSupplierProviders)(session.accessToken);
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel atualizar os providers agora.');
    }
    (0, cache_1.revalidatePath)('/admin');
    (0, cache_1.revalidatePath)('/admin/supplier');
    return {
        status: 'success',
        message: 'Status dos fornecedores atualizado.',
    };
}
async function syncSupplierServicesAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const supplierName = (0, action_helpers_1.readRequiredString)(formData, 'supplierName');
    try {
        await (0, admin_1.syncSupplierServices)(session.accessToken, supplierName || undefined);
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel iniciar a sincronizacao de servicos agora.');
    }
    (0, cache_1.revalidatePath)('/admin/supplier');
    return {
        status: 'success',
        message: supplierName ? `Sincronizacao iniciada para ${supplierName}.` : 'Sincronizacao global de servicos iniciada.',
    };
}
async function reconcilePaymentsAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const limit = (0, action_helpers_1.readOptionalInt)(formData, 'limit');
    try {
        const result = await (0, admin_1.reconcileAdminPayments)(session.accessToken, limit ? { limit } : undefined);
        (0, cache_1.revalidatePath)('/admin');
        (0, cache_1.revalidatePath)('/admin/payments');
        return {
            status: 'success',
            message: `Conciliacao em lote concluida: ${result.reconciled} reconciliados, ${result.unchanged} sem mudanca e ${result.errors} com erro.`,
        };
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel executar a conciliacao em lote agora.');
    }
}
async function reconcilePaymentAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const paymentId = (0, action_helpers_1.readRequiredString)(formData, 'paymentId');
    if (!paymentId) {
        return {
            status: 'error',
            message: 'Informe um pagamento valido para conciliar.',
        };
    }
    try {
        const result = await (0, admin_1.reconcileAdminPayment)(session.accessToken, paymentId);
        (0, cache_1.revalidatePath)('/admin');
        (0, cache_1.revalidatePath)('/admin/payments');
        return {
            status: 'success',
            message: result.reconciled ? `Pagamento ${result.paymentId} reconciliado.` : `Pagamento ${result.paymentId} sem alteracoes.`,
        };
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel conciliar o pagamento agora.');
    }
}
async function syncOrdersAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const limit = (0, action_helpers_1.readOptionalInt)(formData, 'limit');
    try {
        const result = await (0, admin_1.syncAdminOrders)(session.accessToken, limit ? { limit } : undefined);
        (0, cache_1.revalidatePath)('/admin');
        (0, cache_1.revalidatePath)('/admin/orders');
        return {
            status: 'success',
            message: `Sync em lote concluido: ${result.synced} sincronizados, ${result.skipped} ignorados de ${result.found} encontrados.`,
        };
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel executar o sync de pedidos agora.');
    }
}
async function syncOrderAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const orderId = (0, action_helpers_1.readRequiredString)(formData, 'orderId');
    if (!orderId) {
        return {
            status: 'error',
            message: 'Informe um pedido valido para sincronizar.',
        };
    }
    try {
        const result = await (0, admin_1.syncAdminOrder)(session.accessToken, orderId);
        (0, cache_1.revalidatePath)('/admin');
        (0, cache_1.revalidatePath)('/admin/orders');
        return {
            status: 'success',
            message: `Sync do pedido concluido: ${result.synced} sincronizado(s), ${result.skipped} ignorado(s).`,
        };
    }
    catch (error) {
        return (0, action_helpers_1.mapAdminActionError)(error, 'Nao foi possivel sincronizar o pedido agora.');
    }
}
async function requireAuthenticatedAdmin(formData) {
    const session = await (0, cookies_1.getServerSession)();
    const returnTo = (0, navigation_2.normalizeReturnTo)((0, action_helpers_1.readRequiredString)(formData, 'returnTo'));
    if (session.status !== 'authenticated') {
        (0, navigation_1.redirect)((0, navigation_2.getLoginPath)({ reason: 'required', returnTo }));
    }
    if (session.user.role !== 'admin') {
        (0, navigation_1.redirect)('/app');
    }
    return session;
}
