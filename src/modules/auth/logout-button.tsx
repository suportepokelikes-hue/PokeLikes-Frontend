'use client';

import { useFormStatus } from 'react-dom';

import { getLogoutButtonView } from './logout-button-content';
import { logoutAction } from '@/modules/auth/actions';

type LogoutButtonProps = {
  label?: string;
};

export function LogoutButton({ label = 'Sair' }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <LogoutSubmitButton label={label} />
    </form>
  );
}

function LogoutSubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  const view = getLogoutButtonView(label, pending);

  return (
    <button type="submit" className="logout-button" disabled={view.disabled}>
      {view.visibleLabel}
    </button>
  );
}
