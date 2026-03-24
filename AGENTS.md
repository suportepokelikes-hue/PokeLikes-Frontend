# AGENTS.md

## Objective

Frontend web da plataforma Instabarato, consumindo a API backend V1 já existente.

Este repositório deve construir:

- área pública
- autenticação de cliente e admin
- wallet e recarga PIX
- catálogo público
- checkout e pedidos do cliente
- área administrativa operacional

## Mandatory Context Bootstrap

Antes de propor mudanças, editar arquivos ou iniciar implementação, leia:

1. `docs/README.md`
2. `docs/architecture.md`
3. `docs/backlog.md`
4. `docs/AGENTS.md`
5. `docs/handoff.md`
6. `docs/contracts/backend-openapi.yaml`

Se houver novos arquivos em `docs/`, leia-os também antes de tomar decisões de arquitetura.

## Working Rules

- Preserve strict TypeScript direction.
- Use App Router do Next.js como direção padrão.
- Não invente contratos da API; use `docs/contracts/backend-openapi.yaml` e `docs/api-notes.md`.
- Separe claramente área pública, área autenticada do cliente e área admin.
- Não crie wrappers redundantes ou ad-hoc para a API se um client tipado/shared já resolver.
- Mantenha componentes pequenos e módulos por domínio.
- Não introduza dependências novas sem necessidade clara.
- Atualize docs/backlog sempre que a arquitetura, o fluxo de telas ou a ordem de implementação mudar.

## UI Rules

- Evite visual genérico e boilerplate.
- Preserve consistência visual entre área pública, cliente e admin, mas sem transformar tudo no mesmo layout.
- Não trate estados operacionais da API como detalhe secundário; alertas, availability e status são parte central da UX.
- Não esconda estados de erro e indisponibilidade do fornecedor/pagamento.

## Source of Truth

Frontend source of truth lives in:

- `docs/README.md`
- `docs/architecture.md`
- `docs/backlog.md`
- `docs/handoff.md`
- `docs/contracts/backend-openapi.yaml`

## Backlog Maintenance

`docs/backlog.md` é o log vivo de execução do frontend.

Ao final de trabalho substancial:

- atualize `docs/backlog.md`
- atualize `docs/architecture.md` se a arquitetura mudou
- registre o próximo passo recomendado

## Completion Checklist

Ao final de qualquer tarefa substancial:

1. rodar `typecheck` e `build` se já existirem no repo
2. mostrar arquivos alterados
3. resumir o que mudou
4. listar riscos restantes
5. dizer se `docs/` foi atualizado
