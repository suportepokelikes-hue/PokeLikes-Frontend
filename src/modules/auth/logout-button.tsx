import { logoutAction } from '@/modules/auth/actions';

type LogoutButtonProps = {
  label?: string;
};

export function LogoutButton({ label = 'Sair' }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <button type="submit" className="logout-button">
        {label}
      </button>
    </form>
  );
}
