import { AreaSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function CustomerPaymentsLoading() {
  return (
    <AreaSurfaceLoading
      area="customer"
      eyebrow="Pagamentos"
      title="Carregando pagamentos."
      description="Buscando PIX, pendencias e historico."
      metrics={3}
      details={2}
    />
  );
}
