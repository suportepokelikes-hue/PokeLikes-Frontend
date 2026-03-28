'use server';

import { redirect } from 'next/navigation';

import { createCustomerOrder, createPixPayment } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath, normalizeReturnTo } from '@/lib/auth/navigation';
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

  const amount = readRequiredString(formData, 'amount');

  if (!amount) {
    return {
      status: 'error',
      message: 'Informe o valor para gerar a cobranca PIX.',
    };
  }

  let paymentId: string;

  try {
    const payment = await createPixPayment({ accessToken: session.accessToken }, { amount });
    paymentId = payment.id;
  } catch (error) {
    return mapFormError(error, 'Nao foi possivel criar a cobranca PIX agora.');
  }

  redirect(`/app/payments/${paymentId}`);
}

export async function createOrderAction(_: TransactionFormState, formData: FormData): Promise<TransactionFormState> {
  const session = await getServerSession();
  const returnTo = normalizeReturnTo(readRequiredString(formData, 'returnTo'));

  if (session.status !== 'authenticated' || session.user.role !== 'customer') {
    redirect(getLoginPath({ reason: 'required', returnTo }));
  }

  const catalogServiceIdRaw = readRequiredString(formData, 'catalogServiceId');
  const catalogServiceId = Number.parseInt(catalogServiceIdRaw, 10);
  const link = readRequiredString(formData, 'link');
  const quantity = Number.parseInt(readRequiredString(formData, 'quantity'), 10);
  const runs = readOptionalInt(formData, 'runs');
  const interval = readOptionalInt(formData, 'interval');
  const comments = readOptionalStringArray(formData, 'comments');
  const answerNumberRaw = readRequiredString(formData, 'answerNumber');

  if (Number.isNaN(catalogServiceId)) {
    return {
      status: 'error',
      message:
        'O contrato atual de criacao de pedido exige catalogServiceId numerico. Este servico nao pode ser convertido de forma segura.',
    };
  }

  if (!link || Number.isNaN(quantity)) {
    return {
      status: 'error',
      message: 'Informe link e quantidade validos para criar o pedido.',
    };
  }

  let orderId: string;

  try {
    const order = await createCustomerOrder(
      { accessToken: session.accessToken },
      {
        catalogServiceId,
        link,
        quantity,
        ...(runs !== undefined ? { runs } : {}),
        ...(interval !== undefined ? { interval } : {}),
        ...(comments.length > 0 ? { comments } : {}),
        ...(answerNumberRaw ? { answerNumber: answerNumberRaw } : {}),
      },
    );
    orderId = order.id;
  } catch (error) {
    return mapFormError(error, 'Nao foi possivel criar o pedido agora.');
  }

  redirect(`/app/orders/${orderId}`);
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

function readOptionalStringArray(formData: FormData, key: string) {
  const value = readRequiredString(formData, key);

  if (!value) {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapFormError(error: unknown, fallbackMessage: string): TransactionFormState {
  if (error instanceof ApiClientError) {
    return {
      status: 'error',
      message: error.message || fallbackMessage,
    };
  }

  return {
    status: 'error',
    message: fallbackMessage,
  };
}
