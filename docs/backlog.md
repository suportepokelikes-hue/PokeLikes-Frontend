# Frontend Backlog

## Current State

O repositorio agora possui foundation funcional do frontend com App Router, shells iniciais e bootstrap de sessao.

Ja existe:

- `AGENTS.md`
- `docs/`
- contrato local do backend em `docs/contracts/backend-openapi.yaml`
- layout base do app
- middleware de protecao para `/app` e `/admin`
- camada inicial de API/auth em `src/lib/api` e `src/lib/auth`
- shells separados para area publica, cliente e admin

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

- listagem publica
- detalhe do servico
- estados de availability

## Phase 3: Wallet and PIX

Tasks:

- saldo
- extrato
- criar PIX
- acompanhar status do PIX

## Phase 4: Orders

Tasks:

- checkout
- meus pedidos
- detalhe do pedido

## Phase 5: Admin

Tasks:

- dashboard
- users
- catalog
- payments
- orders
- supplier
- alerts
- audits
- transactions

## Next Recommended Step

Na proxima sessao do Codex:

- encaixar o design final das telas de auth e shells quando ele estiver pronto
- iniciar catalogo publico em `/catalog` sobre a camada de sessao ja implementada
- expandir o cliente com wallet e o admin com dashboard inicial
