import type { Metadata } from 'next';

import {
  getAuthNotice,
  normalizeReferralCode,
  normalizeReturnTo,
  type AuthRedirectReason,
} from '@/lib/auth/navigation';
import { redirectAuthenticatedUser } from '@/lib/auth/guards';
import { googleAuthAction, loginAction } from '@/modules/auth/actions';
import { AuthForm } from '@/modules/auth/auth-form';
import { getLoginPageContent } from '@/modules/auth/page-content';
import { initialAuthFormState } from '@/modules/auth/types';

export const metadata: Metadata = {
  title: 'Entrar | Pokelike',
  description: 'Acesso de cliente e admin na plataforma Pokelike.',
};

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const returnTo = normalizeReturnTo(readSearchParam(resolvedSearchParams.returnTo));
  const reason = readSearchParam(resolvedSearchParams.reason) as AuthRedirectReason | undefined;
  const referralCode = normalizeReferralCode(readSearchParam(resolvedSearchParams.ref));
  const content = getLoginPageContent({
    reason,
    returnTo,
    notice: getAuthNotice(resolvedSearchParams),
    referralCode,
  });

  await redirectAuthenticatedUser(returnTo ?? undefined);

  return (
    <AuthForm
      {...content}
      action={loginAction}
      googleAction={googleAuthAction}
      initialState={initialAuthFormState}
    />
  );
}

function readSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
