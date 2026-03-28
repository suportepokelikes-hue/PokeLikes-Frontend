'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  createAdminCatalogService,
  createAdminWalletAdjustment,
  createAdminUser,
  reconcileAdminPayment,
  reconcileAdminPayments,
  refreshSupplierProviders,
  resolveAdminAlert,
  syncAdminOrder,
  syncAdminOrders,
  syncSupplierServices,
  updateAdminCatalogService,
  updateAdminUser,
} from '@/lib/api/admin';
import type {
  AdminCatalogServiceUpdateRequest,
  AdminCatalogServiceUpsertRequest,
  AdminUpdateUserRequest,
  CatalogServiceStatus,
  UserRole,
  UserStatus,
} from '@/lib/api/contracts';
import { ApiClientError } from '@/lib/api/http';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath, normalizeReturnTo } from '@/lib/auth/navigation';

export type AdminActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

export async function createUserAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
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
    await createAdminUser(session.accessToken, {
      name,
      email,
      password,
      ...(phone ? { phone } : {}),
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
    });
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel criar o usuario agora.');
  }

  revalidatePath('/admin');
  revalidatePath('/admin/users');

  return {
    status: 'success',
    message: 'Usuario criado com sucesso.',
  };
}

export async function updateUserAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
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

  const payload: AdminUpdateUserRequest = {
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
    await updateAdminUser(session.accessToken, userId, payload);
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel atualizar o usuario agora.');
  }

  revalidatePath('/admin');
  revalidatePath('/admin/users');

  return {
    status: 'success',
    message: 'Usuario atualizado com sucesso.',
  };
}

export async function createCatalogServiceAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireAuthenticatedAdmin(formData);
  const payload = parseCatalogCreatePayload(formData);

  if ('error' in payload) {
    return payload.error;
  }

  try {
    await createAdminCatalogService(session.accessToken, payload.value);
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel criar o servico de catalogo agora.');
  }

  revalidatePath('/admin');
  revalidatePath('/admin/catalog');

  return {
    status: 'success',
    message: 'Servico de catalogo criado com sucesso.',
  };
}

export async function updateCatalogServiceAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
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
    await updateAdminCatalogService(session.accessToken, serviceId, payload.value);
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel atualizar o servico de catalogo agora.');
  }

  revalidatePath('/admin');
  revalidatePath('/admin/catalog');

  return {
    status: 'success',
    message: 'Servico de catalogo atualizado com sucesso.',
  };
}

export async function createWalletAdjustmentAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
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
    const result = await createAdminWalletAdjustment(session.accessToken, userId, {
      amount,
      direction,
      ...(type ? { type } : {}),
      ...(reason ? { reason } : {}),
    });

    revalidatePath('/admin');
    revalidatePath('/admin/transactions');
    revalidatePath('/admin/users');

    return {
      status: 'success',
      message: `Ajuste aplicado. Novo saldo disponivel: ${result.wallet.availableBalance.amount} ${result.wallet.availableBalance.currency}.`,
    };
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel aplicar o ajuste de carteira agora.');
  }
}

export async function resolveAlertAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireAuthenticatedAdmin(formData);
  const alertId = readRequiredString(formData, 'alertId');

  if (!alertId) {
    return {
      status: 'error',
      message: 'Informe um alerta valido para resolver.',
    };
  }

  try {
    await resolveAdminAlert(session.accessToken, alertId);
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel resolver o alerta agora.');
  }

  revalidatePath('/admin');
  revalidatePath('/admin/alerts');

  return {
    status: 'success',
    message: 'Alerta resolvido com sucesso.',
  };
}

export async function refreshSupplierProvidersAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireAuthenticatedAdmin(formData);

  try {
    await refreshSupplierProviders(session.accessToken);
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel atualizar os providers agora.');
  }

  revalidatePath('/admin');
  revalidatePath('/admin/supplier');

  return {
    status: 'success',
    message: 'Status dos fornecedores atualizado.',
  };
}

