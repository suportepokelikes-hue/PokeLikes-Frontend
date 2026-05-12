'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  createCustomerSupportTicket,
  createCustomerSupportTicketMessage,
} from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath, normalizeReturnTo } from '@/lib/auth/navigation';

export type SupportFormState = {
  status: 'idle' | 'error';
  message?: string;
};

export const initialSupportFormState: SupportFormState = {
  status: 'idle',
};

export async function createSupportTicketAction(
  _: SupportFormState,
  formData: FormData,
): Promise<SupportFormState> {
  const session = await getServerSession();
  const returnTo = normalizeReturnTo(readFormString(formData, 'returnTo')) ?? '/app/support';

  if (session.status !== 'authenticated' || session.user.role !== 'customer') {
    redirect(getLoginPath({ reason: 'required', returnTo }));
  }

  const subject = readFormString(formData, 'subject');
  const message = readFormString(formData, 'message');

  const validationError = validateTicketPayload(subject, message);

  if (validationError) {
    return validationError;
  }

  try {
    const ticket = await createCustomerSupportTicket(
      { accessToken: session.accessToken },
      { subject, message },
    );

    revalidatePath('/app/support');
    redirect(`/app/support/${encodeURIComponent(ticket.id)}`);
  } catch (error) {
    return mapSupportFormError(error, 'Nao foi possivel abrir o ticket agora.');
  }
}

export async function createSupportTicketMessageAction(
  _: SupportFormState,
  formData: FormData,
): Promise<SupportFormState> {
  const session = await getServerSession();
  const ticketId = readFormString(formData, 'ticketId');
  const returnTo = normalizeReturnTo(readFormString(formData, 'returnTo')) ?? '/app/support';

  if (session.status !== 'authenticated' || session.user.role !== 'customer') {
    redirect(getLoginPath({ reason: 'required', returnTo }));
  }

  if (!ticketId) {
    return {
      status: 'error',
      message: 'Nao foi possivel identificar este ticket.',
    };
  }

  const message = readFormString(formData, 'message');
  const validationError = validateMessagePayload(message);

  if (validationError) {
    return validationError;
  }

  try {
    await createCustomerSupportTicketMessage(
      { accessToken: session.accessToken },
      ticketId,
      { message },
    );

    revalidatePath(returnTo);
    redirect(returnTo);
  } catch (error) {
    return mapSupportFormError(error, 'Nao foi possivel enviar a mensagem agora.');
  }
}

function validateTicketPayload(subject: string, message: string): SupportFormState | null {
  if (!subject) {
    return {
      status: 'error',
      message: 'Informe o assunto do ticket.',
    };
  }

  if (subject.length > 160) {
    return {
      status: 'error',
      message: 'Use um assunto com ate 160 caracteres.',
    };
  }

  return validateMessagePayload(message);
}

function validateMessagePayload(message: string): SupportFormState | null {
  if (!message) {
    return {
      status: 'error',
      message: 'Descreva o problema antes de enviar.',
    };
  }

  if (message.length > 5000) {
    return {
      status: 'error',
      message: 'A mensagem deve ter ate 5000 caracteres.',
    };
  }

  return null;
}

function mapSupportFormError(error: unknown, fallbackMessage: string): SupportFormState {
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

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}
