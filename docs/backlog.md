# Frontend Backlog

## Current State

O repositorio agora possui foundation funcional, auth operacional, design system interno e primeiras areas reais conectadas a API.

Ja existe:

- `AGENTS.md`
- `docs/`
- contrato local do backend em `docs/contracts/backend-openapi.yaml`
- layout base do app
- middleware de protecao para `/app` e `/admin`
- camada inicial de API/auth em `src/lib/api` e `src/lib/auth`
- shells separados para area publica, cliente e admin
- design system reutilizavel em `src/components/ui`
- catalogo publico real
- dashboards e listas iniciais reais para cliente e admin

## Recommended Execution Order

1. foundation do app
2. API client e sessao
3. auth screens
4. catalogo publico
5. wallet e PIX
6. checkout e pedidos do cliente
7. dashboard admin
8. telas operacionais admin

## Phase 0: Frontend Foundation

Goal:

- preparar shell do app, layout raiz, tema base, ambiente e camada de integracao

Tasks:

- [x] definir layout base
- [x] definir tokens visuais iniciais
- [x] criar API client
- [x] criar camada de sessao/auth
- [x] preparar roteamento das areas publica, cliente e admin
- [x] criar telas operacionais de login e registro
- [x] criar handlers de mutacao de sessao para UI

## Phase 1: Auth

Tasks:

- [x] login
- [x] registro
- [x] refresh/session bootstrap
- [x] guardas de rota
- [x] refinar tratamento visual de erro, loading e feedback de auth para teste manual pela UI
- [x] adicionar estados de logout expirado e retorno para rota de origem

## Phase 2: Public Catalog

Tasks:

- [x] listagem publica
- [x] detalhe do servico
- [x] estados de availability
- [ ] refinamento visual das telas publicas com base final do Stitch

## Phase 3: Wallet and PIX

Tasks:

- [x] saldo
- [x] extrato
- [x] criar PIX
- [x] acompanhar status do PIX na listagem existente
- [x] detalhe do pagamento PIX

## Phase 4: Orders

Tasks:

- [x] checkout
- [x] meus pedidos
- [x] detalhe do pedido

## Phase 5: Admin

Tasks:

- [x] dashboard
- [x] users
- [x] catalog
- [x] payments
- [x] orders
- [x] supplier
- [x] alerts
- [x] audits
- [x] transactions
- [x] adicionar mutacoes operacionais iniciais no admin para resolve de alertas e refresh/sync de fornecedores
- [x] expandir mutacoes operacionais reais no admin para conciliacao e sync de pedidos/pagamentos
- [x] abrir drill-down administrativo para detalhe de pagamento e pedido
- [x] aprofundar filtros e paginacao navegavel nas listas administrativas
- [x] habilitar criacao e edicao operacional de usuarios em `/admin/users`
- [x] habilitar criacao e edicao operacional de servicos em `/admin/catalog`
- [x] integrar ajuste manual de carteira em `/admin/transactions`
- [x] abrir detalhes dedicados para usuarios e catalogo no admin para reduzir densidade das listas

## Phase 6: Customer Profile

Tasks:

- [x] criar rota de perfil do cliente consumindo `GET /me`
- [ ] habilitar edicao de perfil quando o contrato local descrever o payload de `PATCH /me`

## Phase 7: Customer Visual Polish

Tasks:

- [x] refinar dashboard do cliente com hero operacional e atalhos de fluxo
- [x] refinar carteira, pagamentos, pedidos e perfil com cards de contexto e hierarquia mais forte
- [x] aprofundar polish dos detalhes de pedido e pagamento do cliente

## Phase 8: Public Visual Polish

Tasks:

- [x] refinar home publica com hero mais forte e cards de jornada
- [x] refinar catalogo publico com resumo de availability e toolbar expandida
- [x] refinar detalhe de servico com destaque de preco, disponibilidade e checkout

## Phase 9: Shared State Polish

Tasks:

- [x] refinar componentes compartilhados de empty/error
- [x] adicionar loading segmentado para a area do cliente

## Phase 10: Frontend Test Baseline

Tasks:

- [x] adicionar script `npm run test` sem dependencia extra
- [x] cobrir utilitarios criticos de auth/navigation
- [x] cobrir parsing de filtros e serializacao admin
- [x] cobrir sessao e camada HTTP base da API
- [x] cobrir helpers extraidos de server actions de auth e admin
- [x] cobrir camada customer API e helpers das mutacoes PIX/pedido

## Next Recommended Step

Na proxima sessao do Codex:

- integrar ajuste manual de carteira via `POST /admin/wallets/{userId}/adjustments`
- decidir se o ajuste manual de carteira permanece em `transactions` ou sobe para um detalhe dedicado de usuario
- expandir a cobertura de testes para fluxos autenticados ponta a ponta e componentes de UI mais criticos
- habilitar edicao de perfil do cliente quando o contrato local descrever o payload de `PATCH /me`
