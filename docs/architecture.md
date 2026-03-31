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
- `/admin/users` agora tambem executa `POST /admin/users` e `PATCH /admin/users/{userId}` com formularios operacionais embutidos na propria listagem, sem sair do shell administrativo
- `/admin/catalog` agora tambem executa `POST /admin/catalog/services` e `PATCH /admin/catalog/services/{serviceId}` com formularios operacionais embutidos na propria listagem, incluindo suporte a `metadata` JSON e limpeza explicita de campos anulaveis
- `/admin/transactions` agora tambem executa `POST /admin/wallets/{userId}/adjustments`, permitindo credito e debito administrativos no mesmo contexto do ledger financeiro
- `/admin/users/[userId]` e `/admin/catalog/[serviceId]` agora concentram as edicoes mais densas do admin em paginas dedicadas, deixando as listas primarias focadas em leitura e navegacao
- o frontend agora possui uma base de testes sem dependencia extra, usando `node:test` + `tsc` para validar utilitarios criticos de auth, parsing administrativo, serializacao de sessao e camada HTTP base da API
- parte da logica mais sensivel das server actions de auth e admin foi extraida para helpers puros, facilitando cobertura de teste sem acoplamento ao runtime do Next
- o dominio de transacoes do cliente agora segue a mesma direcao, com helpers puros para parsing de PIX/pedido e cobertura da camada `src/lib/api/customer.ts`
- `src/lib/api/auth.ts` agora tambem possui cobertura de wiring para registro, login, refresh, logout, `auth/me` e `/me`
- o design system base agora tambem possui cobertura de renderizacao server-side para `empty-state`, `error-state`, `status-badge` e `page-header`
- `/login` e `/register` agora derivam seu conteudo de helpers puros, o que permite validar copy, links de retorno e composicao de campos sem acoplar os testes ao runtime do Next
- `AuthForm` agora delega sua composicao configuravel para `src/modules/auth/auth-form-content.ts`, o que permite validar notice, `returnTo`, campos e feedback de erro sem depender de runner browser
- os blocos puros do `transaction-form` do cliente agora tambem possuem cobertura de renderizacao, validando atributos essenciais de campos numericos, placeholders e textarea
- `TransactionForm` agora tambem delega sua composicao configuravel para `src/modules/customer-transactions/transaction-form-content.ts`, o que permite validar hidden `returnTo`, labels de submit e fallback de erro sem browser
- `AdminActionForm`, `LogoutButton` e `AreaShell` agora tambem delegam sua composicao configuravel para helpers puros, permitindo validar hidden fields, mensagens operacionais, copy de logout e destaque de navegacao sem acoplar os testes aos hooks do runtime
- a infraestrutura E2E agora usa Playwright com `playwright.config.ts`, `webServer` local em Next, envs explicitas de credenciais e primeiras specs reais para auth, PIX, checkout e operacao admin por UI
- essa base de testes ja capturou e corrigiu dois bugs reais: `returnTo` aceitando `/login?...` e a construcao de URL da API descartando o prefixo `/v1` quando o path chegava com `/`
- o frontend entrou em uma segunda rodada forte de alinhamento com o Stitch dominante, com shell lateral mais proximo das referencias, tipografia editorial, superficie mais limpa e composicoes menos genericas nas telas publicas, cliente, admin e auth
- o shell e o design system receberam um passe fino de micro-polish visual, com icones CSS dedicados, espacamento mais consistente entre cards/acoes e regras responsivas mais seguras para toolbar, sidebar e grids em larguras menores
- a marca visual agora passa a usar um asset real em `public/brand/logo.jpeg` nos pontos principais de branding do app, substituindo monogramas e lockups puramente tipograficos
- a iconografia compartilhada agora passa a usar `lucide-react` no shell autenticado, substituindo os icones CSS provisórios e abrindo um caminho mais consistente para os proximos ajustes de UX
- essa mesma base de iconografia agora comeca a subir para estados compartilhados e jornadas principais, reforcando CTA, empty/error e leitura de cards sem depender apenas de texto
- a copy das telas principais foi simplificada para cortar rotulos internos de sistema, explicacoes de arquitetura vazando para a UI e blocos redundantes de contexto nas areas publica, cliente e admin

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
- `/admin/users` -> `POST /admin/users`
- `/admin/users` -> `PATCH /admin/users/{userId}`
- `/admin/users/[userId]` -> `GET /admin/users/{userId}`, `PATCH /admin/users/{userId}`, `POST /admin/wallets/{userId}/adjustments`
- `/admin/payments` -> `GET /admin/payments`
- `/admin/orders` -> `GET /admin/orders`
- `/admin/catalog` -> `GET /admin/catalog/services`
- `/admin/catalog` -> `POST /admin/catalog/services`
- `/admin/catalog` -> `PATCH /admin/catalog/services/{serviceId}`
- `/admin/catalog/[serviceId]` -> `GET /catalog/services/{serviceId}`, `PATCH /admin/catalog/services/{serviceId}`
- `/admin/supplier` -> `GET /admin/supplier/providers`, `GET /admin/supplier/services`, `GET /admin/supplier/sync-logs`
- `/admin/alerts` -> `GET /admin/alerts`
- `/admin/audits` -> `GET /admin/audits`
- `/admin/transactions` -> `GET /admin/transactions`
- `/admin/transactions` -> `POST /admin/wallets/{userId}/adjustments`
- `/admin/payments/[paymentId]` -> `GET /admin/payments/{paymentId}`
- `/admin/orders/[orderId]` -> `GET /admin/orders/{orderId}`

## Operational UX Direction

- status de sessao, disponibilidade e estados assincronos continuam sendo parte central da UX
- a area do cliente deve priorizar clareza de fluxo para wallet, PIX e pedidos
- a area admin deve priorizar densidade informacional e observabilidade operacional
- a direcao de conteudo agora privilegia linguagem de tarefa em vez de linguagem de implementacao: menos explicacao tecnica, menos repeticao e mais foco em decisao e acao
- a area admin consolidou um shell unico com navegacao por modulo e tabelas reutilizaveis para catalogo, fornecedores, alertas, auditoria e transacoes
- a referencia visual dominante agora e a linguagem “architectural minimalist” dos exports do Stitch em `docs/stitch_cliente_dashboard`, com sidebar fixa, topo leve, cards tonais e hierarquia editorial

## Remaining Direction

- a proxima etapa deve consolidar o acabamento operacional dessas mutacoes admin, revisando se algumas acoes densas precisam de fluxo dedicado por entidade
- a proxima etapa de UX deve revisar hierarquia de conteudo, ordem dos blocos e CTA nas jornadas principais depois da limpeza editorial
- a proxima etapa deve consolidar a camada E2E com massa de teste estavel e ampliar os cenarios administrativos mais sensiveis ja sobre a nova base visual
- as proximas telas devem reutilizar o design system interno e os mesmos padroes de shell, tabela, toolbar e badges
- a edicao de perfil do cliente continua bloqueada ate o contrato local especificar o request body de `PATCH /me`
- o proximo passo recomendado no admin e revisar se ajustes de carteira e edicoes inline devem migrar para detalhes ou drawers dedicados
- o proximo passo recomendado em qualidade e aumentar a cobertura de testes em torno de auth, query params e camada de API
- o proximo passo recomendado no cliente continua sendo preparar a edicao de perfil assim que `PATCH /me` receber schema formal
- telas de negocio devem continuar usando `src/lib/api` como fronteira com o backend
