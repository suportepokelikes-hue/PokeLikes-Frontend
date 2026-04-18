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
- ja existem telas completas de negocio nas areas publica, cliente e admin, incluindo a V1 frontend de afiliados
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
- o formulario de ajuste manual de carteira no admin agora traduz direcao e tipo de lancamento para uma linguagem operacional mais clara
- o tipo do lancamento da carteira nao e mais escolhido manualmente na UI; ele agora e derivado automaticamente pela direcao da operacao
- quando o ajuste de carteira ja nasce no detalhe de um usuario, o campo de `userId` nao fica mais editavel na UI
- a edicao de usuario no admin nao usa mais checkbox para limpar telefone; o formulario ficou mais direto
- `/admin/users` agora mostra a lista primeiro e abre a criacao de usuario em um drawer lateral acionado por `+ Novo usuario`
- `/admin/users` agora tambem abre a edicao e o ajuste manual de carteira em drawer lateral na propria listagem; a rota `/admin/users/[userId]` foi mantida apenas como redirecionamento para esse fluxo
- os drawers admin agora usam portal para o `document.body`, o que corrige a sobreposicao sobre a barra superior sticky e garante que o backdrop cubra tambem o header
- o shell autenticado agora usa menu lateral recolhivel em tablet/mobile, no lugar da sidebar empilhada no topo da pagina
- o topo do shell autenticado nao mostra mais o chip redundante com nome do usuario; a identificacao e o logout ficam apenas no badge lateral inferior
- o padrao compartilhado de toolbar/filtros (`AdminFilterBar` dentro de `PageHeader`) agora quebra melhor em larguras intermediarias e deve ser considerado a base para os modulos administrativos restantes
- no catalogo admin, a filtragem foi simplificada para um unico campo de busca textual e uma selecao de fornecedor; os filtros secundarios antigos sairam da UX
- a publicacao de um novo servico no catalogo admin agora acontece em drawer lateral acionado pela lista de servicos sincronizados, sem formulario fixo exposto na tela
- o sync de servicos do fornecedor agora usa selecao com `label` amigavel e `value` backend-safe, e a camada admin normaliza `supplierName` para enviar apenas `{}` ou as chaves exatas `cheapsmmglobal` / `instabarato`
- a edicao de um servico ja publicado no catalogo admin agora tambem acontece em drawer lateral na propria listagem; a rota `/admin/catalog/[serviceId]` ficou apenas como redirecionamento
- o formulario do catalogo admin agora mostra so os campos publicos principais; os campos tecnicos herdados do fornecedor deixaram de ficar editaveis na UX normal
- o drawer do catalogo admin continua mostrando fornecedor, SID, categoria, tipo e faixa como resumo somente leitura do servico sincronizado
- `/admin/catalog` agora tambem combina `GET /admin/catalog/affiliate-settings` com a lista publicada para exibir status de afiliabilidade e percentual de comissao na propria tabela
- a configuracao de afiliabilidade por servico abre em drawer lateral dentro de `/admin/catalog`, usando `PATCH /admin/catalog/{serviceId}/affiliate-settings` com apenas `affiliateEnabled` e `affiliateCommissionPercent`
- o formulario de afiliabilidade do catalogo trata o percentual como valor humano (`30.00 = 30%`) e exige valor maior que zero quando a afiliacao e ativada
- `/admin/transactions` agora abre o ajuste manual de carteira em drawer lateral por `+ Ajuste manual`, mantendo a lista de transacoes como foco principal da tela
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
- existe uma copia adicional em `docs/api/openapi.yaml`, mas ela fica apenas como referencia auxiliar; para trabalho de frontend o contrato operacional validado continua sendo `docs/contracts/backend-openapi.yaml` e a copia divergente nao deve guiar payloads ate ser resincronizada
- na pratica, essa divergencia aparece especialmente no payout manual: `docs/api/openapi.yaml` descreve `commissionIds`/`notes`, enquanto o frontend continua seguindo a copia validada com `affiliateProfileId`, `amount` e `note`
- `/register` agora entende `?ref=CODIGO`, preenche o codigo de indicacao no formulario e envia `referralCode` ao backend no `POST /auth/register`
- `src/lib/api/auth.ts` agora cobre `POST /auth/email-verification/request` e `POST /auth/email-verification/confirm`
- `src/lib/api/customer.ts` agora cobre `GET /me/referral`
- `/app/profile` agora mostra o programa de indicacao do usuario, com codigo, link, regras, resumo, `rewardStatus`, estado de email e botoes de copia
- `/app/affiliate` agora existe como area separada da conta, consumindo `GET /me/affiliate`, `POST /me/affiliate/apply`, `GET /me/affiliate/summary` e `GET /me/affiliate/commissions`
- quando `GET /me/affiliate` retorna `null`, `/app/affiliate` trata isso como entrada no programa, mostra CTA de apply e recarrega a propria rota depois da solicitacao
- quando o perfil existe, `/app/affiliate` passa a refletir status, summary, codigo publico e comissoes do proprio usuario
- o shell autenticado do cliente agora possui entrada dedicada para `Afiliados`
- `/admin/affiliates` agora existe como primeiro modulo administrativo de afiliados, consumindo `GET /admin/affiliates`, `POST /admin/affiliates/{affiliateProfileId}/approve` e `POST /admin/affiliates/{affiliateProfileId}/suspend`
- a listagem administrativa de afiliados segue o padrao do shell admin: filtros por query string, tabela densa, estados explicitos e `AdminActionForm` inline para aprovar ou suspender sem inventar reativacao
- `/admin/affiliate-commissions` agora existe como modulo administrativo de leitura financeira dos afiliados, consumindo `GET /admin/affiliate-commissions`
- `/admin/affiliate-payouts` agora existe como modulo administrativo de payout, consumindo `GET /admin/affiliate-payouts` e `POST /admin/affiliate-payouts`
- o payout manual pede `affiliateProfileId`, valor total e IDs de comissao em texto livre; como `docs/contracts/backend-openapi.yaml` ainda aceita apenas `affiliateProfileId`, `amount` e `note`, os IDs informados sao consolidados dentro de `note` para manter rastreio operacional sem inventar payload
- o catalogo publico agora captura `?aff=` em `/catalog` e `/catalog/[serviceId]`, preserva esse codigo em storage local simples e o reaproveita no checkout de `POST /me/orders` como `affiliateCode` opcional
- a regra operacional atual do `affiliateCode` esta fixada: o ultimo `?aff=` valido substitui o codigo salvo; navegar sem `?aff=` nao limpa o valor automaticamente na V1
- o fluxo de `?ref=` do cadastro continua separado; a logica nova de afiliados nao toca registro nem substitui o referral existente
- o shell admin e a home admin agora apontam explicitamente para `/admin/affiliates`, `/admin/affiliate-commissions` e `/admin/affiliate-payouts`
- `/admin/catalog` continua sendo o unico modulo administrativo para servicos; a leitura e a edicao de affiliate settings vivem na mesma listagem via drawer lateral, sem modulo separado
- `/app` agora tambem exibe um destaque resumido do referral, com CTA para abrir indicacoes ou seguir para deposito qualificado quando for o caso
- a verificacao de email pode ser solicitada na propria area autenticada; fora de producao, `previewToken` aparece como atalho de desenvolvimento para `/verify-email?token=...`
- `/verify-email` agora executa a confirmacao do token e atualiza o cookie de usuario quando a sessao atual pertence ao mesmo usuario confirmado
- ja existe `/app/profile` consumindo `GET /me` para validar os dados atuais do cliente autenticado
- `/app/profile` agora tambem abre a edicao em drawer lateral na propria tela, com formulario pronto para nome e telefone, email explicitamente somente leitura e feedback inline para a pendencia atual
- `/app/profile` agora salva nome e telefone por `PATCH /me`, mantem email como somente leitura, atualiza o cookie de usuario da sessao e fecha o drawer voltando para a leitura atualizada com `?updated=1`
- dashboard, carteira, pagamentos, pedidos e perfil do cliente receberam um polimento visual alinhado ao Stitch dominante, com hero cards, atalhos e notas operacionais
- os detalhes do cliente para pagamento e pedido agora seguem o mesmo padrao visual, com hero de status e leitura operacional mais forte
- `/app/payments` e `/app/orders` agora tambem abrem seus detalhes em drawer lateral na propria listagem; as rotas `/app/payments/[paymentId]` e `/app/orders/[orderId]` ficaram apenas como redirecionamento
- o drawer de `/app/payments` agora tambem renderiza QR code a partir de `brCodeBase64`, oferece copia do codigo PIX por `brCode`, faz refresh manual/automatico enquanto o pagamento estiver pendente e a propria tela prioriza o PIX em aberto
- a home publica agora foi reescrita como landing page comercial da plataforma, com hero de marca, beneficios, prova de confianca e CTA de conversao
- a listagem do catalogo e o detalhe do servico tambem receberam polimento visual alinhado ao Stitch dominante
- `src/components/ui/empty-state.tsx` e `src/components/ui/error-state.tsx` agora sustentam um estado visual compartilhado mais forte, e `src/app/app/loading.tsx` cobre o loading do segmento autenticado do cliente
- ja existem `/catalog` e `/catalog/[serviceId]` conectados ao backend real
- ja existem `/app/wallet`, `/app/payments`, `/app/orders`, `/admin/users`, `/admin/payments` e `/admin/orders`
- ja existem `/admin/catalog`, `/admin/supplier`, `/admin/alerts`, `/admin/audits`, `/admin/transactions`, `/admin/affiliates`, `/admin/affiliate-commissions` e `/admin/affiliate-payouts` conectados ao backend real
- `/admin/users` nao e mais somente leitura; a propria lista contem formularios de criacao e atualizacao operacional
- `/admin/catalog` nao e mais somente leitura; a propria lista contem formularios de criacao e atualizacao operacional
- `/admin/catalog` e `/admin/users` agora usam a lista para leitura + criacao, e reservam a edicao para paginas dedicadas
- `/admin/transactions` agora mistura leitura do ledger com lancamento manual de ajuste de carteira
- `normalizeReturnTo` passou a bloquear tambem `/login?...` e `/register?...`, corrigindo um risco de loop de auth detectado pelos testes
- `src/lib/api/http.ts` passou a preservar corretamente o prefixo `/v1` da base URL ao montar requests com paths iniciados por `/`
- `/app/payments` cria PIX real e `/app/payments/[paymentId]` mostra o detalhe do pagamento
- o fluxo de PIX do cliente ja esta alinhado ao contrato atual do backend: `POST /me/payments/pix`, `GET /me/payments` e `GET /me/payments/{paymentId}`
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

