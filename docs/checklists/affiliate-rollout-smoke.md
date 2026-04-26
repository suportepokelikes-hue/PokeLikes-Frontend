# Smoke Test Staging - Afiliados

## Objetivo

Validar manualmente, em staging, os fluxos criticos de afiliados para rollout sem reabrir regra de negocio.

## Massa Minima

- usuario cliente sem perfil de afiliado
- usuario admin
- servico publicado com afiliacao habilitada
- saldo suficiente na carteira do cliente comprador
- ambiente Asaas de staging/sandbox configurado para payout PIX

## Ordem Recomendada

1. Cliente afiliado: entrar em `/app/affiliate`, aplicar para o programa e confirmar que o status/codigo ficam visiveis.
   - Esperado: a entrada no programa some e a tela passa a mostrar status operacional do afiliado.

2. Cliente afiliado: cadastrar ou atualizar a chave PIX em `/app/affiliate`.
   - Esperado: a chave fica salva e o estado de recebimento pendente deixa de bloquear a leitura operacional.

3. Admin: abrir `/admin/affiliates` e aprovar o perfil, se ele estiver pendente.
   - Esperado: o afiliado aparece com status aprovado e codigo publico/affiliateCode visivel para uso.

4. Navegador comprador: abrir catalogo com `?aff=<codigo-do-afiliado>`, por exemplo `/catalog?aff=<codigo>`.
   - Esperado: o frontend reconhece o codigo ativo, persiste no navegador e mantem o indicador de afiliado ativo ao navegar para o detalhe do servico.

5. Comprador autenticado: criar um pedido a partir de `/catalog/[serviceId]` com o codigo ativo.
   - Esperado: o checkout conclui sem erro e o pedido segue com `affiliateCode` visivel/atribuido no fluxo esperado.

6. Admin: abrir `/admin/affiliate-commissions` e localizar a comissao gerada.
   - Esperado: a comissao aparece para o afiliado correto e fica elegivel para selecao guiada quando estiver `approved` e sem payout.

7. Admin: usar a selecao guiada em `/admin/affiliate-commissions`.
   - Esperado: a UI bloqueia mistura de afiliados, seleciona apenas comissoes elegiveis e abre `/admin/affiliate-payouts` com `affiliateProfileId` e `commissionIds` preenchidos.

8. Admin: criar o payout no drawer de `/admin/affiliate-payouts`.
   - Esperado: o payout nasce em `requested`, com valor, quantidade de comissoes, chave PIX snapshot e dados do afiliado corretos.

9. Admin: avancar o payout de `requested` para `processing`.
   - Esperado: a acao dispara o PIX real via Asaas; o registro passa para `processing` ou para estado terminal retornado imediatamente pelo provider.

10. Admin: validar refresh fallback em payout `processing`.
    - Esperado: o refresh atualiza ou preserva o status com leitura clara de `providerStatus`, `providerSyncedAt` e erro do provider quando houver.

## Aceite Do Smoke

- jornada cliente/admin completa sem erro inesperado de UI
- `?aff=` capturado e reaproveitado no checkout autenticado
- pedido criado com atribuicao de afiliado no fluxo esperado
- comissao aparece no admin para o afiliado correto
- selecao guiada impede payout com comissoes de afiliados diferentes
- payout criado em `requested` e avancado para `processing`
- fallback de refresh mostra status do provider de forma legivel
- nenhum ajuste manual de banco ou payload fora da UI foi necessario para validar o fluxo

## Observacoes

- O webhook automatico do backend continua sendo o caminho principal de conciliacao do payout.
- O refresh manual e fallback operacional para staging quando o webhook ainda nao refletiu o status.
- A wallet interna nao participa do pagamento de payout de afiliado.
