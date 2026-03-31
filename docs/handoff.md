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
- `/admin/users` agora tambem permite criar e atualizar usuarios com base em `POST /admin/users` e `PATCH /admin/users/{userId}`, usando feedback inline por server action
- `/admin/catalog` agora tambem permite criar e atualizar servicos com base em `POST /admin/catalog/services` e `PATCH /admin/catalog/services/{serviceId}`, incluindo `metadata` JSON e limpeza explicita de descricao/metadata
- a criacao em `/admin/catalog` agora parte da selecao de um `SupplierService` sincronizado carregado por `GET /admin/supplier/services`, e o formulario de publicacao preenche automaticamente fornecedor, categoria, tipo e limites
- `/admin/transactions` agora permite ajuste manual de carteira com base em `POST /admin/wallets/{userId}/adjustments`, com feedback inline e reaproveitando o filtro `userId` como contexto inicial
- `/admin/users/[userId]` e `/admin/catalog/[serviceId]` agora existem para concentrar edicao em paginas dedicadas e reduzir a densidade operacional das listas
- existe uma base inicial de testes em `tests/` com script `npm run test`, cobrindo auth/navigation e parsing administrativo
- a base de testes agora tambem cobre serializacao de sessao e `src/lib/api/http.ts`
- auth e admin agora possuem helpers puros extraidos das server actions para sustentar testes de mapeamento de erro e parsing de payload
- customer transactions agora tambem possuem helpers puros para parsing de PIX/pedido, e `src/lib/api/customer.ts` esta coberto por testes de wiring
- `src/lib/api/auth.ts` agora tambem esta coberto por testes de wiring para login, registro, refresh, logout e leitura de usuario autenticado
- `AuthForm` agora delega sua composicao configuravel para `src/modules/auth/auth-form-content.ts`, coberto por teste para notice, hidden `returnTo`, campos e fallback de erro
- componentes base de UI (`empty-state`, `error-state`, `status-badge`, `page-header`) agora possuem testes de renderizacao via `react-dom/server`
- `/login` e `/register` agora compartilham helpers puros de conteudo em `src/modules/auth/page-content.ts`, cobertos por teste para links alternativos e campos esperados
- `TransactionField` e `TransactionTextarea` do checkout/pagamento agora possuem testes de renderizacao para atributos criticos
- `TransactionForm` agora delega sua composicao configuravel para `src/modules/customer-transactions/transaction-form-content.ts`, coberto por teste para hidden `returnTo`, label de submit e fallback de erro
- `AdminActionForm`, `LogoutButton` e `AreaShell` agora delegam sua composicao configuravel para helpers puros testados, cobrindo hidden fields, mensagens operacionais, copy de logout e destaque de navegacao atual
- a base E2E agora usa Playwright com `playwright.config.ts`, `webServer` local em Next e envs explicitas para credenciais e backend; as primeiras specs reais estao em `e2e/auth.spec.ts`, `e2e/customer-transactions.spec.ts` e `e2e/admin-operations.spec.ts`
- o frontend passou por uma nova rodada de alinhamento visual com os exports do Stitch em `docs/stitch_cliente_dashboard`, especialmente no shell lateral, telas de auth, home publica, catalogo e dashboards principais de cliente/admin
- depois desse realinhamento, entrou um passe especifico de microdetalhes visuais no shell e nos componentes compartilhados para melhorar iconografia, espacamento e comportamento responsivo em larguras menores
- a logo real da marca agora vive em `public/brand/logo.jpeg` e ja substitui a marca fake/textual nos shells principais, auth e home publica
- o shell autenticado agora usa `lucide-react` para iconografia real de navegacao e busca, no lugar dos icones desenhados por CSS na fase anterior
- a iconografia real agora tambem comeca a aparecer em estados compartilhados (`empty/error`) e nas jornadas principais de home publica, dashboard do cliente e entrada do admin
- a copy das telas principais acabou de passar por uma limpeza editorial para remover linguagem tecnica, rotulos internos como "workspace" e blocos repetitivos de contexto
- logo depois dessa limpeza, as jornadas principais tambem passaram por uma rodada estrutural de UX com CTA mais fortes, blocos reordenados e traducao adicional de labels tecnicos expostos na UI
- ja existe `/app/profile` consumindo `GET /me` para validar os dados atuais do cliente autenticado
- dashboard, carteira, pagamentos, pedidos e perfil do cliente receberam um polimento visual alinhado ao Stitch dominante, com hero cards, atalhos e notas operacionais
- os detalhes do cliente para pagamento e pedido agora seguem o mesmo padrao visual, com hero de status e leitura operacional mais forte
- a home publica, a listagem do catalogo e o detalhe do servico tambem receberam polimento visual alinhado ao Stitch dominante
- `src/components/ui/empty-state.tsx` e `src/components/ui/error-state.tsx` agora sustentam um estado visual compartilhado mais forte, e `src/app/app/loading.tsx` cobre o loading do segmento autenticado do cliente
- ja existem `/catalog` e `/catalog/[serviceId]` conectados ao backend real
- ja existem `/app/wallet`, `/app/payments`, `/app/orders`, `/admin/users`, `/admin/payments` e `/admin/orders`
- ja existem `/admin/catalog`, `/admin/supplier`, `/admin/alerts`, `/admin/audits` e `/admin/transactions` conectados ao backend real
- `/admin/users` nao e mais somente leitura; a propria lista contem formularios de criacao e atualizacao operacional
- `/admin/catalog` nao e mais somente leitura; a propria lista contem formularios de criacao e atualizacao operacional
- `/admin/catalog` e `/admin/users` agora usam a lista para leitura + criacao, e reservam a edicao para paginas dedicadas
- `/admin/transactions` agora mistura leitura do ledger com lancamento manual de ajuste de carteira
- `normalizeReturnTo` passou a bloquear tambem `/login?...` e `/register?...`, corrigindo um risco de loop de auth detectado pelos testes
- `src/lib/api/http.ts` passou a preservar corretamente o prefixo `/v1` da base URL ao montar requests com paths iniciados por `/`
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

- revisar o novo alinhamento visual do frontend contra os PNGs/code.html do Stitch e corrigir os pontos que ainda destoarem
- aprofundar a proxima rodada em conteudo e UX agora que a base visual, os microdetalhes e a limpeza editorial estao mais estaveis
- revisar o comportamento dessas novas hierarquias em larguras menores e terminar o refinamento das telas admin mais densas
- expandir admin para catalogo, fornecedores, alertas, auditoria e transacoes
- revisar presets e refinamento visual dos filtros administrativos agora que a navegacao esta funcional
- implementar criacao e edicao de servicos em `/admin/catalog`
- integrar ajuste manual de carteira no admin
- revisar agora se ajustes de carteira e edicoes inline devem migrar para detalhes ou drawers dedicados
- consolidar a massa de dados e ampliar a cobertura Playwright para cenarios admin e negativos
- habilitar edicao de perfil do cliente quando o request body de `PATCH /me` for detalhado no contrato
- preparar a entrada segura de edicao de perfil quando o contrato de `PATCH /me` for detalhado
- expandir cliente para perfil, refinamento de payment/order e estados visuais finais do Stitch


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
