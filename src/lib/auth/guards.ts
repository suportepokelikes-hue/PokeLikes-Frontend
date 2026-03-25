import { redirect } from 'next/navigation';

import { getServerSession } from '@/lib/auth/cookies';

export async function requireCustomerSession() {
  const session = await getServerSession();

  if (session.status !== 'authenticated') {
    redirect('/login');
  }

  if (session.user.role !== 'customer') {
    redirect('/admin');
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getServerSession();

  if (session.status !== 'authenticated') {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/app');
  }

  return session;
}

export async function redirectAuthenticatedUser() {
  const session = await getServerSession();

  if (session.status !== 'authenticated') {
    return;
  }

  redirect(session.user.role === 'admin' ? '/admin' : '/app');
}
