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
const http_1 = require("@/lib/api/http");
const cookies_1 = require("@/lib/auth/cookies");
const navigation_2 = require("@/lib/auth/navigation");
async function createUserAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const name = readRequiredString(formData, 'name');
    const email = readRequiredString(formData, 'email');
    const password = readRequiredString(formData, 'password');
    const phone = readRequiredString(formData, 'phone');
    const role = readRole(formData);
    const status = readStatus(formData);
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
        return mapAdminActionError(error, 'Nao foi possivel criar o usuario agora.');
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
    const userId = readRequiredString(formData, 'userId');
    const name = readRequiredString(formData, 'name');
    const password = readRequiredString(formData, 'password');
    const role = readRole(formData);
    const status = readStatus(formData);
    const clearPhone = readRequiredString(formData, 'clearPhone') === 'true';
    const phone = clearPhone ? '' : readRequiredString(formData, 'phone');
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
        return mapAdminActionError(error, 'Nao foi possivel atualizar o usuario agora.');
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
    const payload = parseCatalogCreatePayload(formData);
    if ('error' in payload) {
        return payload.error;
    }
    try {
        await (0, admin_1.createAdminCatalogService)(session.accessToken, payload.value);
    }
    catch (error) {
        return mapAdminActionError(error, 'Nao foi possivel criar o servico de catalogo agora.');
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
    const serviceId = readRequiredString(formData, 'serviceId');
    if (!serviceId) {
        return {
            status: 'error',
            message: 'Informe um servico valido para atualizar.',
        };
    }
    const payload = parseCatalogUpdatePayload(formData);
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
        return mapAdminActionError(error, 'Nao foi possivel atualizar o servico de catalogo agora.');
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
    const userId = readRequiredString(formData, 'userId');
    const amount = readRequiredString(formData, 'amount');
    const direction = readWalletDirection(formData);
    const type = readWalletAdjustmentType(formData);
    const reason = readOptionalString(formData, 'reason');
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
        return mapAdminActionError(error, 'Nao foi possivel aplicar o ajuste de carteira agora.');
    }
}
async function resolveAlertAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const alertId = readRequiredString(formData, 'alertId');
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
        return mapAdminActionError(error, 'Nao foi possivel resolver o alerta agora.');
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
        return mapAdminActionError(error, 'Nao foi possivel atualizar os providers agora.');
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
    const supplierName = readRequiredString(formData, 'supplierName');
    try {
        await (0, admin_1.syncSupplierServices)(session.accessToken, supplierName || undefined);
    }
    catch (error) {
        return mapAdminActionError(error, 'Nao foi possivel iniciar a sincronizacao de servicos agora.');
    }
    (0, cache_1.revalidatePath)('/admin/supplier');
    return {
        status: 'success',
        message: supplierName ? `Sincronizacao iniciada para ${supplierName}.` : 'Sincronizacao global de servicos iniciada.',
    };
}
async function reconcilePaymentsAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const limit = readOptionalInt(formData, 'limit');
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
        return mapAdminActionError(error, 'Nao foi possivel executar a conciliacao em lote agora.');
    }
}
async function reconcilePaymentAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const paymentId = readRequiredString(formData, 'paymentId');
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
        return mapAdminActionError(error, 'Nao foi possivel conciliar o pagamento agora.');
    }
}
async function syncOrdersAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const limit = readOptionalInt(formData, 'limit');
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
        return mapAdminActionError(error, 'Nao foi possivel executar o sync de pedidos agora.');
    }
}
async function syncOrderAction(_, formData) {
    const session = await requireAuthenticatedAdmin(formData);
    const orderId = readRequiredString(formData, 'orderId');
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
        return mapAdminActionError(error, 'Nao foi possivel sincronizar o pedido agora.');
    }
}
async function requireAuthenticatedAdmin(formData) {
    const session = await (0, cookies_1.getServerSession)();
    const returnTo = (0, navigation_2.normalizeReturnTo)(readRequiredString(formData, 'returnTo'));
    if (session.status !== 'authenticated') {
        (0, navigation_1.redirect)((0, navigation_2.getLoginPath)({ reason: 'required', returnTo }));
    }
    if (session.user.role !== 'admin') {
        (0, navigation_1.redirect)('/app');
    }
    return session;
}
function readRequiredString(formData, key) {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}
function readOptionalInt(formData, key) {
    const value = readRequiredString(formData, key);
    if (!value) {
        return undefined;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
}
function readOptionalString(formData, key) {
    return readRequiredString(formData, key) || undefined;
}
function readRole(formData) {
    const value = readRequiredString(formData, 'role');
    return value === 'customer' || value === 'admin' ? value : undefined;
}
function readStatus(formData) {
    const value = readRequiredString(formData, 'status');
    return value === 'active' || value === 'disabled' ? value : undefined;
}
function readCatalogStatus(formData) {
    const value = readRequiredString(formData, 'status');
    return value === 'active' || value === 'inactive' ? value : undefined;
}
function readWalletDirection(formData) {
    const value = readRequiredString(formData, 'direction');
    return value === 'credit' || value === 'debit' ? value : undefined;
}
function readWalletAdjustmentType(formData) {
    const value = readRequiredString(formData, 'type');
    return value === 'wallet_adjustment_admin' || value === 'wallet_reversal_admin' ? value : undefined;
}
function parseCatalogCreatePayload(formData) {
    const base = parseCatalogFields(formData, true);
    if ('error' in base) {
        return base;
    }
    const { value } = base;
    return {
        value: {
            name: value.name,
            publicPrice: value.publicPrice,
            socialNetwork: value.socialNetwork,
            category: value.category,
            type: value.type,
            minQuantity: value.minQuantity,
            maxQuantity: value.maxQuantity,
            supplierServiceId: value.supplierServiceId,
            ...(value.description !== undefined ? { description: value.description } : {}),
            ...(value.status !== undefined ? { status: value.status } : {}),
            ...(value.sortOrder !== undefined ? { sortOrder: value.sortOrder } : {}),
            ...(value.supplierName !== undefined ? { supplierName: value.supplierName } : {}),
            ...(value.metadata !== undefined ? { metadata: value.metadata } : {}),
        },
    };
}
function parseCatalogUpdatePayload(formData) {
    const base = parseCatalogFields(formData, false);
    if ('error' in base) {
        return base;
    }
    return { value: base.value };
}
function parseCatalogFields(formData, requireMandatory) {
    const name = readOptionalString(formData, 'name');
    const publicPrice = readOptionalString(formData, 'publicPrice');
    const socialNetwork = readOptionalString(formData, 'socialNetwork');
    const category = readOptionalString(formData, 'category');
    const type = readOptionalString(formData, 'type');
    const supplierName = readOptionalString(formData, 'supplierName');
    const description = readOptionalString(formData, 'description');
    const clearDescription = readRequiredString(formData, 'clearDescription') === 'true';
    const clearMetadata = readRequiredString(formData, 'clearMetadata') === 'true';
    const status = readCatalogStatus(formData);
    const sortOrder = readOptionalInt(formData, 'sortOrder');
    const minQuantity = readOptionalInt(formData, 'minQuantity');
    const maxQuantity = readOptionalInt(formData, 'maxQuantity');
    const supplierServiceId = readOptionalInt(formData, 'supplierServiceId');
    const metadataInput = readRequiredString(formData, 'metadata');
    if (requireMandatory && (!name || !publicPrice || !socialNetwork || !category || !type || minQuantity === undefined || maxQuantity === undefined || supplierServiceId === undefined)) {
        return {
            error: {
                status: 'error',
                message: 'Nome, preco, rede, categoria, tipo, faixa e supplier service id sao obrigatorios na criacao.',
            },
        };
    }
    if ((minQuantity !== undefined && minQuantity < 1) || (maxQuantity !== undefined && maxQuantity < 1)) {
        return {
            error: {
                status: 'error',
                message: 'As quantidades minima e maxima devem ser inteiros positivos.',
            },
        };
    }
    if (minQuantity !== undefined && maxQuantity !== undefined && maxQuantity < minQuantity) {
        return {
            error: {
                status: 'error',
                message: 'A quantidade maxima nao pode ser menor que a minima.',
            },
        };
    }
    if (supplierServiceId !== undefined && supplierServiceId < 1) {
        return {
            error: {
                status: 'error',
                message: 'Informe um supplier service id valido.',
            },
        };
    }
    const metadata = parseOptionalJson(metadataInput);
    if (metadata.error) {
        return {
            error: {
                status: 'error',
                message: 'Metadata precisa ser um JSON valido quando preenchido.',
            },
        };
    }
    const value = {
        ...(name ? { name } : {}),
        ...(publicPrice ? { publicPrice } : {}),
        ...(status ? { status } : {}),
        ...(sortOrder !== undefined ? { sortOrder } : {}),
        ...(socialNetwork ? { socialNetwork } : {}),
        ...(category ? { category } : {}),
        ...(type ? { type } : {}),
        ...(minQuantity !== undefined ? { minQuantity } : {}),
        ...(maxQuantity !== undefined ? { maxQuantity } : {}),
        ...(supplierName ? { supplierName } : {}),
        ...(supplierServiceId !== undefined ? { supplierServiceId } : {}),
        ...(clearDescription ? { description: null } : description ? { description } : {}),
        ...(clearMetadata ? { metadata: null } : metadata.value !== undefined ? { metadata: metadata.value } : {}),
    };
    return { value };
}
function parseOptionalJson(value) {
    if (!value) {
        return {};
    }
    try {
        return { value: JSON.parse(value) };
    }
    catch {
        return { error: true };
    }
}
function mapAdminActionError(error, fallback) {
    if (error instanceof http_1.ApiClientError) {
        return {
            status: 'error',
            message: error.message || fallback,
        };
    }
    return {
        status: 'error',
        message: fallback,
    };
}
