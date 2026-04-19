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
- `src/modules` concentra a maior parte da logica por dominio

## Superficies importantes que um novo agente precisa conhecer

### Publico

- landing em `/`
- auth em `/login` e `/register`
- verify-email em `/verify-email`
- catalogo em `/catalog` e `/catalog/[serviceId]`
- captura de `?aff=` no catalogo publico

### Cliente

- dashboard em `/app`
- perfil com drawer de edicao em `/app/profile?edit=1`
- afiliados em `/app/affiliate`
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
- `affiliateCode` persistido por `?aff=` ainda nao tem expiracao/limpeza automatica
- payout manual de afiliados ainda depende de `note` para rastrear IDs de comissao
- afiliados admin nao possuem acao dedicada de reativacao

## Proximo passo recomendado

- manter a documentacao enxuta e aderente ao codigo daqui para frente, atualizando-a junto com qualquer mudanca de rota, superficie ou fluxo
- ampliar E2E dos fluxos que ainda carregam mais risco: `?aff= -> catalogo -> pedido`, affiliate settings em `/admin/catalog` e bloqueio de PIX sem CPF/CNPJ
