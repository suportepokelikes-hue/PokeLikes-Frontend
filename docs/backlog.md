# Frontend Backlog

## Latest Update

- [x] detalhe publico de `/catalog/[serviceId]` agora funciona como um card unico de produto + checkout, com resumo e compra no mesmo bloco responsivo sem duplicar nome, badge ou CTA
- [x] detalhe publico de `/catalog/[serviceId]` foi drasticamente simplificado para foco em compra: saiu exposicao de origem/fornecedor, boxes inferiores e campos avancados do checkout, preservando o fluxo de pedido
- [x] dashboard do cliente agora destaca `Proximo passo recomendado` no hero usando a logica existente de prioridade e reforca o estado do referral sem mudar contratos nem backend
- [x] `/app/affiliate` agora destaca um bloco de divulgacao com codigo publico, link `/catalog?aff=...` e acoes de copiar, deixando mais claro o proximo passo do afiliado sem mudar backend nem payout
- [x] `/app/orders` e `/app/payments` agora aceitam paginação simples por query string, preservando `orderId` e `paymentId` ao navegar entre páginas sem mudar backend nem filtros
- [x] checkout de `/catalog/[serviceId]` foi simplificado sem mexer no payload: servico, quantidade, link e codigo de afiliado ficaram no fluxo principal; campos tecnicos opcionais passaram para a secao `Configuracoes avancadas`
- [x] checkout de `/catalog/[serviceId]` ganhou resumo cirurgico antes do pedido com preco, faixa de quantidade, aviso de cobranca por quantidade e saldo da carteira quando o cliente esta autenticado, sem mudar `createOrderAction` nem contrato da API
- [x] checklist de smoke test de staging para rollout de afiliados foi consolidado em `docs/checklists/affiliate-rollout-smoke.md`, encurtando a ordem manual de validacao cliente/admin sem mudar regra de negocio
- [x] E2E de afiliados ganhou cobertura minima dos fluxos principais: captura `?aff=` e reaproveitamento no checkout, leitura de `/app/affiliate` com PIX, fluxo guiado de payout por comissoes aprovadas e visibilidade de `requested -> processing`/refresh manual no admin
- [x] `/admin/affiliate-payouts` agora destaca payouts problemáticos sem mudar fluxo: `processing` com mais de 30 minutos sem sync do provider recebe alerta discreto, erros/status falhos do provider ficam em destaque e o refresh manual segue como fallback operacional
- [x] `/admin/affiliate-commissions` agora permite selecionar comissoes aprovadas sem payout, bloqueando mistura entre afiliados na UI e abrindo `/admin/affiliate-payouts` com o drawer preenchido por `affiliateProfileId` e `commissionIds`
- [x] `/admin/affiliate-payouts` preserva o formulario manual e passou a aceitar pre-selecao por query params para o fluxo guiado iniciado na lista de comissoes
- [x] `/admin/affiliate-payouts` ganhou acabamento operacional pos-webhook Asaas: status em `processing` diferencia aguardando retorno automatico, sync do provider mostra timestamp de `providerSyncedAt` e refresh manual ficou descrito como fallback
- [x] admin payouts foi adaptado para payout PIX real via Asaas: `requested -> processing` usa a mutation de status e `processing` ganhou refresh manual por `POST /admin/affiliate-payouts/{payoutId}/refresh`
- [x] contratos/tipos/normalizacao de payouts passaram a carregar auditoria do provider: `provider`, `externalReference`, `providerTransactionId`, `providerStatus`, `providerErrorCode`, `providerErrorMessage` e `providerSyncedAt`
- [x] `/admin/affiliate-payouts` agora deixa explicito que a wallet interna nao participa, mostra chave PIX, timestamps de ciclo, motivo/status e erro operacional do provider sem redesenhar a tela
- [x] frontend de afiliados foi reconciliado com o OpenAPI atual do backend: `/app/affiliate` passou a usar `GET/PATCH /me/affiliate/pix-key`
- [x] admin payouts agora normaliza `pixKey`, `statusReason`, `requestedAt`, `processingAt`, `paidAt`, `failedAt` e `cancelledAt`
- [x] `/admin/affiliate-payouts` passou a operar mudanca de status por `POST /admin/affiliate-payouts/{payoutId}/status`
- [x] `/app/affiliate` ganhou leitura e edicao minima de chave PIX para payout de afiliado, com aviso claro quando a chave ainda esta pendente
- [x] admin payouts passou a reforcar estados operacionais reais (`requested`, `processing`, `paid`, `failed`, `cancelled`)
- [x] afiliados foram ajustados para a regra de comissao como percentual sobre o valor da venda, com copy explicita em `/app/affiliate`, admin commissions, admin payouts e configuracao de afiliacao no catalogo
- [x] payout admin foi reconciliado com o `docs/api/openapi.yaml` atual: `affiliateProfileId`, `commissionIds` e `notes`
- [x] fluxo atual de afiliados no cliente foi endurecido sem mudar regra de negocio: entradas operacionais agora apontam para `/app/affiliate`, anchors quebradas `#indicacoes` sairam da UX, catalogo/checkout exibem `affiliateCode` ativo com limpeza manual e `/app/affiliate` degrada parcialmente quando summary ou comissoes falham
- [x] integracao de afiliados foi ajustada para o backend atual com fallback entre `affiliateCode` e `publicCode`, leitura defensiva de perfil/summary/comissoes/payouts e payload de payout admin baseado no contrato validado
- [x] landing publica recebeu ajuste fino para ficar mais proxima dos prints de referencia, com hero mais comercial, navbar por ancoras, faixa de stats azul/roxo e fallback visual para o mascote ausente
- [x] rodada ampla de simplificacao visual concluida em foundation, shells, auth, landing, dashboards e superficies principais
- [x] headers, section cards e quick links deixaram de puxar descricao por padrao; a leitura agora prioriza titulo, dado e acao
- [x] shell publico, shell autenticado e auth ficaram mais silenciosos, com menos contexto institucional e menos camadas visuais
- [x] landing publica foi reduzida a hero, como funciona, categorias e CTA final
- [x] dashboard cliente, wallet, payments, orders, profile e affiliate foram compactados para leitura funcional direta
- [x] dashboard admin, catalogo e fornecedores ficaram mais secos, com menos competencia entre blocos
- [x] Onda 4B do redesign concluida nos modulos operacionais do admin
- [x] users, catalog, payments, orders, supplier, alerts, audits, transactions, affiliates, commissions e payouts agora herdam a mesma linguagem visual administrativa
- [x] listas, filtros, tabelas, drawers e detalhes ganharam hierarquia mais clara sem perder densidade nem query string
- [x] formularios e drawers administrativos receberam contexto curto e mais confianca visual para mutacoes reais
- [x] Onda 4A do redesign concluida no shell administrativo e no dashboard `/admin`
- [x] o admin agora herda uma base visual propria da Pokelike, mais sobria e operacional, sem perder densidade
- [x] sidebar/topbar do admin ganharam branding mais forte, estado ativo mais claro e contexto melhor de navegacao
- [x] o dashboard `/admin` foi refeito como central de operacao com prioridades, metricas, atalhos, alertas e saude de fornecedores
- [x] wrappers reutilizaveis do admin foram adicionados em `src/components/ui/admin-surfaces.tsx` para sustentar as proximas ondas dos modulos administrativos
- [x] Onda 3B do redesign concluida nas paginas internas principais do cliente: `/app/profile`, `/app/wallet`, `/app/payments`, `/app/orders` e `/app/affiliate`
- [x] profile, wallet, payments, orders e affiliate agora herdam a base premium da Pokelike com mais foco em status, contexto e proximas acoes
- [x] os drawers e estados criticos de pagamentos e pedidos foram preservados, mas ganharam hierarquia visual mais forte
- [x] referral, fluxo de afiliados e identidade fiscal do cliente passaram a ter apresentacao mais clara e mais acionavel
- [x] Onda 3A do redesign concluida no shell autenticado do cliente e no dashboard `/app`
- [x] a area interna do cliente ganhou sidebar/topbar mais premium, com branding Pokelike, estado ativo mais forte e melhor leitura de contexto
- [x] o dashboard `/app` foi refeito como painel central com prioridade atual, atalhos, metricas, referral/afiliados e tabelas recentes
- [x] wrappers reutilizaveis do cliente foram adicionados em `src/components/ui/customer-surfaces.tsx` para sustentar a proxima rodada das paginas internas
- [x] landing `/` recebeu uma segunda rodada de redesign focada em estrutura comercial mais padrao, com hero mais forte e composicao visual mais aspiracional
- [x] a home ficou mais proxima de um template premium moderno, com menos texto e mais peso em mockup, camadas e elementos flutuantes
- [x] shell publico foi preservado e a reestruturacao ficou concentrada em `public-home.tsx` e nos estilos da landing em `globals.css`
- [x] home `/` passou por uma rodada focada de simplificacao editorial para reduzir densidade, explicacao e tom de documentacao
- [x] hero, beneficios, FAQ e CTA final ficaram mais curtos e mais comerciais, preservando a direcao visual ja concluida
- [x] shell publico teve microajustes de branding para manter a leitura publica mais direta e coerente com Pokelike
- [x] rodada de saneamento documental concluida em `README.md`, `docs/README.md`, `docs/architecture.md`, `docs/screen-map.md` e `docs/handoff.md`
- [x] documentacao principal voltou a refletir o frontend real em vez do bootstrap inicial
- [x] rotas com drawer/redirect, afiliados, verify-email, mutacoes admin e limitacoes reais ficaram explicitadas
- [x] Onda 1A do redesign visual concluida na foundation compartilhada, com nova base dark premium e CTA amarelo preservando fluxos existentes
- [x] `globals.css` passou a centralizar a nova linguagem visual compartilhada entre publico, cliente e admin
- [x] componentes base de header, feedback, badge, drawer, tabela, botoes e inputs foram realinhados para a nova direcao Pokelike
- [x] Onda 1B do redesign visual concluida no shell publico, com header sticky, footer premium, wrappers publicos e menu mobile compartilhado
- [x] Onda 2 do redesign concluida na landing `/`, com nova home comercial da Pokelike ligada aos fluxos reais de catalogo, Pix, conta e pedidos

