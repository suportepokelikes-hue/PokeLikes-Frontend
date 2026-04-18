# Screen Map

## Public

- `/`
- `/login`
- `/register`
- `/verify-email`
- `/catalog` (captura `?aff=` nas superficies publicas do catalogo e preserva o codigo no navegador)
- `/catalog/[serviceId]` (mantem `?aff=` na navegacao publica e reaproveita `affiliateCode` no checkout autenticado quando existir)

Notas:

- o fluxo publico de afiliados usa `?aff=` e permanece separado do `?ref=`/`referralCode` do cadastro
- o ultimo `?aff=` valido capturado no catalogo substitui o codigo salvo no navegador; navegar sem `?aff=` nao limpa automaticamente na V1

## Customer

- `/app`
- `/app/affiliate` (entrada do programa quando `AffiliateProfile = null`; depois mostra status, summary e comissoes)
- `/app/profile` (tambem abre drawer de edicao por query string, salva nome/telefone/CPF-CNPJ por `PATCH /me`, mantem email protegido e explicita quando a identidade fiscal ainda bloqueia PIX)
- `/app/wallet`
- `/app/payments`
- `/app/payments/[paymentId]` (redireciona para drawer em `/app/payments`)
- `/app/orders`
- `/app/orders/[orderId]` (redireciona para drawer em `/app/orders`)

Notas:

- o shell do cliente ja possui entrada dedicada para `Afiliados`
- `/app/payments` faz pre-check de identidade fiscal carregando o perfil atual; quando faltar CPF/CNPJ, a tela troca o formulario por um bloqueio orientado a acao com CTA para `/app/profile?edit=1`

## Admin

- `/admin` (home admin com atalhos para os modulos de afiliados)
- `/admin/users`
- `/admin/users/[userId]`
- `/admin/affiliates`
- `/admin/affiliate-commissions`
- `/admin/affiliate-payouts`
- `/admin/catalog` (tambem concentra affiliate settings por leitura complementar e drawer lateral, sem tela separada)
- `/admin/catalog/[serviceId]` (redireciona para drawer em `/admin/catalog`)
- `/admin/payments`
- `/admin/payments/[paymentId]`
- `/admin/orders`
- `/admin/orders/[orderId]`
- `/admin/supplier`
- `/admin/alerts`
- `/admin/audits`
- `/admin/transactions`

Notas:

- o shell admin e a home admin ja apontam para `/admin/affiliates`, `/admin/affiliate-commissions` e `/admin/affiliate-payouts`
