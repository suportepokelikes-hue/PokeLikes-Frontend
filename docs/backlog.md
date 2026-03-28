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
- [ ] refinar tratamento visual de erro, loading e feedback de auth com o design final
- [ ] adicionar estados de logout expirado e retorno para rota de origem

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
- [ ] aprofundar filtros, paginacao navegavel e detalhes drill-down nas listas administrativas

## Next Recommended Step

Na proxima sessao do Codex:

- encaixar o design final das telas de auth e shells quando ele estiver pronto
- expandir detalhes drill-down admin para pagamento e pedido usando os endpoints individuais existentes
- aprofundar filtros e paginacao navegavel das listas administrativas
- expandir o cliente para editar perfil e criar fluxos mais completos de order/payment com refinamento visual final
- refinar visualmente as telas ja conectadas ao backend com os exports finais do Stitch
