'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  reconcileAdminPayment,
  reconcileAdminPayments,
  refreshSupplierProviders,
  resolveAdminAlert,
  syncAdminOrder,
  syncAdminOrders,
  syncSupplierServices,
} from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import { getServerSession } from '@/lib/auth/cookies';

export type AdminActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

export async function resolveAlertAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireAuthenticatedAdmin();
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

export async function refreshSupplierProvidersAction(_: AdminActionState): Promise<AdminActionState> {
  const session = await requireAuthenticatedAdmin();

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
  const session = await requireAuthenticatedAdmin();
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
  const session = await requireAuthenticatedAdmin();
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
  const session = await requireAuthenticatedAdmin();
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
  const session = await requireAuthenticatedAdmin();
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
  const session = await requireAuthenticatedAdmin();
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

async function requireAuthenticatedAdmin() {
  const session = await getServerSession();

  if (session.status !== 'authenticated') {
    redirect('/login');
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