- tratar a V1 frontend de afiliados como concluida no escopo atual; nao reabrir implementacao sem necessidade contratual ou de qualidade
- ampliar a cobertura Playwright para a jornada `?aff= -> catalogo -> pedido`
- ampliar a cobertura Playwright para o drawer de affiliate settings em `/admin/catalog`
- decidir apenas se a V2 vai exigir expiracao ou limpeza automatica do `affiliateCode` persistido
- resincronizar `docs/api/openapi.yaml` com `docs/contracts/backend-openapi.yaml` antes de qualquer evolucao de payloads de payout
- so depois avaliar se faz sentido formalizar `commissionIds` no contrato futuro


## Source Of Truth Precedence

When sources conflict, use this precedence:

1. current code and validated contracts
2. `docs/contracts/backend-openapi.yaml` for REST behavior
3. `docs/api/openapi.yaml` only when it is consistent with the validated contract copy above
4. `docs/architecture.md` for intended architecture
5. `docs/backlog.md` for execution order and next step
6. design references (e.g. Stitch exports) for visual direction
7. prior thread summaries or assumptions

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

- pedidos do cliente, dashboard do cliente, lista admin de pedidos e detalhe admin agora compartilham um mapa central de status/timeline para tratar `queued_supplier_balance` como espera operacional e explicar a retomada para `submitted`
- a lista de alertas admin agora renderiza `supplier_order_not_enough_funds` com contexto estruturado, incluindo destaque para saldo reservado do cliente quando essa informacao vier do backend
