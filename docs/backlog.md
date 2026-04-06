# Frontend Backlog

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
- [ ] refinamento visual das telas publicas com base final do Stitch

## Phase 3: Wallet and PIX

Tasks:

- [x] saldo
- [x] extrato
- [x] criar PIX
- [x] acompanhar status do PIX na listagem existente
- [x] detalhe do pagamento PIX

## Phase 4: Orders

Tasks:

- [x] checkout
- [x] meus pedidos
- [x] detalhe do pedido

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

## Phase 6: Customer Profile

Tasks:

- [x] criar rota de perfil do cliente consumindo `GET /me`
- [x] adicionar card de referral com `GET /me/referral`, botoes de copia e CTA de verificacao de email
- [ ] habilitar edicao de perfil quando o contrato local descrever o payload de `PATCH /me`

## Phase 7: Customer Visual Polish

Tasks:

- [x] refinar dashboard do cliente com hero operacional e atalhos de fluxo
- [x] destacar status de referral diretamente no dashboard do cliente
- [x] refinar carteira, pagamentos, pedidos e perfil com cards de contexto e hierarquia mais forte
- [x] aprofundar polish dos detalhes de pedido e pagamento do cliente
- [x] mover os detalhes de pagamentos e pedidos do cliente para drawers laterais nas proprias listagens

## Phase 8: Public Visual Polish

Tasks:

- [x] refinar home publica com hero mais forte e cards de jornada
- [x] refinar catalogo publico com resumo de availability e toolbar expandida
- [x] refinar detalhe de servico com destaque de preco, disponibilidade e checkout
- [x] realinhar a linguagem visual publica com a referencia dominante do Stitch

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
- [ ] ampliar cobertura E2E para operacoes admin e cenarios negativos

## Next Recommended Step

Na proxima sessao do Codex:

- revisar o novo fluxo de referral e verificacao de email com backend real, incluindo `previewToken` em ambiente local
- decidir se o fluxo de referral tambem precisa de destaque adicional fora de `/app` e `/app/profile`
- consolidar a massa de dados e as credenciais do ambiente E2E para execucao reproduzivel
- ampliar a cobertura E2E para operacoes admin e cenarios negativos
- habilitar edicao de perfil do cliente quando o contrato local descrever o payload de `PATCH /me`