## Current State

O repositorio agora possui foundation funcional, auth operacional, design system interno e primeiras areas reais conectadas a API.

Ja existe:

- `AGENTS.md`
- `docs/`
- contrato local do backend em `docs/contracts/backend-openapi.yaml`
- layout base do app
- middleware de protecao para `/app` e `/admin`
- camada inicial de API/auth em `src/lib/api` e `src/lib/auth`
- shells separados para area publica, cliente e admin
- design system reutilizavel em `src/components/ui`
- catalogo publico real
- dashboards e listas iniciais reais para cliente e admin

## Recommended Execution Order

1. foundation do app
2. API client e sessao
3. auth screens
4. catalogo publico
5. wallet e PIX
6. checkout e pedidos do cliente
7. dashboard admin
8. telas operacionais admin

## Phase 0: Frontend Foundation

Goal:

- preparar shell do app, layout raiz, tema base, ambiente e camada de integracao

Tasks:

- [x] definir layout base
- [x] definir tokens visuais iniciais
- [x] criar API client
- [x] criar camada de sessao/auth
- [x] preparar roteamento das areas publica, cliente e admin
- [x] criar telas operacionais de login e registro
- [x] criar handlers de mutacao de sessao para UI

## Phase 1: Auth

Tasks:

- [x] login
- [x] registro
- [x] refresh/session bootstrap
- [x] guardas de rota
- [x] refinar tratamento visual de erro, loading e feedback de auth para teste manual pela UI
- [x] adicionar estados de logout expirado e retorno para rota de origem
- [x] capturar `?ref=` no cadastro e enviar `referralCode` ao backend
- [x] adicionar request e confirmacao de verificacao de email

