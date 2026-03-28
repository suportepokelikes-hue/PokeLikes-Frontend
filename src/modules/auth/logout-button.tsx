'use client';

import { useFormStatus } from 'react-dom';

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

  return (
    <button type="submit" className="logout-button" disabled={pending}>
      {pending ? 'Saindo...' : label}
    </button>
  );
}
