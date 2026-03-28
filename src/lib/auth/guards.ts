import { redirect } from 'next/navigation';

import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath, getPostAuthRedirectPath, normalizeReturnTo } from '@/lib/auth/navigation';

export async function requireCustomerSession(returnTo?: string) {
  const session = await getServerSession();

  if (session.status !== 'authenticated') {
    redirect(getLoginPath({ reason: 'required', returnTo: normalizeReturnTo(returnTo) }));
  }

  if (session.user.role !== 'customer') {
    redirect('/admin');
  }

  return session;
}

export async function requireAdminSession(returnTo?: string) {
  const session = await getServerSession();

  if (session.status !== 'authenticated') {
    redirect(getLoginPath({ reason: 'required', returnTo: normalizeReturnTo(returnTo) }));
  }

  if (session.user.role !== 'admin') {
    redirect('/app');
  }

  return session;
}

export async function redirectAuthenticatedUser(returnTo?: string) {
  const session = await getServerSession();

  if (session.status !== 'authenticated') {
    return;
  }

  redirect(getPostAuthRedirectPath(session.user.role, returnTo));
}
