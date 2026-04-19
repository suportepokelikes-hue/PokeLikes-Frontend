import { AreaSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function AdminLoading() {
  return (
    <AreaSurfaceLoading
      area="admin"
      eyebrow="Admin / carregando"
      title="Carregando operacao administrativa."
      description="Consultando dados da area admin."
      metrics={3}
      details={1}
    />
  );
}
