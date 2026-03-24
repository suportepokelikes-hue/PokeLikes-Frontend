# Frontend Architecture

## Purpose

Consolidar a arquitetura inicial do frontend da plataforma Instabarato.

## Stack Direction

- Next.js com App Router
- TypeScript estrito
- organização por domínio em `src/modules`
- utilitários compartilhados em `src/lib`

## High-Level Areas

### Public

- landing inicial
- login
- registro
- catálogo público

### Customer

- perfil/sessão
- wallet
- criar PIX
- listar pagamentos
- meus pedidos
- detalhe do pedido

### Admin

- dashboard
- users
- catalog
- payments
- orders
- supplier
- alerts
- audits
- transactions

## API Consumption Direction

- o frontend deve consumir a API do backend por uma camada única em `src/lib/api`
- contratos devem nascer do `docs/contracts/backend-openapi.yaml`
- evitar fetch espalhado em componentes de tela
- modelar auth/session separadamente da camada de domínio

## Initial Folder Direction

```text
src/
  app/
  components/
  lib/
    api/
    auth/
    config/
  modules/
    auth/
    catalog/
    wallet/
    payments/
    orders/
    admin/
```

## Operational UX Direction

- status de pagamento e pedido devem ser visíveis e legíveis
- indisponibilidade de provider não deve ser mascarada
- telas admin devem tratar observabilidade como recurso principal, não secundário

## Current Decision

- este bootstrap prepara o repo para uma próxima sessão focada em implementação
- a próxima sessão deve começar pelo shell do app, sessão/auth e client base da API
