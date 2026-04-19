Inconsistências visuais e de branding

A inconsistência mais clara é Pokelike x Likes Uai. Visualmente o frontend fala Pokelike, mas metadados e textos institucionais ainda falam Likes Uai em vários pontos:
src/app/layout.tsx, src/app/catalog/page.tsx, src/app/catalog/[serviceId]/page.tsx, src/app/login/page.tsx, src/app/register/page.tsx, src/app/verify-email/page.tsx

Também há pequena inconsistência de naming/posicionamento de marca entre:
Pokelike, Pokelike Ops, Nova identidade, Workspace do cliente, Console operacional, Minha conta, Admin. Isso não é grave, mas ainda passa um pouco de produto em transição em area-shell.tsx e area-shell-content.ts

Outro ponto: a landing está mais ousada e premium do que boa parte das páginas internas.
A área pública tem uma assinatura visual mais forte; já cliente e admin, embora bons, se apoiam mais em superfícies utilitárias repetidas. Ou seja: há coerência de cor e tokens, mas não a mesma potência de linguagem visual.

Fluxos que ainda merecem polimento

Pagamento PIX
É um dos fluxos mais importantes e melhorou bastante em customer-payments-page.tsx, com bloqueio por CPF/CNPJ, QR e copia e cola no drawer
Mas ainda há duas fricções:
o fluxo depende muito de leitura textual para entender “por que está bloqueado / o que falta / onde resolver / como voltar”, e
o detalhe principal do pagamento fica no drawer, quando poderia ter tratamento mais “modal central de tarefa” ou uma ênfase maior para pagamento pendente.

Perfil → desbloquear PIX
O fluxo está correto e explicado em customer-profile-page.tsx, mas ainda parece um pouco indireto: notice, hero, bloco lateral, métricas, cards inferiores e drawer de edição explicam a mesma trava por ângulos diferentes
Ficou completo, porém verboso.

Afiliados
A entrada sem perfil e o painel com perfil existem e estão coerentes em customer-affiliate-page.tsx
Mas a área ainda sofre de densidade e repetição: “status”, “perfil”, “leitura rápida”, “métricas”, “histórico” acabam dizendo coisas próximas demais. O fluxo é claro, mas poderia ser mais curto.

Pedidos
A leitura de status e timeline está boa em customer-orders-page.tsx
Só que “pedido em espera operacional”, “saldo do fornecedor”, “segue ativo” e blocos correlatos ficam espalhados entre hero, notice e drawer. Funciona, mas ainda não é o fluxo mais econômico.

Admin catálogo
É poderoso, mas é provavelmente um dos módulos mais densos do produto. Em admin-catalog-page.tsx há sincronizado, publicado, afiliados, drawer de criação, drawer de edição e drawer de configuração de afiliados quase na mesma superfície
Operacionalmente é rico; em UX ainda pede simplificação visual e de priorização.

Admin supplier
Mesmo problema: providers, sync logs e serviços sincronizados na mesma página em admin-supplier-page.tsx
É bom para operador experiente, mas para entendimento rápido ainda pesa.