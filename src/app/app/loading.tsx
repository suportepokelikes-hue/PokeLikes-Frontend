import { AreaSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function CustomerLoading() {
  return (
    <AreaSurfaceLoading
      area="customer"
      eyebrow="Cliente / carregando"
      title="Carregando area do cliente."
      description="Buscando saldo, pagamentos e pedidos."
      metrics={3}
      details={1}
    />
  );
}
