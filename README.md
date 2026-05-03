# Likes Uai Frontend

Frontend web da plataforma Likes Uai, consumindo a API V1 existente do backend.

## Estado atual

Este repositorio nao esta mais em fase de bootstrap. O frontend ja possui superficies funcionais para:

- area publica com landing, login, cadastro, verify-email e catalogo publico
- area autenticada do cliente com dashboard, perfil, wallet, pagamentos PIX, pedidos e afiliados
- area administrativa com dashboard e modulos operacionais de usuarios, catalogo, pagamentos, pedidos, fornecedores, alertas, auditoria, transacoes e afiliados

## Stack e direcao

- Next.js App Router
- TypeScript estrito
- modulos por dominio em `src/modules`
- camada compartilhada de API em `src/lib/api`
- sessao em cookies HTTP-only com guards server-side e refresh no middleware

## Fonte de verdade

Para comportamento REST do frontend, a precedencia e:

1. codigo atual
2. `docs/contracts/backend-openapi.yaml`
3. `docs/api/openapi.yaml` apenas quando estiver consistente com o contrato validado acima

`docs/contracts/backend-openapi.yaml` continua sendo a fonte contratual operacional do frontend.

## Documentacao principal

- `docs/README.md`: visao geral confiavel do estado atual
- `docs/architecture.md`: arquitetura, jornadas e limites reais
- `docs/screen-map.md`: mapa de rotas e comportamento por superficie
- `docs/handoff.md`: resumo operacional para a proxima sessao do Codex
- `docs/backlog.md`: log vivo de execucao e proximo passo recomendado

## Limitacoes relevantes hoje

- edicao de perfil do cliente ja existe via `PATCH /me`, mas troca de email ainda nao e entregue
- o drawer de perfil do cliente nao oferece fluxo explicito para limpar telefone; campo vazio hoje nao remove valor existente
- detalhes de pagamento e pedido do cliente vivem dentro das listas via drawer; as rotas filhas apenas redirecionam
- no payout admin de afiliados, IDs de comissao seguem indo para `note`; o contrato validado atual nao expoe `commissionIds` dedicados
- o `affiliateCode` capturado por `?aff=` fica persistido no navegador ate ser substituido por outro codigo valido; ainda nao existe politica automatica de expiracao/limpeza

## Verificacao local

- `npm run typecheck`
- `npm run build`
- `npm run test`
- `npm run test:e2e`

## Ambiente publico

- `NEXT_PUBLIC_API_BASE_URL`: base URL da API backend V1. Default local: `http://localhost:3001/v1`
- `NEXT_PUBLIC_APP_NAME`: nome exibido no frontend. Default: `Pokelike`
- `NEXT_PUBLIC_APP_URL`: URL publica do frontend. Default local: `http://localhost:3000`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: client ID do Google Identity Services usado por `Continuar com Google` em `/login` e `/register`