export async function syncSupplierServicesAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireAuthenticatedAdmin(formData);
  const supplierName = readRequiredString(formData, 'supplierName');

  try {
    await syncSupplierServices(session.accessToken, supplierName || undefined);
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel iniciar a sincronizacao de servicos agora.');
  }

  revalidatePath('/admin/supplier');

  return {
    status: 'success',
    message: supplierName ? `Sincronizacao iniciada para ${supplierName}.` : 'Sincronizacao global de servicos iniciada.',
  };
}

export async function reconcilePaymentsAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireAuthenticatedAdmin(formData);
  const limit = readOptionalInt(formData, 'limit');

  try {
    const result = await reconcileAdminPayments(session.accessToken, limit ? { limit } : undefined);

    revalidatePath('/admin');
    revalidatePath('/admin/payments');

    return {
      status: 'success',
      message: `Conciliacao em lote concluida: ${result.reconciled} reconciliados, ${result.unchanged} sem mudanca e ${result.errors} com erro.`,
    };
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel executar a conciliacao em lote agora.');
  }
}

export async function reconcilePaymentAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireAuthenticatedAdmin(formData);
  const paymentId = readRequiredString(formData, 'paymentId');

  if (!paymentId) {
    return {
      status: 'error',
      message: 'Informe um pagamento valido para conciliar.',
    };
  }

  try {
    const result = await reconcileAdminPayment(session.accessToken, paymentId);

    revalidatePath('/admin');
    revalidatePath('/admin/payments');

    return {
      status: 'success',
      message: result.reconciled ? `Pagamento ${result.paymentId} reconciliado.` : `Pagamento ${result.paymentId} sem alteracoes.`,
    };
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel conciliar o pagamento agora.');
  }
}

export async function syncOrdersAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireAuthenticatedAdmin(formData);
  const limit = readOptionalInt(formData, 'limit');

  try {
    const result = await syncAdminOrders(session.accessToken, limit ? { limit } : undefined);

    revalidatePath('/admin');
    revalidatePath('/admin/orders');

    return {
      status: 'success',
      message: `Sync em lote concluido: ${result.synced} sincronizados, ${result.skipped} ignorados de ${result.found} encontrados.`,
    };
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel executar o sync de pedidos agora.');
  }
}

export async function syncOrderAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireAuthenticatedAdmin(formData);
  const orderId = readRequiredString(formData, 'orderId');

  if (!orderId) {
    return {
      status: 'error',
      message: 'Informe um pedido valido para sincronizar.',
    };
  }

  try {
    const result = await syncAdminOrder(session.accessToken, orderId);

    revalidatePath('/admin');
    revalidatePath('/admin/orders');

    return {
      status: 'success',
      message: `Sync do pedido concluido: ${result.synced} sincronizado(s), ${result.skipped} ignorado(s).`,
    };
  } catch (error) {
    return mapAdminActionError(error, 'Nao foi possivel sincronizar o pedido agora.');
  }
}

async function requireAuthenticatedAdmin(formData: FormData) {
  const session = await getServerSession();
  const returnTo = normalizeReturnTo(readRequiredString(formData, 'returnTo'));

  if (session.status !== 'authenticated') {
    redirect(getLoginPath({ reason: 'required', returnTo }));
  }

  if (session.user.role !== 'admin') {
    redirect('/app');
  }

  return session;
}

function readRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

function readOptionalInt(formData: FormData, key: string) {
  const value = readRequiredString(formData, key);

  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) ? undefined : parsed;
}

function readOptionalString(formData: FormData, key: string) {
  return readRequiredString(formData, key) || undefined;
}

function readRole(formData: FormData): UserRole | undefined {
  const value = readRequiredString(formData, 'role');
  return value === 'customer' || value === 'admin' ? value : undefined;
}

