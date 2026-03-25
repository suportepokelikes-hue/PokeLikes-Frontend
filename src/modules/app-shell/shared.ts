import type { SessionState } from '@/lib/auth/session';

export type ShellMetric = {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning';
};

export type ShellLink = {
  href: string;
  label: string;
  description: string;
};

export function getSessionLabel(session: SessionState): string {
  if (session.status === 'guest') {
    return 'Sessao nao autenticada';
  }

  return `${session.user.name} / ${session.user.role} / ${session.user.status}`;
}
