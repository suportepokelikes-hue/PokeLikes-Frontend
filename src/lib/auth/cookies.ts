import { cookies } from 'next/headers';

import { readSession } from '@/lib/auth/session';

export async function getServerSession() {
  const cookieStore = await cookies();
  return readSession(cookieStore);
}
