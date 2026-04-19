import { AreaSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function AdminSupplierLoading() {
  return (
    <AreaSurfaceLoading
      area="admin"
      eyebrow="Admin / fornecedores"
      title="Carregando fornecedores."
      description="Buscando providers, logs e servicos sincronizados."
      metrics={3}
      details={3}
    />
  );
}
