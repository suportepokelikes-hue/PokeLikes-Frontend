import { AreaSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function AdminSupportLoading() {
  return (
    <AreaSurfaceLoading
      area="admin"
      eyebrow="Tickets"
      title="Carregando tickets."
      description="Buscando fila de suporte e conversas."
      metrics={3}
      details={2}
    />
  );
}
