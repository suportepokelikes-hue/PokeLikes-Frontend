# Frontend Architecture

## Purpose

Descrever a arquitetura operacional do frontend como ele existe hoje, sem misturar bootstrap antigo com backlog ja entregue.

## Stack Direction

- Next.js App Router
- TypeScript estrito
- separacao por dominio em `src/modules`
- compartilhados em `src/components/ui` e `src/lib`
- sessao baseada em cookies HTTP-only

## Source Of Truth

- comportamento REST: `docs/contracts/backend-openapi.yaml`
- codigo atual: superficies, fluxos, redirects, drawers e limites reais
- `docs/api/openapi.yaml`: apenas referencia auxiliar quando nao divergir

O frontend nao deve inventar payloads fora do contrato validado.

## Application Areas

### Public

- landing em `/`
- autenticacao em `/login` e `/register`
- confirmacao de email em `/verify-email`
- catalogo publico em `/catalog` e `/catalog/[serviceId]`

### Customer

- shell autenticado em `/app`
- perfil, referral e afiliados
- wallet, PIX e pedidos

### Admin

- shell administrativo em `/admin`
- modulos operacionais de usuarios, catalogo, pagamentos, pedidos, fornecedores, alertas, auditoria, transacoes e afiliados

## Route Model

### Rotas com detalhe em drawer

O frontend atual privilegia listagem + drawer em vez de pagina de detalhe separada para alguns modulos:

- `/app/payments?paymentId=...`
- `/app/orders?orderId=...`
- `/app/profile?edit=1`
- `/admin/users?create=1`
- `/admin/users?editUserId=...`
- `/admin/catalog?createSupplierServiceId=...`
- `/admin/catalog?editServiceId=...`
- `/admin/catalog?editAffiliateServiceId=...`
- `/admin/affiliate-payouts?create=1`
- `/admin/transactions?adjust=1`

As rotas filhas abaixo existem apenas como redirecionamento para esses fluxos:

- `/app/payments/[paymentId]`
- `/app/orders/[orderId]`
- `/admin/users/[userId]`
- `/admin/catalog/[serviceId]`

### Rotas com detalhe dedicado

- `/admin/payments/[paymentId]`
- `/admin/orders/[orderId]`

## Auth And Session

- `src/lib/auth/cookies.ts` le sessao do servidor
- `src/lib/auth/guards.ts` separa acesso publico, cliente e admin
- `src/middleware.ts` protege `/app` e `/admin`, tenta refresh quando houver `refreshToken` e preserva `returnTo`
- `src/modules/auth/actions.ts` centraliza login, cadastro, logout e request de verificacao de email

`/login` e `/register` aceitam `returnTo` seguro. `normalizeReturnTo` bloqueia retorno para `/login?...` e `/register?...` para evitar loop de auth.

## API Boundary

`src/lib/api` e a fronteira unica com o backend:

- `http.ts`: base URL, auth headers, tratamento de erro e montagem de path
- `auth.ts`: login, cadastro, refresh, logout, `auth/me`, `/me` e verificacao de email
- `catalog.ts`: catalogo publico e detalhe de servico
- `customer.ts`: perfil, referral, afiliados, wallet, pagamentos e pedidos do cliente
- `admin.ts`: dashboard e modulos administrativos
- `contracts.ts`: tipos compartilhados aderentes ao contrato consumido

Evitar `fetch` diretamente em paginas e componentes de tela.

## Current Customer Journeys

### Catalogo e checkout

- `/catalog` lista servicos reais
- `/catalog/[serviceId]` carrega detalhe real e cria pedido por `POST /me/orders`
- `?aff=` capturado em `/catalog` e `/catalog/[serviceId]` fica persistido localmente
- catalogo e checkout mostram explicitamente quando ha `affiliateCode` ativo e permitem limpeza manual do codigo salvo
- quando houver checkout autenticado, `affiliateCode` segue no payload do pedido

### Perfil e verify-email

- `/app/profile` consome `GET /me`, `GET /me/referral` e `GET /me/wallet`
- o drawer de edicao salva `name`, `phone` e `taxId` por `PATCH /me`
- `email` continua readonly na UI atual
- request de verificacao de email pode ser feito a partir da conta
- fora de producao, `previewToken` pode aparecer para desenvolvimento
- `/verify-email` confirma o token e atualiza o cookie de usuario quando a sessao atual pertence ao usuario confirmado

### PIX e wallet

