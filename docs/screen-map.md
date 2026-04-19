# Screen Map

## Public

- `/`
  - landing comercial
- `/login`
  - login com `returnTo`
- `/register`
  - cadastro com `returnTo`
  - aceita `?ref=` e envia `referralCode`
- `/verify-email`
  - confirma token vindo da URL
- `/catalog`
  - listagem publica real
  - captura `?aff=` e persiste o codigo no navegador
- `/catalog/[serviceId]`
  - detalhe publico real
  - mantem `?aff=` na navegacao quando presente
  - cria pedido autenticado por `POST /me/orders`

## Customer

- `/app`
  - dashboard do cliente
  - resume wallet, pagamentos, pedidos e referral
- `/app/profile`
  - leitura de perfil
  - referral e status de email
  - drawer de edicao por `?edit=1`
- `/app/affiliate`
  - entrada do programa quando nao existe perfil
  - status, summary e comissoes quando ja existe perfil
- `/app/wallet`
  - saldo e extrato
- `/app/payments`
  - listagem
  - criacao de PIX
  - bloqueio preventivo quando falta CPF/CNPJ
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
- `/admin/affiliate-payouts`
  - listagem
  - drawer de criacao por `?create=1`
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
