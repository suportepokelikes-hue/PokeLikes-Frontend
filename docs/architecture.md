# Frontend Architecture

## Purpose

Consolidar a arquitetura inicial do frontend da plataforma Instabarato.

## Stack Direction

- Next.js com App Router
- TypeScript estrito
- organizacao por dominio em `src/modules`
- utilitarios compartilhados em `src/lib`

## High-Level Areas

### Public

- landing inicial
- login
- registro
- catalogo publico

### Customer

- perfil/sessao
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

- o frontend consome a API do backend por uma camada unica em `src/lib/api`
- contratos usados no bootstrap nascem do `docs/contracts/backend-openapi.yaml`
- evitar `fetch` espalhado em componentes de tela
- auth/session seguem separados da camada de dominio

## Implemented Foundation

- layout raiz com base visual compartilhada e shells iniciais para `/`, `/app` e `/admin`
- `src/lib/api/http.ts` centraliza base URL, headers e tratamento basico de erro
- `src/lib/api/auth.ts` expoe os endpoints de auth e perfil inicial usados no bootstrap
- sessao armazenada em cookies HTTP-only com `accessToken`, `refreshToken` e `user`
- `src/middleware.ts` protege rotas autenticadas, tenta refresh quando houver `refreshToken` e redireciona conforme `role`
- guards server-side em `src/lib/auth/guards.ts` reforcam separacao entre cliente e admin dentro do App Router
- `/login` e `/register` usam server actions para autenticar, persistir cookies e redirecionar conforme `role`
- um design system interno em codigo foi introduzido em `src/components/ui` usando o padrao dominante do Stitch
- o catalogo publico agora existe em `/catalog` e `/catalog/[serviceId]` usando os endpoints reais do dominio de catalogo
- `/app`, `/app/wallet`, `/app/payments` e `/app/orders` consomem endpoints reais do cliente
- `/admin`, `/admin/users`, `/admin/payments` e `/admin/orders` consomem endpoints reais do admin

## Implemented Structure

```text
src/
  app/
    app/
    admin/
    catalog/
  lib/
    api/
      admin.ts
      auth.ts
      catalog.ts
      contracts.ts
      customer.ts
      http.ts
    auth/
      cookies.ts
      guards.ts
      session.ts
    config/
  modules/
    app-shell/
    admin-shell/
    catalog/
    customer-dashboard/
  middleware.ts
```

## Implemented Route To Endpoint Mapping

- `/catalog` -> `GET /catalog/services`
- `/catalog/[serviceId]` -> `GET /catalog/services/{serviceId}`
- `/app` -> `GET /me/wallet`, `GET /me/payments`, `GET /me/orders`
- `/app/wallet` -> `GET /me/wallet`, `GET /me/wallet/transactions`
- `/app/payments` -> `GET /me/payments`
- `/app/orders` -> `GET /me/orders`
- `/admin` -> `GET /admin/dashboard/summary`
- `/admin/users` -> `GET /admin/users`
- `/admin/payments` -> `GET /admin/payments`
- `/admin/orders` -> `GET /admin/orders`

## Operational UX Direction

- status de sessao, disponibilidade e estados assincronos continuam sendo parte central da UX
- a area do cliente deve priorizar clareza de fluxo para wallet, PIX e pedidos
- a area admin deve priorizar densidade informacional e observabilidade operacional

## Remaining Direction

- a proxima etapa deve refinar UX de auth com o design final e cobrir estados operacionais do backend
- as proximas telas devem reutilizar o design system interno e os mesmos padroes de shell, tabela, toolbar e badges
- telas de negocio devem continuar usando `src/lib/api` como fronteira com o backend
