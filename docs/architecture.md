# Frontend Architecture

## Purpose

Consolidar a arquitetura inicial do frontend da plataforma Likes Uai.

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
- o formulario compartilhado de auth agora separa contexto operacional e superficie de entrada, explicita o que sera validado pelo backend e mostra feedback inline mais claro para teste manual de login e cadastro
- middleware, guards e server actions agora preservam `returnTo` para voltar a rota de origem apos autenticacao, e `/login` e `/register` exibem notices explicitos para acesso necessario, sessao expirada e logout concluido
- um design system interno em codigo foi introduzido em `src/components/ui` usando o padrao dominante do Stitch
- o catalogo publico agora existe em `/catalog` e `/catalog/[serviceId]` usando os endpoints reais do dominio de catalogo
- `/app`, `/app/wallet`, `/app/payments` e `/app/orders` consomem endpoints reais do cliente
- `/app/profile` agora consome `GET /me` para expor os dados atuais do cliente autenticado
- dashboard, carteira, pagamentos, pedidos e perfil do cliente agora compartilham um tratamento visual mais editorial, com hero operacional, atalhos de fluxo e cards de contexto inspirados no Stitch dominante
- os detalhes de pagamento e pedido do cliente agora seguem o mesmo padrao, com hero de status, resumo operacional e leitura mais clara dos dados assincronos do backend
- a home publica, o catalogo e o detalhe de servico agora seguem um tratamento visual mais forte, com bento cards, destaque de availability e CTA mais claro para a jornada publica
- os estados compartilhados de empty/error ficaram mais ricos visualmente e a area do cliente agora tambem possui `loading.tsx` segmentado
- `/app/payments` agora tambem cria cobranca PIX por `POST /me/payments/pix`
- `/catalog/[serviceId]` agora permite criar pedido por `POST /me/orders` quando o cliente estiver autenticado
- `/app/payments/[paymentId]` e `/app/orders/[orderId]` exibem detalhes reais do cliente
- `/admin`, `/admin/users`, `/admin/payments` e `/admin/orders` consomem endpoints reais do admin
- `/admin/catalog`, `/admin/supplier`, `/admin/alerts`, `/admin/audits` e `/admin/transactions` agora tambem consomem endpoints reais do admin
- `/admin/payments/[paymentId]` e `/admin/orders/[orderId]` agora usam os endpoints de detalhe do admin
- a navegacao da area admin passou a expor os modulos operacionais completos no shell compartilhado
- as novas telas admin adotam o padrao dominante do Stitch ja convertido no design system interno: page header editorial, cards de resumo, tabelas densas e estados explicitados de loading, empty e server error
- o admin agora possui mutacoes reais via server actions para resolver alertas, disparar refresh/sync de fornecedores, reconciliar pagamentos e sincronizar pedidos com revalidacao de rota e feedback inline
- as listas administrativas agora aceitam filtros e paginacao navegavel alinhados aos query params reais da OpenAPI, com serializacao centralizada para URL, camada API e `returnTo`

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
- `/app/profile` -> `GET /me`
- `/app/wallet` -> `GET /me/wallet`, `GET /me/wallet/transactions`
- `/app/payments` -> `GET /me/payments`
- `/app/payments` -> `POST /me/payments/pix`
- `/app/payments/[paymentId]` -> `GET /me/payments/{paymentId}`
- `/app/orders` -> `GET /me/orders`
- `/catalog/[serviceId]` -> `POST /me/orders`
- `/app/orders/[orderId]` -> `GET /me/orders/{orderId}`
- `/admin` -> `GET /admin/dashboard/summary`
- `/admin/users` -> `GET /admin/users`
- `/admin/payments` -> `GET /admin/payments`
- `/admin/orders` -> `GET /admin/orders`
- `/admin/catalog` -> `GET /admin/catalog/services`
- `/admin/supplier` -> `GET /admin/supplier/providers`, `GET /admin/supplier/services`, `GET /admin/supplier/sync-logs`
- `/admin/alerts` -> `GET /admin/alerts`
- `/admin/audits` -> `GET /admin/audits`
- `/admin/transactions` -> `GET /admin/transactions`
- `/admin/payments/[paymentId]` -> `GET /admin/payments/{paymentId}`
- `/admin/orders/[orderId]` -> `GET /admin/orders/{orderId}`

## Operational UX Direction

- status de sessao, disponibilidade e estados assincronos continuam sendo parte central da UX
- a area do cliente deve priorizar clareza de fluxo para wallet, PIX e pedidos
- a area admin deve priorizar densidade informacional e observabilidade operacional
- a area admin consolidou um shell unico com navegacao por modulo e tabelas reutilizaveis para catalogo, fornecedores, alertas, auditoria e transacoes

## Remaining Direction

- a proxima etapa deve consolidar polimento visual e estados refinados nas listas administrativas ja filtraveis
- as proximas telas devem reutilizar o design system interno e os mesmos padroes de shell, tabela, toolbar e badges
- o proximo refinamento recomendado apos filtros/paginacao no admin e voltar para polimento visual das areas publica e cliente e fluxos de perfil
- a edicao de perfil do cliente continua bloqueada ate o contrato local especificar o request body de `PATCH /me`
- o proximo passo recomendado no cliente e preparar a edicao de perfil assim que `PATCH /me` receber schema formal e depois revisar refinamentos finais das jornadas transacionais
- o proximo passo recomendado depois do polimento publico e fechar a entrada de edicao de perfil via contrato novo, ou avancar para mutacoes reais adicionais onde a OpenAPI ja suportar
- telas de negocio devem continuar usando `src/lib/api` como fronteira com o backend