function readStatus(formData: FormData): UserStatus | undefined {
  const value = readRequiredString(formData, 'status');
  return value === 'active' || value === 'disabled' ? value : undefined;
}

function readCatalogStatus(formData: FormData): CatalogServiceStatus | undefined {
  const value = readRequiredString(formData, 'status');
  return value === 'active' || value === 'inactive' ? value : undefined;
}

function readWalletDirection(formData: FormData): 'credit' | 'debit' | undefined {
  const value = readRequiredString(formData, 'direction');
  return value === 'credit' || value === 'debit' ? value : undefined;
}

function readWalletAdjustmentType(formData: FormData): 'wallet_adjustment_admin' | 'wallet_reversal_admin' | undefined {
  const value = readRequiredString(formData, 'type');
  return value === 'wallet_adjustment_admin' || value === 'wallet_reversal_admin' ? value : undefined;
}

function parseCatalogCreatePayload(formData: FormData):
  | { value: AdminCatalogServiceUpsertRequest }
  | { error: AdminActionState } {
  const base = parseCatalogFields(formData, true);

  if ('error' in base) {
    return base;
  }

  const { value } = base;

  return {
    value: {
      name: value.name as string,
      publicPrice: value.publicPrice as string,
      socialNetwork: value.socialNetwork as string,
      category: value.category as string,
      type: value.type as string,
      minQuantity: value.minQuantity as number,
      maxQuantity: value.maxQuantity as number,
      supplierServiceId: value.supplierServiceId as number,
      ...(value.description !== undefined ? { description: value.description } : {}),
      ...(value.status !== undefined ? { status: value.status } : {}),
      ...(value.sortOrder !== undefined ? { sortOrder: value.sortOrder } : {}),
      ...(value.supplierName !== undefined ? { supplierName: value.supplierName } : {}),
      ...(value.metadata !== undefined ? { metadata: value.metadata } : {}),
    },
  };
}

function parseCatalogUpdatePayload(formData: FormData):
  | { value: AdminCatalogServiceUpdateRequest }
  | { error: AdminActionState } {
  const base = parseCatalogFields(formData, false);

  if ('error' in base) {
    return base;
  }

  return { value: base.value };
}

function parseCatalogFields(
  formData: FormData,
  requireMandatory: boolean,
): { value: AdminCatalogServiceUpdateRequest } | { error: AdminActionState } {
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
        status: 'error' as const,
        message: 'Nome, preco, rede, categoria, tipo, faixa e supplier service id sao obrigatorios na criacao.',
      },
    };
  }

  if ((minQuantity !== undefined && minQuantity < 1) || (maxQuantity !== undefined && maxQuantity < 1)) {
    return {
      error: {
        status: 'error' as const,
        message: 'As quantidades minima e maxima devem ser inteiros positivos.',
      },
    };
  }

  if (minQuantity !== undefined && maxQuantity !== undefined && maxQuantity < minQuantity) {
    return {
      error: {
        status: 'error' as const,
        message: 'A quantidade maxima nao pode ser menor que a minima.',
      },
    };
  }

  if (supplierServiceId !== undefined && supplierServiceId < 1) {
    return {
      error: {
        status: 'error' as const,
        message: 'Informe um supplier service id valido.',
      },
    };
  }

  const metadata = parseOptionalJson(metadataInput);

  if (metadata.error) {
    return {
      error: {
        status: 'error' as const,
        message: 'Metadata precisa ser um JSON valido quando preenchido.',
      },
    };
  }

  const value: AdminCatalogServiceUpdateRequest = {
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

function parseOptionalJson(value: string): { value?: unknown; error?: true } {
  if (!value) {
    return {};
  }

  try {
    return { value: JSON.parse(value) };
  } catch {
    return { error: true };
  }
}

function mapAdminActionError(error: unknown, fallback: string): AdminActionState {
  if (error instanceof ApiClientError) {
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