- `/app/wallet` mostra saldo e extrato
- `/app/payments` carrega perfil, wallet e pagamentos
- criacao de PIX usa `POST /me/payments/pix`
- quando falta CPF/CNPJ, a tela bloqueia preventivamente a criacao e aponta para `/app/profile?edit=1`
- o drawer de pagamento mostra QR code via `brCodeBase64`, copia de `brCode` e refresh enquanto o status estiver pendente

### Pedidos

- `/app/orders` lista pedidos do cliente
- o detalhe em drawer busca `GET /me/orders/{orderId}`
- status `queued_supplier_balance` recebe leitura operacional dedicada, sem tratar como cancelamento

### Afiliados do cliente

- `/app/affiliate` trata `GET /me/affiliate = null` como entrada no programa
- o apply usa `POST /me/affiliate/apply`
- quando existe perfil, a tela carrega `GET /me/affiliate/summary` e `GET /me/affiliate/commissions`
- se summary ou commissions falharem isoladamente, a tela preserva perfil e status e degrada apenas o bloco afetado
- a tela de afiliado exibe e edita chave PIX de payout pelos endpoints dedicados `GET /me/affiliate/pix-key` e `PATCH /me/affiliate/pix-key`, deixando claro quando o recebimento ainda esta pendente

## Current Admin Journeys

### Usuarios

- listagem com filtros por query string
- criacao por `POST /admin/users`
- edicao por `PATCH /admin/users/{userId}`
- ajuste manual de carteira por `POST /admin/wallets/{userId}/adjustments`

### Catalogo

- lista publicada por `GET /admin/catalog/services`
- publicacao parte da lista sincronizada de `GET /admin/supplier/services`
- criacao por `POST /admin/catalog/services`
- edicao por `PATCH /admin/catalog/services/{serviceId}`
- affiliate settings por `GET /admin/catalog/affiliate-settings` e `PATCH /admin/catalog/{serviceId}/affiliate-settings`

### Financeiro e pedidos

- `/admin/payments` lista e concilia pagamentos em lote e por item
- `/admin/orders` lista e sincroniza pedidos em lote e por item
- `/admin/transactions` mostra ledger e aplica ajuste manual

### Operacao de fornecedor

- `/admin/supplier` le providers, servicos sincronizados e logs
- ha mutacoes reais para refresh de providers e sync de servicos
- o sync de servicos so envia `{}` ou `supplierName` nas chaves aceitas pelo backend: `cheapsmmglobal` e `instabarato`

### Alertas, auditoria e afiliados

- `/admin/alerts` lista e resolve alertas
- `/admin/audits` e leitura
- `/admin/affiliates` aprova e suspende perfis
- `/admin/affiliate-commissions` e leitura financeira, com selecao guiada de comissoes `approved` sem `payoutId` para iniciar payout de um unico `affiliateProfileId`
- `/admin/affiliate-payouts` lista, registra a solicitacao inicial do payout por `affiliateProfileId`, `commissionIds` e `notes`, aceita pre-selecao por query params vinda das comissoes e permite avancar `requested -> processing` por `POST /admin/affiliate-payouts/{payoutId}/status`, disparando PIX real via Asaas; payouts em `processing` podem ser reconciliados por `POST /admin/affiliate-payouts/{payoutId}/refresh`

## UX Direction That Already Exists In Code

- shells separados para publico, cliente e admin
- status assincronos, indisponibilidade e bloqueios do backend aparecem na UI
- detalhes de pagamento e pedido do cliente foram absorvidos em drawers para reduzir troca de rota
- o admin prioriza densidade de tabela, filtros por URL e mutacoes inline/drawer
- o catalogo publico traduz disponibilidade do fornecedor em UX explicita: compravel, degradado compravel ou checkout bloqueado

## Shared Visual Foundation

- a base compartilhada vive principalmente em `src/app/globals.css`, sem criar uma camada paralela de styling
- a direcao atual da foundation foi simplificada para um dark premium mais silencioso: menos gradiente, menos brilho, menos copy estrutural e menos ornamento
- `PageHeader`, `EmptyState`, `ErrorState`, `StatusBadge`, tabelas, drawers, shells, cards, botoes e inputs compartilham o mesmo sistema de superficie plana, contraste alto e acao clara
- publico, cliente e admin continuam com shells diferentes, mas agora puxam da mesma fundacao visual para evitar drift entre modulos
- a fundacao foi redesenhada sem mudar contratos, guards, redirects ou o modelo atual de drawers

## Customer Shell And Dashboard