## Phase 2: Public Catalog

Tasks:

- [x] listagem publica
- [x] detalhe do servico
- [x] estados de availability
- [x] reforcar a UX de indisponibilidade e degradacao no catalogo e no detalhe, com copy orientada a acao e CTA coerentes por estado
- [ ] refinamento visual das telas publicas com base final do Stitch

## Phase 3: Wallet and PIX

Tasks:

- [x] saldo
- [x] extrato
- [x] criar PIX
- [x] acompanhar status do PIX na listagem existente
- [x] detalhe do pagamento PIX
- [x] renderizar QR code por `brCodeBase64` com copia de `brCode` e refresh de status
- [x] reduzir o ruido de UX em `/app/payments`, priorizando o PIX em aberto e removendo um redirecionamento desnecessario
- [x] adaptar `/app/payments` para a exigencia de identidade fiscal real, com aviso preventivo, CTA para perfil e tratamento explicito de `USER_FISCAL_IDENTITY_REQUIRED`

## Phase 4: Orders

Tasks:

- [x] checkout
- [x] meus pedidos
- [x] detalhe do pedido
- [x] capturar `?aff=` no catalogo, persistir o codigo localmente e enviar `affiliateCode` opcional no checkout do pedido sem interferir no fluxo existente de `?ref=`
- [x] consolidar a regra da V1 para `?aff=`: o ultimo codigo valido substitui o armazenado; navegar sem `?aff=` nao limpa automaticamente

