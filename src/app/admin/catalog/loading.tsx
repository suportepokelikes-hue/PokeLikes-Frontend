import { AreaSurfaceLoading } from '@/components/ui/loading-surfaces';

export default function AdminCatalogLoading() {
  return (
    <AreaSurfaceLoading
      area="admin"
      eyebrow="Admin / catalogo"
      title="Carregando catalogo."
      description="Buscando sincronizados, publicados e afiliacao."
      metrics={4}
      details={2}
    />
  );
}