- o shell autenticado do cliente em `/app` agora usa navegacao lateral mais forte, topo com contexto da area atual e branding alinhado a Pokelike
- a navegacao do cliente preserva as mesmas rotas, links, guards e comportamento mobile/tablet; a mudanca ficou concentrada em apresentacao e hierarquia visual
- o dashboard `/app` foi reorganizado como painel central: saldo, prioridade atual, atalhos, referral e afiliados aparecem antes das tabelas de historico
- wrappers reutilizaveis do cliente foram introduzidos em `src/components/ui/customer-surfaces.tsx` para sustentar as proximas paginas internas sem abrir uma camada paralela ao design system

## Admin Shell And Dashboard

- o shell administrativo em `/admin` agora usa o mesmo eixo premium da Pokelike, mas com acabamento mais sobrio e mais denso do que a area publica e a area do cliente
- a navegacao do admin preserva as rotas e o comportamento atual, mas ganhou metadados por modulo, estado ativo mais forte e branding proprio em `Pokelike Ops`
- o dashboard `/admin` foi reorganizado como central operacional: prioridades, metricas, atalhos, alertas e saude de fornecedores aparecem em blocos compactos e orientados a acao
- wrappers reutilizaveis do admin foram introduzidos em `src/components/ui/admin-surfaces.tsx` para apoiar as proximas ondas dos modulos administrativos
- a base visual do admin agora tambem reforca tabela, toolbar e drawer sem remover filtros, mutacoes, densidade ou o modelo atual de listagem + sideover

## Admin Operational Modules

- `users`, `catalog`, `payments`, `orders`, `supplier`, `alerts`, `audits`, `transactions`, `affiliates`, `affiliate-commissions` e `affiliate-payouts` agora herdam a mesma linguagem visual administrativa
- as telas de lista passaram a usar seções operacionais mais claras ao redor de tabelas e paginação, sem abandonar os filtros por query string
- drawers e formulários administrativos ganharam contexto curto, blocos internos mais legíveis e acabamento mais consistente para mutações reais
- detalhes dedicados de pedidos e pagamentos agora seguem a mesma hierarquia visual do dashboard admin, com métricas, blocos contextuais e timeline/eventos mais claros

## Customer Internal Pages

- `/app/profile`, `/app/wallet`, `/app/payments`, `/app/orders` e `/app/affiliate` agora herdam a mesma linguagem premium do shell e do dashboard, com foco em leitura rapida, status e proximas acoes
- pagamentos e pedidos mantiveram o modelo atual de listagem + drawer; o redesign ficou concentrado na hierarquia visual, nos blocos de contexto e na leitura de estados financeiros/transacionais
- perfil e afiliados agora priorizam status da conta, identidade fiscal, referral e comissoes sem reabrir escopo de email editavel, limpeza explicita de telefone ou mudancas contratuais

## Public Shell

- a area publica agora usa um shell compartilhado dedicado com header sticky, footer e menu mobile
- landing, catalogo publico, detalhe de servico, login, cadastro e verify-email herdam o mesmo branding e a mesma navegacao publica
- o shell publico preserva os fluxos existentes de `/login`, `/register`, `/catalog`, `returnTo`, `?ref=` e `?aff=`; a mudanca foi apenas visual e estrutural na camada de apresentacao
- a landing principal em `/` agora foi reduzida a hero, como funciona, categorias e CTA final
- a home continua ancorada nos fluxos reais do produto: explorar catalogo, criar conta, recarregar por Pix e acompanhar pedidos na area autenticada

## Current Limitations

- troca de email do cliente ainda nao foi entregue
- a UI do cliente nao oferece remocao explicita de telefone; enviar vazio hoje nao limpa o campo existente
- o payout admin segue o contrato atual do backend com `affiliateProfileId`, `commissionIds`, `notes`, `pixKey`, campos de provider/auditoria Asaas, `statusReason` e timestamps de ciclo; a wallet interna nao participa do fluxo; a selecao guiada no admin apenas preenche o mesmo formulario contratual
- o `affiliateCode` salvo por `?aff=` ainda nao tem politica automatica de expiracao, mas a UI permite limpeza manual explicita
- o admin nao expoe acao dedicada para reativar afiliado suspenso

## Testing Baseline

- `npm run typecheck`
- `npm run build`
- `npm run test`
- `npm run test:e2e`

Ja existe base de testes unitarios e Playwright; a documentacao nao deve tratar qualidade como ausente.
