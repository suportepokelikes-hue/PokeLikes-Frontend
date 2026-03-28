import test from 'node:test';
import assert from 'node:assert/strict';

import { renderToStaticMarkup } from 'react-dom/server';

import { EmptyState } from '../src/components/ui/empty-state';
import { ErrorState } from '../src/components/ui/error-state';
import { PageHeader } from '../src/components/ui/page-header';
import { StatusBadge } from '../src/components/ui/status-badge';

test('EmptyState renders feedback copy and optional CTA', () => {
  const html = renderToStaticMarkup(
    <EmptyState
      title="Nada por aqui"
      description="A consulta nao retornou itens."
      actionHref="/catalog"
      actionLabel="Voltar ao catalogo"
    />,
  );

  assert.match(html, /Sem resultados/);
  assert.match(html, /Nada por aqui/);
  assert.match(html, /A consulta nao retornou itens\./);
  assert.match(html, /href="\/catalog"/);
  assert.match(html, /Voltar ao catalogo/);
});

test('ErrorState renders error shell and CTA only when provided', () => {
  const html = renderToStaticMarkup(
    <ErrorState title="Falha" description="Nao foi possivel carregar." actionHref="/app" actionLabel="Tentar de novo" />,
  );

  assert.match(html, /Erro de integracao/);
  assert.match(html, /Estado de erro/);
  assert.match(html, /href="\/app"/);

  const withoutAction = renderToStaticMarkup(<ErrorState title="Falha" description="Sem acao." />);
  assert.doesNotMatch(withoutAction, /feedback-actions/);
});

test('StatusBadge and PageHeader expose the expected semantic content', () => {
  const badgeHtml = renderToStaticMarkup(<StatusBadge label="active" tone="success" />);
  assert.match(badgeHtml, /status-badge status-success/);
  assert.match(badgeHtml, />active</);

  const headerHtml = renderToStaticMarkup(
    <PageHeader
      eyebrow="Admin / testes"
      title="Cabecalho"
      description="Descricao do cabecalho."
      actions={<a href="/admin">Voltar</a>}
    />,
  );

  assert.match(headerHtml, /Admin \/ testes/);
  assert.match(headerHtml, /<h1>Cabecalho<\/h1>/);
  assert.match(headerHtml, /Descricao do cabecalho\./);
  assert.match(headerHtml, /href="\/admin"/);
});
