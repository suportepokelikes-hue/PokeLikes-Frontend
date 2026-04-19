import { AreaSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function CustomerOrdersLoading() {
  return (
    <AreaSurfaceLoading
      area="customer"
      eyebrow="Pedidos"
      title="Carregando pedidos."
      description="Buscando status, fila e historico."
      metrics={3}
      details={2}
    />
  );
}
