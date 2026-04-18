'use server';

import { redirect } from 'next/navigation';

import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath } from '@/lib/auth/navigation';
import {
  createCustomerProfileEditBlockedState,
  parseCustomerProfileEditDraft,
  type CustomerProfileEditState,
} from './customer-profile-edit';

export async function updateCustomerProfileAction(
  _: CustomerProfileEditState,
  formData: FormData,
): Promise<CustomerProfileEditState> {
  const session = await getServerSession();

  if (session.status !== 'authenticated' || session.user.role !== 'customer') {
    redirect(getLoginPath({ reason: 'required', returnTo: '/app/profile?edit=1' }));
  }

  const parsed = parseCustomerProfileEditDraft(formData);

  if ('error' in parsed) {
    return parsed.error;
  }

  return createCustomerProfileEditBlockedState(parsed.value);
}
