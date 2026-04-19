import { PublicSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function LoginLoading() {
  return (
    <PublicSurfaceLoading
      eyebrow="Entrar"
      title="Carregando acesso."
      description="Preparando a entrada da conta."
      variant="auth"
    />
  );
}
