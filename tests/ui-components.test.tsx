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

  assert.match(html, /Nada por aqui/);
  assert.match(html, /A consulta nao retornou itens\./);
  assert.match(html, /href="\/catalog"/);
  assert.match(html, /Voltar ao catalogo/);
  assert.doesNotMatch(html, /Estado vazio/);
});

test('ErrorState renders error shell and CTA only when provided', () => {
  const html = renderToStaticMarkup(
    <ErrorState title="Falha" description="Nao foi possivel carregar." actionHref="/app" actionLabel="Tentar de novo" />,
  );

  assert.match(html, /Falha/);
  assert.match(html, /href="\/app"/);
  assert.doesNotMatch(html, /Erro de integracao/);
  assert.doesNotMatch(html, /Estado de erro/);

  const withoutAction = renderToStaticMarkup(<ErrorState title="Falha" description="Sem acao." />);
  assert.doesNotMatch(withoutAction, /feedback-actions/);
});

test('StatusBadge and PageHeader expose the expected semantic content', () => {
  const badgeHtml = renderToStaticMarkup(<StatusBadge label="active" tone="success" />);
  assert.match(badgeHtml, /status-badge status-success/);
  assert.match(badgeHtml, />active</);

  const headerHtml = renderToStaticMarkup(
    <PageHeader title="Cabecalho" />,
  );

  assert.match(headerHtml, /<h1>Cabecalho<\/h1>/);
  assert.doesNotMatch(headerHtml, /section-copy/);
  assert.doesNotMatch(headerHtml, /eyebrow/);

  const fullHeaderHtml = renderToStaticMarkup(
    <PageHeader
      eyebrow="Admin / testes"
      title="Cabecalho"
      description="Descricao do cabecalho."
      actions={<a href="/admin">Voltar</a>}
    />,
  );

  assert.match(fullHeaderHtml, /Admin \/ testes/);
  assert.match(fullHeaderHtml, /Descricao do cabecalho\./);
  assert.match(fullHeaderHtml, /section-header-description/);
  assert.match(fullHeaderHtml, /href="\/admin"/);
});