## Phase 5: Admin

Tasks:

- [x] dashboard
- [x] users
- [x] catalog
- [x] payments
- [x] orders
- [x] supplier
- [x] alerts
- [x] audits
- [x] transactions
- [x] affiliates com listagem, filtro basico e acoes de aprovar/suspender em `/admin/affiliates`
- [x] affiliate commissions e affiliate payouts com registro minimo em `/admin/affiliate-commissions` e `/admin/affiliate-payouts`, usando `commissionIds` como payload real do contrato local
- [x] integrar a configuracao de afiliabilidade por servico dentro de `/admin/catalog`, com leitura complementar e drawer minimo para editar status e percentual humano sem criar um modulo separado
- [x] adicionar mutacoes operacionais iniciais no admin para resolve de alertas e refresh/sync de fornecedores
- [x] expandir mutacoes operacionais reais no admin para conciliacao e sync de pedidos/pagamentos
- [x] abrir drill-down administrativo para detalhe de pagamento e pedido
- [x] aprofundar filtros e paginacao navegavel nas listas administrativas
- [x] habilitar criacao e edicao operacional de usuarios em `/admin/users`
- [x] habilitar criacao e edicao operacional de servicos em `/admin/catalog`
- [x] integrar ajuste manual de carteira em `/admin/transactions`
- [x] abrir detalhes dedicados para usuarios e catalogo no admin para reduzir densidade das listas
- [x] mudar o fluxo de criacao do catalogo admin para partir de `SupplierService` sincronizado em vez de preenchimento manual completo
- [x] tornar o ajuste manual de carteira mais explicito na UI e remover o checkbox de limpar telefone da edicao de usuario
- [x] simplificar ainda mais o ajuste manual de carteira derivando o tipo automaticamente pela direcao da operacao
- [x] travar o `userId` no ajuste manual quando o fluxo ja estiver dentro do detalhe de um usuario
- [x] mover a criacao de usuario em `/admin/users` para um drawer acionado por botao, priorizando a listagem
- [x] mover tambem a edicao de usuario e o ajuste manual de carteira para drawer lateral na propria listagem
- [x] substituir a sidebar empilhada no topo em tablet/mobile por menu lateral recolhivel via botao
- [x] corrigir a sobreposicao dos drawers sobre o header sticky e reforcar a responsividade transversal das toolbars de filtro
- [x] remover o chip redundante de usuario do topo do shell autenticado
- [x] simplificar os filtros do catalogo admin para busca textual ampla e selecao de fornecedor
- [x] mover a criacao de servico no catalogo admin para drawer lateral e remover o seletor de pagina dessa tela
- [x] mover tambem a edicao do catalogo publicado para drawer lateral na propria listagem
- [x] reduzir o formulario do catalogo admin aos campos publicos principais e transformar rede social em selecao fechada
- [x] devolver no drawer do catalogo a visibilidade dos dados herdados do servico sincronizado em modo somente leitura
- [x] mover o ajuste manual de carteira em `/admin/transactions` para drawer lateral e limpar a copy da tela
- [x] corrigir o payload do sync de servicos do fornecedor para usar apenas as chaves exatas suportadas pelo backend
- [x] compactar o admin para reduzir descricoes longas, panel-meta redundante e drawers excessivamente explicativos, mantendo filtros, estado e acoes intactos

## Phase 6: Customer Profile

Tasks:

