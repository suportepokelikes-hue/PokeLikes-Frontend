import { PublicSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function CatalogDetailLoading() {
  return (
    <PublicSurfaceLoading
      eyebrow="Catalogo / servico"
      title="Carregando servico."
      description="Preparando os detalhes e a disponibilidade."
      variant="detail"
    />
  );
}
