import type { Metadata } from 'next';

import {
  getAuthNotice,
  normalizeReferralCode,
  normalizeReturnTo,
  type AuthRedirectReason,
} from '@/lib/auth/navigation';
import { redirectAuthenticatedUser } from '@/lib/auth/guards';
import { googleAuthAction, registerAction } from '@/modules/auth/actions';
import { AuthForm } from '@/modules/auth/auth-form';
import { getRegisterPageContent } from '@/modules/auth/page-content';
import { initialAuthFormState } from '@/modules/auth/types';

export const metadata: Metadata = {
  title: 'Criar Conta | Pokelike',
  description: 'Cadastro de cliente na plataforma Pokelike.',
};

type RegisterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const returnTo = normalizeReturnTo(readSearchParam(resolvedSearchParams.returnTo));
  const reason = readSearchParam(resolvedSearchParams.reason) as AuthRedirectReason | undefined;
  const referralCode = normalizeReferralCode(readSearchParam(resolvedSearchParams.ref));
  const content = getRegisterPageContent({
    reason,
    returnTo,
    notice: getAuthNotice(resolvedSearchParams),
    referralCode,
  });

  await redirectAuthenticatedUser(returnTo ?? undefined);

  return (
    <AuthForm
      {...content}
      action={registerAction}
      googleAction={googleAuthAction}
      initialState={initialAuthFormState}
    />
  );
}

function readSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