- [x] criar rota de perfil do cliente consumindo `GET /me`
- [x] adicionar card de referral com `GET /me/referral`, botoes de copia e CTA de verificacao de email
- [x] criar `/app/affiliate` com tratamento de `AffiliateProfile = null`, apply, status do perfil, summary, listagem das comissoes do usuario e entrada dedicada no shell do cliente
- [x] preparar o drawer de edicao em `/app/profile` com campos de nome/telefone, email somente leitura e bloqueio isolado enquanto `PATCH /me` seguir sem schema formal
- [x] habilitar edicao real de perfil com `PATCH /me`, feedback inline e retorno para a leitura atualizada
- [x] expor `taxId` e `fiscalProfile` no perfil do cliente, com CTA explicito quando faltar CPF/CNPJ para PIX

## Affiliate V1 Checkpoint

Pronto na V1:

- [x] `/app/affiliate` cobre entrada no programa, apply, status do perfil, summary e comissoes do usuario
- [x] `/app/affiliate` agora mostra e permite atualizar chave PIX de payout do afiliado
- [x] o shell do cliente expoe `Afiliados`, e o shell admin e a home admin apontam para os modulos administrativos de afiliados
- [x] `?aff=` e capturado em `/catalog` e `/catalog/[serviceId]`, o codigo fica persistido localmente e `affiliateCode` segue para `POST /me/orders` quando existir
- [x] a regra atual do `affiliateCode` ficou explicita: um novo `?aff=` valido substitui o codigo salvo; navegar sem `?aff=` nao limpa o valor na V1
- [x] catalogo e checkout agora mostram explicitamente quando o `affiliateCode` esta ativo e permitem limpar o valor persistido sem mudar a atribuicao atual
- [x] dashboard e perfil do cliente deixaram de apontar para `#indicacoes`; a entrada do usuario no programa ficou consolidada em `/app/affiliate`
- [x] `/app/affiliate` agora preserva perfil/status quando summary ou comissoes falham isoladamente
- [x] o fluxo novo de afiliados permanece separado do `?ref=`/`referralCode` ja existente no cadastro
- [x] `/admin/affiliates`, `/admin/affiliate-commissions` e `/admin/affiliate-payouts` estao entregues contra `docs/contracts/backend-openapi.yaml`
- [x] o payout admin segue o contrato validado atual, com `commissionIds`, auditoria Asaas e refresh do provider
- [x] `/admin/catalog` ja incorpora affiliate settings por leitura complementar e drawer lateral no mesmo modulo operacional

Fora de escopo da V1:

- politica de expiracao automatica do `affiliateCode` persistido
- ampliacao de E2E para toda a jornada publica/admin de afiliados
- evolucao contratual para vinculo dedicado entre payout e comissoes

## Phase 7: Customer Visual Polish

Tasks:

- [x] refinar dashboard do cliente com hero operacional e atalhos de fluxo
- [x] destacar status de referral diretamente no dashboard do cliente
- [x] refinar carteira, pagamentos, pedidos e perfil com cards de contexto e hierarquia mais forte
- [x] aprofundar polish dos detalhes de pedido e pagamento do cliente
- [x] mover os detalhes de pagamentos e pedidos do cliente para drawers laterais nas proprias listagens
- [x] compactar dashboard, perfil, afiliados, pagamentos, pedidos e carteira para reduzir copy redundante e deixar saldo, status e CTA mais escaneaveis

## Phase 8: Public Visual Polish

Tasks:

- [x] refinar home publica com hero mais forte e cards de jornada
- [x] refinar catalogo publico com resumo de availability e toolbar expandida
- [x] refinar detalhe de servico com destaque de preco, disponibilidade e checkout
- [x] realinhar a linguagem visual publica com a referencia dominante do Stitch
- [x] transformar a home publica em landing page comercial da plataforma
- [x] reduzir a copy e aproximar home, catalogo e detalhe do servico dos pontos de decisao, com menos narrativa e menos exposicao operacional do fornecedor na superficie principal

## Phase 8A: Shared Visual Redesign Foundation

Tasks:

- [x] auditar a base visual existente em publico, cliente e admin
- [x] consolidar tokens base de cor, superficie, borda, sombra, radius e foco em `src/app/globals.css`
- [x] migrar a foundation para eixo dark premium com CTA amarelo e acentos azul/roxo
- [x] revisar componentes compartilhados de header, feedback, badge, tabela, drawers, cards, botoes e inputs sem mudar comportamento
- [x] preparar a base reutilizavel para a proxima onda de redesign da landing e das paginas internas

## Phase 8B: Admin Visual Redesign

Tasks:

