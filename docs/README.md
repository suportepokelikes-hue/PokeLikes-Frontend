# Likes Uai Frontend

Frontend web da plataforma Likes Uai.

Este repositório existe para entregar a experiência do:

- site público
- área do cliente autenticado
- painel administrativo

O backend já existe em um repositório separado e expõe a API V1 consumida por este frontend.

## Objetivo do frontend

Entregar uma interface clara e operacional para:

- registro e login
- wallet e recarga PIX
- navegação no catálogo
- criação e acompanhamento de pedidos
- operação admin de usuários, pagamentos, pedidos, fornecedores, alertas, auditoria e dashboard

## Estado inicial deste bootstrap

Este repositório foi inicializado com:

- stack base em Next.js + TypeScript
- estrutura inicial de `src/`
- documentação de bootstrap para agentes Codex
- cópia local do contrato OpenAPI do backend em `docs/contracts/backend-openapi.yaml`

Ainda não foi iniciada a implementação funcional das telas.

## Fonte contratual do backend

Usar como referência primária:

- `docs/contracts/backend-openapi.yaml`

Complementar com:

- `docs/api-notes.md`
- `docs/api/openapi.yaml`
- `docs/api/modules/auth.md`
- `docs/api/modules/referrals.md`
- `docs/screen-map.md`

## Ordem recomendada de implementação

1. fundação do app e sessão
2. auth
3. catálogo público
4. wallet e pagamentos PIX
5. checkout e pedidos do cliente
6. dashboard admin
7. telas operacionais admin
