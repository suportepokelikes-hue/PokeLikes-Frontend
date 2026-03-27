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
- ja existem `/catalog` e `/catalog/[serviceId]` conectados ao backend real
- ja existem `/app/wallet`, `/app/payments`, `/app/orders`, `/admin/users`, `/admin/payments` e `/admin/orders`
- `src/lib/api` centraliza o client HTTP e os endpoints iniciais de auth
- `src/lib/auth` centraliza leitura de sessao em cookies e guards server-side
- `src/middleware.ts` tenta refresh quando existe `refreshToken` sem sessao completa
- `src/components/ui` concentra o design system interno derivado do Stitch

## Expected First Implementation Step

- encaixar o design final das telas de auth e shells quando ele estiver disponivel
- implementar checkout, detalhe de pedido e criacao de PIX
- expandir admin para catalogo, fornecedores, alertas, auditoria e transacoes
- adicionar estados mais ricos de erro e retorno para auth/logout quando os designs finais chegarem


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
