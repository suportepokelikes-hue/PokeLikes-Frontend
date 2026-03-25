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
- `src/lib/api` centraliza o client HTTP e os endpoints iniciais de auth
- `src/lib/auth` centraliza leitura de sessao em cookies e guards server-side
- `src/middleware.ts` tenta refresh quando existe `refreshToken` sem sessao completa

## Expected First Implementation Step

- encaixar o design final das telas de auth e shells quando ele estiver disponivel
- iniciar catalogo publico e dashboards iniciais sobre os shells ja existentes
- adicionar estados mais ricos de erro e retorno para auth/logout