- [x] refinar shell administrativo com branding, navegacao e header mais fortes
- [x] redesenhar `/admin` como central operacional com prioridades, metricas e atalhos
- [x] introduzir wrappers reutilizaveis para superficies admin em `src/components/ui/admin-surfaces.tsx`
- [x] ajustar tabelas, toolbar e drawers do admin para um acabamento mais sobrio e denso
- [x] propagar a nova linguagem do admin para usuarios, catalogo, pagamentos, pedidos, fornecedores, alertas e transacoes
- [x] levar a mesma base para afiliados, comissoes e payouts
- [ ] revisar acabamento fino de responsividade, espacamento e pequenos ruídos textuais do admin

## Phase 8B: Public Shell Redesign

Tasks:

- [x] auditar header, footer e wrappers publicos existentes
- [x] criar shell publico compartilhado para landing, catalogo, detalhe, login, cadastro e verify-email
- [x] revisar navegacao publica com CTA primario de cadastro, CTA secundario de login e comportamento responsivo
- [x] consolidar footer publico enxuto e coerente com a nova identidade
- [x] preparar secoes e grids publicos reutilizaveis para a proxima onda da landing

## Phase 8C: Landing Redesign

Tasks:

- [x] redesenhar profundamente a hero da home com branding Pokelike, CTA primario cedo e composicao visual forte
- [x] reescrever a copy da home para explicar o que e a plataforma, para quem serve, como comecar e por que confiar
- [x] adicionar secoes de como funciona, beneficios, vitrine de plataformas, mockup de painel, FAQ e CTA final
- [x] manter a landing conectada ao shell publico e aos fluxos reais de `/catalog`, `/register` e area autenticada
- [x] reforcar responsividade mobile e hierarquia visual sem criar uma landing paralela ao app
- [x] condensar a copy da landing para uma leitura mais comercial, mais curta e mais escaneavel sem reabrir o redesign visual
- [x] aproximar a home da referencia premium aprovada com hero em duas colunas, mockup forte e mais composicao decorativa no eixo direito

## Phase 9: Shared State Polish

Tasks:

- [x] refinar componentes compartilhados de empty/error
- [x] adicionar loading segmentado para a area do cliente
- [x] realinhar shell, tipografia e superficies compartilhadas para reduzir o visual generico e aproximar o frontend dos exports do Stitch
- [x] ajustar microdetalhes de spacing, iconografia e responsividade sem mexer em fluxo
- [x] integrar a logo real da marca nos pontos principais de branding do frontend
- [x] substituir a iconografia provisoria do shell por um conjunto real com `lucide-react`
- [x] expandir a iconografia real para estados compartilhados e cards/jornadas principais
- [x] simplificar a copy das telas principais para remover linguagem tecnica, redundancia e rotulos internos de sistema
- [x] reorganizar hierarquia, CTA e traducao de labels tecnicos nas jornadas principais
- [x] compactar `PageHeader`, `EmptyState`, `ErrorState`, `StatCard`, `AdminSlideOver` e o topo do shell autenticado para reduzir ruido textual e densidade sem mexer em fluxo
- [x] fazer um passe final leve de consistencia textual e visual, removendo descricoes curtas redundantes, labels mistos PT/EN e estados vazios mais verbosos nas areas publica, cliente e admin
- [x] fechar a rodada final de hardening da V1 reforcando a precedencia de `docs/contracts/backend-openapi.yaml`, limpando residuos de copy em afiliados e fixando a regra operacional do `affiliateCode`
- [x] fortalecer a leitura publica de availability para transformar indisponibilidade/degradacao do fornecedor em orientacao clara de continuidade, sem mascarar bloqueios reais de checkout

## Phase 10: Frontend Test Baseline

Tasks:

- [x] adicionar script `npm run test` sem dependencia extra
- [x] cobrir utilitarios criticos de auth/navigation
- [x] cobrir parsing de filtros e serializacao admin
- [x] cobrir sessao e camada HTTP base da API
- [x] cobrir helpers extraidos de server actions de auth e admin
- [x] cobrir camada customer API e helpers das mutacoes PIX/pedido
- [x] cobrir componentes UI base do design system com renderizacao server-side
- [x] cobrir configuracao de conteudo das telas de login e cadastro
- [x] cobrir campos puros do formulario transacional do cliente
- [x] cobrir camada auth API
- [x] cobrir a composicao configuravel do `AuthForm`
- [x] cobrir a composicao configuravel do `TransactionForm`
- [x] cobrir a composicao configuravel dos wrappers client restantes (`AdminActionForm`, `LogoutButton` e `AreaShell`)

