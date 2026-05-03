# Screen Map

## Public

- `/`
  - landing comercial
  - usuario autenticado redireciona para sua area interna padrao
- `/login`
  - login com `returnTo`
- `/register`
  - cadastro com `returnTo`
  - aceita `?ref=` e envia `referralCode`
- `/verify-email`
  - confirma token vindo da URL
- `/catalog`
  - entrada legada
  - visitante vai para `/login?returnTo=/app/services`
  - customer vai para `/app/services`
  - admin vai para `/admin/catalog`
- `/catalog/[serviceId]`
  - entrada legada de detalhe
  - visitante vai para `/login?returnTo=/app/services/[serviceId]`
  - customer vai para `/app/services/[serviceId]`
  - admin vai para `/admin/catalog`

## Customer

- `/app`
  - redirect para `/app/services`
- `/app/services`
  - catalogo interno do cliente
  - lista vertical com filtros de busca, rede social, categoria e tipo
  - preserva `?aff=` quando presente
- `/app/new-order`
  - pedido rapido em tela unica
  - busca local opcional, filtro por categoria e seletor de servico
  - aceita pre-selecao por `serviceId`, `category` e `search` na query string
  - resumo do servico, validacao de faixa/disponibilidade e envio pelo mesmo `POST /me/orders`
  - preserva `?aff=` no envio
- `/app/services/[serviceId]`
  - redirect de compatibilidade para `/app/new-order`
  - preserva `?aff=` na navegacao
- `/app/profile`
  - leitura de perfil
  - referral e status de email
  - drawer de edicao por `?edit=1`
- `/app/affiliate`
  - rota mantida no shell do cliente
  - tela pausada com `Programa de afiliados` e destaque `Em breve`
  - sem apply, PIX, comissoes ou link de divulgacao
- `/app/wallet`
  - saldo e extrato
- `/app/payments`
  - listagem
  - criacao de PIX
  - formulario de PIX disponivel sempre que nao houver cobranca pendente
  - drawer de detalhe por `?paymentId=`
- `/app/payments/[paymentId]`
  - apenas redirect para `/app/payments?paymentId=...`
- `/app/orders`
  - listagem
  - drawer de detalhe por `?orderId=`
- `/app/orders/[orderId]`
  - apenas redirect para `/app/orders?orderId=...`

## Admin

- `/admin`
  - dashboard e atalhos operacionais
- `/admin/users`
  - listagem
  - drawer de criacao por `?create=1`
  - drawer de edicao por `?editUserId=...`
  - drawer de ajuste de carteira dentro da edicao
- `/admin/users/[userId]`
  - apenas redirect para `/admin/users?editUserId=...`
- `/admin/affiliates`
  - listagem e acoes de aprovar/suspender
- `/admin/affiliate-commissions`
  - leitura financeira
  - selecao de comissoes aprovadas sem payout para iniciar payout guiado de um unico afiliado
- `/admin/affiliate-payouts`
  - listagem
  - drawer de criacao por `?create=1`
  - aceita `affiliateProfileId` e `commissionIds` na query para preencher o drawer a partir das comissoes
  - `requested -> processing` dispara PIX real via Asaas
  - refresh manual do provider enquanto o payout esta `processing`
- `/admin/catalog`
  - listagem de servicos sincronizados
  - publicacao no catalogo por drawer
  - listagem de servicos publicados
  - drawer de edicao do servico publicado
  - drawer de affiliate settings
- `/admin/catalog/[serviceId]`
  - apenas redirect para `/admin/catalog?editServiceId=...`
- `/admin/payments`
  - listagem e conciliacao
- `/admin/payments/[paymentId]`
  - detalhe dedicado
- `/admin/orders`
  - listagem e sync
- `/admin/orders/[orderId]`
  - detalhe dedicado
- `/admin/supplier`
  - providers, servicos sincronizados e logs
- `/admin/alerts`
  - listagem e resolve
- `/admin/audits`
  - leitura
- `/admin/transactions`
  - ledger
  - drawer de ajuste manual por `?adjust=1`

## Notas operacionais

- o fluxo publico de afiliados usa `?aff=` e permanece separado de `?ref=` no cadastro
- o ultimo `?aff=` valido substitui o codigo salvo; navegar sem `?aff=` nao limpa o valor automaticamente
- o detalhe de pagamento e pedido do cliente foi absorvido pelas listagens
- usuarios e catalogo admin seguem o mesmo principio: leitura na lista, mutacao em drawer
