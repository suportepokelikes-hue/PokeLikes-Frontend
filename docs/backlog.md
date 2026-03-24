# Frontend Backlog

## Current State

O repositório foi bootstrapado e ainda não possui implementação funcional das telas.

Já existe:

- `AGENTS.md`
- `docs/`
- stack base planejada
- contrato local do backend em `docs/contracts/backend-openapi.yaml`
- casca inicial do app Next.js

## Recommended Execution Order

1. foundation do app
2. API client e sessão
3. auth screens
4. catálogo público
5. wallet e PIX
6. checkout e pedidos do cliente
7. dashboard admin
8. telas operacionais admin

## Phase 0: Frontend Foundation

Goal:

- preparar shell do app, layout raiz, tema base, ambiente e camada de integração

Tasks:

- definir layout base
- definir tokens visuais iniciais
- criar API client
- criar camada de sessão/auth
- preparar roteamento das áreas pública, cliente e admin

## Phase 1: Auth

Tasks:

- login
- registro
- refresh/session bootstrap
- guardas de rota

## Phase 2: Public Catalog

Tasks:

- listagem pública
- detalhe do serviço
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

Na próxima sessão do Codex:

- implementar a foundation do app
- montar layout raiz, sessão e client base da API