## Phase 11: E2E

Tasks:

- [x] adicionar infraestrutura Playwright com scripts e config local
- [x] preparar helpers de ambiente e auth para E2E
- [x] cobrir fluxos de maior valor: login cliente/admin, PIX e checkout por UI
- [x] cobrir cenarios negativos de auth e primeira operacao admin por UI
- [x] cobrir fluxos principais de afiliados: `?aff=`, `/app/affiliate`, payout guiado por comissoes e refresh/processamento admin
- [ ] ampliar cobertura E2E para operacoes admin e cenarios negativos

## Next Recommended Step

Na proxima sessao do Codex:

- executar o smoke test manual curto de `docs/checklists/affiliate-rollout-smoke.md` em staging com massa valida de afiliado/comprador/admin
- validar por fluxo manual ou E2E a jornada completa de payout admin via Asaas por `affiliateProfileId`, `commissionIds`, `notes`, `requested -> processing` e refresh do provider
- validar a landing publica com o asset final `public/brand/landing-mascot.png` e fazer ajuste fino de proporcao, contraste e espacamento do hero
- revisar tela a tela onde ainda vale remover copy residual em catalogo publico, detalhe de servico e modulos admin secundarios
- consolidar os pontos restantes onde o layout ainda depende demais de `globals.css`
- decidir se a proxima iteracao deve quebrar parte da fundacao monolitica em arquivos CSS por dominio sem reabrir o visual
- tratar shell, dashboard e paginas principais do cliente como onda concluida e fazer apenas ajustes finos de consistencia onde necessario
- decidir se a proxima iteracao visual relevante deve ir para auth/catalogo interno remanescente ou para o shell admin
- revisar se `customer-surfaces.tsx` precisa crescer com wrappers de tabela/lista especificos ou se a base atual ja cobre a area do cliente
- tratar shell e dashboard do cliente como base visual concluida para a area autenticada
- propagar os novos wrappers do cliente para `/app/profile`, `/app/wallet`, `/app/payments`, `/app/orders` e `/app/affiliate` sem reabrir fluxos
- revisar tela a tela onde ainda vale compactar listas, cabecalhos e cards da area do cliente agora que a nova linguagem-base existe
- tratar foundation, shell publico e landing como ondas concluidas e focar as proximas iteracoes nas paginas internas publicas e autenticadas
- revisar tela a tela onde a nova foundation pede pequenos ajustes locais de contraste, densidade ou hierarquia antes da onda das paginas internas
- tratar a V1 frontend de afiliados como encerrada e focar a proxima iteracao em qualidade e governanca
- revisar tela a tela onde ainda vale remover descricoes longas agora que os componentes compartilhados aceitam cabecalhos mais compactos
- revisar se alguns filtros publicos do catalogo merecem uma segunda rodada de simplificacao sem perder descobribilidade
- validar por E2E a diferenca de UX entre servico compravel, servico degradado compravel e servico com checkout bloqueado por availability
- cobrir em E2E a jornada `?aff= -> catalogo -> pedido`
- cobrir em E2E o drawer de affiliate settings em `/admin/catalog`
- cobrir em E2E o bloqueio de PIX sem CPF/CNPJ e a retomada do fluxo depois do preenchimento do perfil
- decidir se a V2 vai precisar de expiracao automatica do `affiliateCode` armazenado no navegador
- cobrir por teste de UI a limpeza manual do `affiliateCode` e a degradacao parcial de `/app/affiliate`
- resincronizar `docs/api/openapi.yaml` com `docs/contracts/backend-openapi.yaml`, especialmente na parte financeira de afiliados
- so depois revisitar uma eventual formalizacao de vinculo entre payout e comissoes, mantendo a separacao em relacao ao referral do usuario
- consolidar a massa de dados e as credenciais do ambiente E2E para execucao reproduzivel
- revisar se a proxima iteracao da conta vai precisar de politica dedicada para troca de email ou remocao explicita de telefone

- [x] ajustar a semantica de pedidos e alertas para o fluxo operacional atual de saldo do fornecedor
