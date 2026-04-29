# Handoff Guide

## Mandatory Startup Routine

Toda nova sessao do Codex neste repositorio deve ler:

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/architecture.md`
4. `docs/backlog.md`
5. `docs/AGENTS.md`
6. `docs/handoff.md`
7. `docs/contracts/backend-openapi.yaml`

## O que estava desatualizado e foi corrigido

- `README.md` e `docs/README.md` ainda descreviam bootstrap inicial e diziam, na pratica, que as telas nao estavam implementadas
- a documentacao espalhada tratava varias superficies reais como futuras ou incompletas sem necessidade
- o papel de drawers e redirects nao estava consolidado como comportamento oficial
- havia risco de um novo agente subestimar afiliados, verify-email, mutacoes admin e o estado real de catalogo, checkout, pagamentos e pedidos

## Verdades operacionais atuais

- o frontend ja e funcional nas areas publica, cliente e admin
- `docs/contracts/backend-openapi.yaml` continua sendo a fonte contratual operacional
- `docs/api/openapi.yaml` continua auxiliar e nao deve guiar payloads divergentes
- `src/lib/api` e a fronteira unica com o backend
- o catalogo em `/catalog/services` e `/catalog/services/{serviceId}` agora deve ser tratado como endpoint autenticado quando usado pelas superficies internas; `/app/services` e o fallback do admin ja enviam `Bearer`
- `src/modules` concentra a maior parte da logica por dominio
- a foundation visual compartilhada agora e dark premium e vive principalmente em `src/app/globals.css`
- CTA principal amarelo, superficies escuras mais planas e componentes mais secos agora fazem parte da base oficial do app
- a area publica agora tambem tem shell compartilhado com header sticky, footer premium e menu mobile em `src/modules/app-shell/public-shell.tsx`
- a landing `/` agora tambem foi reduzida para hero, como funciona, categorias e CTA final, mantendo os fluxos reais de `/catalog`, cadastro, Pix e acompanhamento de pedidos
- headers, section cards e quick links deixaram de puxar descricao por padrao; a leitura prioriza titulo, dado e acao
- o shell autenticado do cliente em `/app` agora tambem foi redesenhado para a identidade Pokelike, com sidebar/topbar mais fortes e sem mudar links, guards, redirects ou comportamento responsivo
- o dashboard `/app` agora funciona como painel central do cliente, priorizando saldo, proximo passo, atalhos, referral/afiliados e historico recente
- `src/components/ui/customer-surfaces.tsx` concentra os novos wrappers visuais reutilizaveis da area interna do cliente
- `/app/profile`, `/app/wallet`, `/app/payments`, `/app/orders` e `/app/affiliate` agora tambem foram redesenhados com a mesma base premium, preservando os fluxos reais da V1
- pagamentos e pedidos continuam usando drawers e redirects atuais; a mudanca foi de hierarquia visual, contexto e clareza
- profile, referral e afiliados agora mostram status, identidade fiscal e ganhos com leitura mais rapida e mais orientada a acao
- o shell administrativo e o dashboard `/admin` agora tambem foram redesenhados para a identidade Pokelike, mas com tom mais sobrio e foco operacional
- `src/components/ui/admin-surfaces.tsx` passa a concentrar os wrappers visuais reutilizaveis do admin
- o dashboard administrativo agora funciona como central de operacao, priorizando alertas, fila, pagamentos e saude de fornecedores antes da navegacao secundaria
- os modulos operacionais do admin agora tambem herdaram essa base: listas, filtros, tabelas, drawers e detalhes ficaram mais consistentes sem mudar fluxos reais
- users, catalog, payments, orders, supplier, alerts, audits, transactions, affiliates, commissions e payouts ja podem ser tratados como superficies visuais estabilizadas do admin

## Superficies importantes que um novo agente precisa conhecer

### Publico

- landing em `/`
- `/` agora redireciona usuario autenticado para a area interna correspondente; a landing segue apenas para visitantes
- auth em `/login` e `/register`
- verify-email em `/verify-email`
- `/catalog` e `/catalog/[serviceId]` permanecem apenas como entradas legadas de redirecionamento
- captura de `?aff=` no catalogo publico

### Cliente

- `/app` agora so redireciona para `/app/services`
- catalogo interno em `/app/services` e detalhe em `/app/services/[serviceId]`
- perfil com drawer de edicao em `/app/profile?edit=1`
- afiliados em `/app/affiliate`
- `/app/affiliate` tambem expõe chave PIX de payout, com aviso quando o afiliado ainda nao cadastrou a chave
- wallet em `/app/wallet`
- PIX em `/app/payments`
- pedidos em `/app/orders`

### Admin

- usuarios com criacao, edicao e ajuste de carteira em drawers
- catalogo com publicacao via `SupplierService`, edicao e affiliate settings em drawers
- pagamentos com conciliacao
- pedidos com sync
- fornecedores com refresh e sync
- alertas com resolve
- transacoes com ajuste manual
- afiliados, comissoes e payouts

## Comportamentos de rota que nao devem ser "corrigidos" por engano

- `/app/payments/[paymentId]` redireciona para `/app/payments?paymentId=...`
- `/app/orders/[orderId]` redireciona para `/app/orders?orderId=...`
- `/admin/users/[userId]` redireciona para `/admin/users?editUserId=...`
- `/admin/catalog/[serviceId]` redireciona para `/admin/catalog?editServiceId=...`

Isso nao e drift acidental. Faz parte do desenho atual das jornadas.

## Limitacoes reais que devem continuar explicitas

- troca de email do cliente ainda nao existe na UI
- limpeza explicita de telefone do cliente ainda nao existe
- `affiliateCode` persistido por `?aff=` ainda nao tem expiracao automatica, mas a UI ja permite limpeza manual explicita
- payout admin de afiliados segue `affiliateProfileId`, `commissionIds` e `notes`; a UI registra a solicitacao inicial, mostra chave PIX, auditoria Asaas, motivo/status e timestamps reais, permite `requested -> processing` para disparar PIX real e oferece refresh do provider em `processing`; a wallet interna nao participa
- afiliados admin nao possuem acao dedicada de reativacao

## Proximo passo recomendado

- tratar a area autenticada do cliente como base visual estabilizada e revisar apenas ajustes finos de consistencia ou responsividade
- tratar shell, dashboard e modulos operacionais do admin como base visual estabilizada e focar a proxima rodada em acabamento fino
- revisar apenas ajustes pontuais de responsividade, copy curta e consistencia nos drawers restantes do admin
- usar `customer-surfaces.tsx` e `admin-surfaces.tsx` como bases oficiais antes de abrir novos wrappers ad hoc
- tratar foundation, shell publico e landing como base concluida antes de mexer nas proximas superficies
- revisar catalogo, detalhe do servico e auth para garantir que a nova identidade Pokelike esteja consistente em copy e acabamento visual
- decidir se a superficie publica vai ganhar um CTA real de suporte; hoje a landing nao deve inventar esse canal
- se a home for revisitada de novo, o proximo passo deve ser calibrar detalhes finos de espacamento e animacao, nao voltar a expandir copy
- manter a documentacao enxuta e aderente ao codigo daqui para frente, atualizando-a junto com qualquer mudanca de rota, superficie ou fluxo
- ampliar E2E dos fluxos que ainda carregam mais risco: `?aff= -> catalogo -> pedido`, affiliate settings em `/admin/catalog` e bloqueio de PIX sem CPF/CNPJ
