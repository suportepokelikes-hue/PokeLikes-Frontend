import { AreaSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function CustomerSupportLoading() {
  return (
    <AreaSurfaceLoading
      area="customer"
      eyebrow="Suporte"
      title="Carregando suporte."
      description="Buscando tickets e conversas."
      metrics={2}
      details={2}
    />
  );
}
