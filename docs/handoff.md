# Handoff Guide

## Mandatory Startup Routine

Toda nova sessao do Codex neste repositorio deve:

1. ler `AGENTS.md`
2. ler `docs/README.md`
3. ler `docs/architecture.md`
4. ler `docs/backlog.md`
5. ler `docs/AGENTS.md`
6. ler `docs/handoff.md`
7. ler `docs/contracts/backend-openapi.yaml`

## What The Next Session Should Know

- a foundation inicial do frontend ja foi implementada
- ainda nao existem telas completas de negocio
- o backend ja existe e o contrato local foi copiado para `docs/contracts/backend-openapi.yaml`
- ja existem `/`, `/app` e `/admin` com shell visual e guardas por papel
- ja existem `/login` e `/register` com server actions conectadas ao backend
- `/login` e `/register` agora usam um formulario compartilhado mais rico, com contexto operacional, feedback inline mais claro e copy ajustada para teste manual real da autenticacao
- middleware, guards e server actions agora carregam `reason` e `returnTo` para devolver o usuario a rota de origem apos login e para mostrar feedback de sessao expirada ou logout concluido
- as listas admin agora leem filtros de `searchParams`, repassam os query params reais para `src/lib/api/admin.ts` e renderizam toolbar + navegacao de pagina coerentes com a OpenAPI
- ja existe `/app/profile` consumindo `GET /me` para validar os dados atuais do cliente autenticado
- dashboard, carteira, pagamentos, pedidos e perfil do cliente receberam um polimento visual alinhado ao Stitch dominante, com hero cards, atalhos e notas operacionais
- os detalhes do cliente para pagamento e pedido agora seguem o mesmo padrao visual, com hero de status e leitura operacional mais forte
- a home publica, a listagem do catalogo e o detalhe do servico tambem receberam polimento visual alinhado ao Stitch dominante
- `src/components/ui/empty-state.tsx` e `src/components/ui/error-state.tsx` agora sustentam um estado visual compartilhado mais forte, e `src/app/app/loading.tsx` cobre o loading do segmento autenticado do cliente
- ja existem `/catalog` e `/catalog/[serviceId]` conectados ao backend real
- ja existem `/app/wallet`, `/app/payments`, `/app/orders`, `/admin/users`, `/admin/payments` e `/admin/orders`
- ja existem `/admin/catalog`, `/admin/supplier`, `/admin/alerts`, `/admin/audits` e `/admin/transactions` conectados ao backend real
- `/app/payments` cria PIX real e `/app/payments/[paymentId]` mostra o detalhe do pagamento
- `/catalog/[serviceId]` cria pedido real para cliente autenticado e `/app/orders/[orderId]` mostra o detalhe do pedido
- `src/lib/api` centraliza o client HTTP e os endpoints iniciais de auth
- `src/lib/auth` centraliza leitura de sessao em cookies e guards server-side
- `src/middleware.ts` tenta refresh quando existe `refreshToken` sem sessao completa
- `src/components/ui` concentra o design system interno derivado do Stitch
- o shell admin agora contem navegacao por modulo para dashboard, usuarios, catalogo, pagamentos, pedidos, fornecedores, alertas, auditoria e transacoes
- `src/app/admin/loading.tsx` cobre o loading visual do segmento admin
- `src/modules/admin-shell/actions.ts` centraliza mutacoes server-side do admin: resolve de alertas, refresh/sync de fornecedores, conciliacao de pagamentos e sync de pedidos
- `src/modules/admin-shell/admin-action-form.tsx` expoe feedback inline de sucesso e erro para as acoes operacionais do admin
- ja existem drill-downs admin para `/admin/payments/[paymentId]` e `/admin/orders/[orderId]`

## Expected First Implementation Step

- encaixar o design final das telas de auth e shells quando ele estiver disponivel
- expandir admin para catalogo, fornecedores, alertas, auditoria e transacoes
- revisar presets e refinamento visual dos filtros administrativos agora que a navegacao esta funcional
- habilitar edicao de perfil do cliente quando o request body de `PATCH /me` for detalhado no contrato
- preparar a entrada segura de edicao de perfil quando o contrato de `PATCH /me` for detalhado
- expandir cliente para perfil, refinamento de payment/order e estados visuais finais do Stitch
- aprofundar filtros e paginacao navegavel nas listas administrativas


## Source Of Truth Precedence

When sources conflict, use this precedence:

1. current code and validated contracts
2. `docs/api/openapi.yaml` for REST behavior
3. `docs/architecture-v1.md` for intended architecture
4. `docs/backlog-v1.md` for execution order and next step
5. design references (e.g. Stitch exports) for visual direction
6. prior thread summaries or assumptions

## Frontend Consistency Policy

For frontend work, agents should prefer:
- one shell per area (customer, admin)
- one icon set
- one table pattern
- one filter toolbar pattern
- one badge/status system
- one page header pattern
- one modal/drawer pattern

When Stitch exports are inconsistent, normalize to the dominant and most reusable pattern rather than replicating inconsistencies literally.

## Verification Expectations By Task Type

Backend route changes:
- run tests if available
- verify request/response alignment
- verify auth/permission behavior

Prisma changes:
- verify schema compiles
- verify migration status
- note any manual migration concerns

Frontend changes:
- verify route coverage
- verify loading/error/empty states
- verify API integration against contract
- verify customer/admin shell consistency

Integration changes:
- verify provider-specific docs alignment
- verify fallback/error behavior
- document operational risks

## Anti-Invention Rule

Agents must not invent:
- routes not present in the API contract
- fields not supported by backend requests/responses
- domain states not present in code or docs
- admin/customer flows that blur permission boundaries

If the UI needs a state not explicitly modeled, the agent should either:
- derive it transparently from existing backend data, or
- document the gap and stop short of inventing a fake contract
