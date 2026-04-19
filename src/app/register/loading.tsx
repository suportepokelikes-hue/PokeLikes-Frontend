import { PublicSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function RegisterLoading() {
  return (
    <PublicSurfaceLoading
      eyebrow="Criar conta"
      title="Carregando cadastro."
      description="Preparando a entrada na plataforma."
      variant="auth"
    />
  );
}
