'use server';

import { redirect } from 'next/navigation';

import { createCustomerOrder, createPixPayment } from '@/lib/api/customer';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath, normalizeReturnTo } from '@/lib/auth/navigation';
import {
  mapTransactionFormError,
  parseCreateOrderPayload,
  parseCreatePixPayload,
  readRequiredString,
} from '@/modules/customer-transactions/action-helpers';
import type { TransactionFormState } from '@/modules/customer-transactions/types';

export async function createPixPaymentAction(
  _: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const session = await getServerSession();
  const returnTo = normalizeReturnTo(readRequiredString(formData, 'returnTo'));

  if (session.status !== 'authenticated' || session.user.role !== 'customer') {
    redirect(getLoginPath({ reason: 'required', returnTo }));
  }

  const payload = parseCreatePixPayload(formData);

  if ('error' in payload) {
    return payload.error;
  }

  let paymentId: string;

  try {
    const payment = await createPixPayment({ accessToken: session.accessToken }, payload.value);
    paymentId = payment.id;
  } catch (error) {
    return mapTransactionFormError(error, 'Nao foi possivel criar a cobranca PIX agora.');
  }

  redirect(`/app/payments?paymentId=${encodeURIComponent(paymentId)}`);
}

export async function createOrderAction(_: TransactionFormState, formData: FormData): Promise<TransactionFormState> {
  const session = await getServerSession();
  const returnTo = normalizeReturnTo(readRequiredString(formData, 'returnTo'));

  if (session.status !== 'authenticated' || session.user.role !== 'customer') {
    redirect(getLoginPath({ reason: 'required', returnTo }));
  }

  const payload = parseCreateOrderPayload(formData);

  if ('error' in payload) {
    return payload.error;
  }

  let orderId: string;

  try {
    const order = await createCustomerOrder({ accessToken: session.accessToken }, payload.value);
    orderId = order.id;
  } catch (error) {
    return mapTransactionFormError(error, 'Nao foi possivel criar o pedido agora.');
  }

  redirect(`/app/orders/${orderId}`);
}
