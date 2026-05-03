# Frontend Overview

## Objetivo

Manter uma leitura curta e confiavel do estado atual do frontend Likes Uai para novos agentes Codex.

## O que ja existe no codigo

### Publico

- `/` como landing comercial
- `/login` e `/register` com server actions, `returnTo` e suporte a `?ref=`
- `/verify-email` confirmando token por URL
- `/catalog` e `/catalog/[serviceId]` conectados ao backend real
- captura de `?aff=` nas superficies publicas do catalogo, com persistencia local e reaproveito no checkout autenticado

### Cliente autenticado

- `/app` com dashboard e destaque de referral
- `/app/profile` com leitura de `GET /me`, resumo de referral e drawer de edicao por `PATCH /me`
- `/app/affiliate` cobrindo entrada no programa, status, summary e comissoes
- `/app/wallet` com saldo e extrato
- `/app/payments` com criacao de PIX, QR code, copia do codigo e detalhe em drawer
- `/app/orders` com listagem e detalhe em drawer

### Admin

- `/admin` com dashboard e atalhos operacionais
- `/admin/users` com criacao, edicao e ajuste manual de carteira em drawers
- `/admin/catalog` com publicacao a partir de `SupplierService`, edicao do servico publicado e drawer de affiliate settings
- `/admin/payments` com conciliacao em lote e por item
- `/admin/orders` com sync em lote e por item
- `/admin/supplier` com status de providers, servicos sincronizados e logs de sync
- `/admin/alerts` com resolve real
- `/admin/audits` como leitura
- `/admin/transactions` com ledger e ajuste manual de carteira
- `/admin/affiliates`, `/admin/affiliate-commissions` e `/admin/affiliate-payouts`

## Regras de leitura do repositorio

- codigo atual vence texto antigo
- `docs/contracts/backend-openapi.yaml` continua sendo a fonte contratual operacional
- `docs/api/openapi.yaml` fica apenas como copia auxiliar quando nao divergir
- drawers e redirects fazem parte do desenho atual da aplicacao e devem ser documentados como tal, nao como detalhe temporario

## Limitacoes atuais que devem permanecer explicitas

- troca de email do cliente ainda nao existe pela UI
- limpeza explicita de telefone do cliente ainda nao existe pela UI
- detalhe de usuario e detalhe de catalogo no admin nao sao paginas independentes; as rotas `[id]` redirecionam para drawers na listagem
- payout admin de afiliados segue o contrato atual do backend com `affiliateProfileId`, `commissionIds` e `notes`; `requested -> processing` dispara PIX real via Asaas e `POST /admin/affiliate-payouts/{payoutId}/refresh` reconcilia o provider
- a area admin de afiliados nao expoe acao de reativacao dedicada; hoje ha aprovar e suspender

## Onde olhar em seguida

- `docs/architecture.md` para entender fronteiras, shells e jornadas
- `docs/screen-map.md` para mapa de rotas e comportamento
- `docs/handoff.md` para resumo operacional da ultima rodada

## Ambiente publico relevante

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` habilita o fluxo `Continuar com Google` nas telas de login e cadastro
