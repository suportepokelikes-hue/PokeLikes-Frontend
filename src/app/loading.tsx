import { PublicSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function PublicHomeLoading() {
  return (
    <PublicSurfaceLoading
      eyebrow="Inicio"
      title="Carregando vitrine."
      description="Preparando a experiencia publica."
      variant="detail"
    />
  );
}
