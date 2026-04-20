# backlog-ideias-melhorias

## Objetivo

Checklist objetiva dos ajustes ainda necessarios no frontend atual, com foco em:
- branding e consistencia
- reducao de redundancia
- simplificacao de fluxos criticos
- reducao de densidade em telas admin

Fonte principal desta backlog: leitura do codigo atual do frontend no branch `master`.

---

## Como usar este arquivo

- Este arquivo deve ser tratado como backlog viva.
- Sempre que um item for concluido, trocar `[ ]` por `[x]`.
- Se um item ficar parcial, marcar `[~]` e adicionar uma nota curta logo abaixo.
- Se durante a execucao surgir subitem necessario, adicionar abaixo do bloco correto sem reescrever a backlog inteira.
- Nao remover itens sem justificar.

Legenda:
- `[ ]` pendente
- `[~]` parcial
- `[x]` concluido

---

## 1. Branding e consistencia

### 1.1 Auth ainda com marca antiga
- [x] Remover remanescentes de `Likes Uai` das telas de auth.
- [x] Trocar placeholder/email/example ligado a `likesuai.com`.
- [x] Garantir que login e cadastro exibam a identidade atual do produto.
- [x] Atualizar testes afetados pela troca de branding.

Arquivos principais:
- `src/modules/auth/page-content.ts`
- `src/modules/auth/auth-form.tsx`
- `tests/auth-form-content.test.ts`

### 1.2 Consistencia de naming
- [x] Revisar textos de shell e superficies autenticadas para manter naming coerente com a identidade atual.
- [x] Evitar sensacao de produto em transicao entre `Pokelike`, `Pokelike Ops`, `Area cliente`, `Area admin`, `Workspace do cliente`, `Console operacional`.
- [x] Manter consistencia sem apagar diferencas legitimas entre cliente e admin.

Arquivos principais:
- `src/modules/app-shell/area-shell-content.ts`
- `src/modules/app-shell/public-shell.tsx`
- `src/app/layout.tsx`
- `src/lib/config/env.ts`

### 1.3 Navegacao do cliente
- [x] Confirmado: `/admin` nao aparece como item padrao na navegacao da area cliente.

Arquivo validado:
- `src/modules/app-shell/area-shell-content.ts`

---

## 2. Fluxo de pagamentos PIX

### 2.1 Reducao de redundancia
- [x] Reduzir repeticao do estado `PIX bloqueado` quando falta CPF/CNPJ.
- [x] Evitar duplicar o mesmo aviso no card principal e no card lateral sem ganho real.
- [x] Concentrar a explicacao de bloqueio em um unico ponto dominante.

### 2.2 Mais foco operacional
- [x] Manter destaque forte para pagamento pendente.
- [x] Garantir que o caminho principal seja sempre obvio: pagar PIX pendente ou gerar novo PIX.
- [x] Evitar excesso de texto explicativo espalhado.

### 2.3 Drawer do pagamento
- [x] Manter QR, copia e cola e refresh como foco principal da tarefa.
- [x] Remover qualquer texto excedente que nao ajude a concluir o pagamento.

Arquivos principais:
- `src/modules/customer-dashboard/customer-payments-page.tsx`
- `src/modules/customer-dashboard/payment-pix-actions.tsx`

---

## 3. Fluxo perfil -> desbloquear PIX

### 3.1 Menos verbosidade
- [x] Reduzir repeticao da trava fiscal ao longo da pagina de perfil.
- [x] Evitar explicar a mesma dependencia de CPF/CNPJ no hero, metricas, cards e drawer sem necessidade.
- [x] Manter clareza sobre o desbloqueio do PIX com menos camadas visuais.

### 3.2 Hierarquia melhor
- [x] Deixar mais claro qual e o ponto principal de acao para liberar PIX.
- [x] Garantir que o CTA principal e o bloco principal contem a informacao central, sem ecos desnecessarios.

Arquivos principais:
- `src/modules/customer-dashboard/customer-profile-page.tsx`

---

## 4. Fluxo de afiliados

### 4.1 Reducao real de densidade
- [x] Enxugar a tela sem perder status, codigo e historico.
- [x] Evitar sobreposicao entre hero, status lateral, metricas e historico.
- [x] Tornar a area mais curta e objetiva.

### 4.2 Entrada no programa
- [x] Garantir que o estado sem perfil de afiliado seja simples e direto.
- [x] Evitar repeticao entre texto introdutorio, metricas de entrada e card de solicitacao.

### 4.3 Painel do afiliado ativo
- [x] Priorizar codigo, status e ganhos.
- [x] Reduzir detalhes secundarios que competem com o objetivo principal.

Arquivos principais:
- `src/modules/customer-dashboard/customer-affiliate-page.tsx`
- `src/modules/customer-dashboard/affiliate-apply-form.tsx`

---

## 5. Fluxo de pedidos

### 5.1 Consolidacao de contexto operacional
- [x] Manter consolidado o contexto de `espera operacional / saldo do fornecedor / pedido segue ativo`.
- [x] Evitar espalhar a mesma mensagem entre hero, cards e drawer sem necessidade.

### 5.2 Economia de interface
- [x] Preservar a timeline boa atual.
- [x] Simplificar o restante do fluxo para que a timeline seja o principal detalhamento.

Arquivos principais:
- `src/modules/customer-dashboard/customer-orders-page.tsx`
- `src/modules/orders/order-view.ts`

---

## 6. Admin catalog

### 6.1 Menos sensacao de tudo ao mesmo tempo
- [x] Melhorar a separacao perceptiva entre `Sincronizados`, `Servicos publicos` e `Afiliacao`.
- [x] Reduzir a carga visual simultanea da tela principal.
- [x] Reforcar a prioridade visual de `publicados / ativos / compraveis / afiliados`.

### 6.2 Refinar leitura operacional
- [x] Garantir leitura rapida do que esta pronto para vender, do que esta em risco e do que exige configuracao.
- [x] Evitar que drawers e a tela principal parecam competir entre si.

Arquivos principais:
- `src/modules/admin-shell/admin-catalog-page.tsx`

---

## 7. Admin supplier

### 7.1 Separacao visual mais forte
- [x] Reforcar separacao entre `providers`, `logs` e `servicos sincronizados`.
- [x] Melhorar leitura rapida para operador.

### 7.2 Reducao de peso
- [x] Reduzir sensacao de tela excessivamente pesada mesmo mantendo riqueza operacional.
- [x] Manter filtros e acoes sem poluir o topo e as tabelas.

Arquivos principais:
- `src/modules/admin-shell/admin-supplier-page.tsx`

---

## 8. Regressao critica encontrada

### 8.1 Branding inconsistente em producao
- [x] Eliminar inconsistencia visivel entre marca global atual (`Pokelike`) e marca antiga em auth (`Likes Uai`).
- [x] Confirmar que nenhuma superficie relevante do usuario final continua mostrando naming legado.

Arquivos principais:
- `src/app/layout.tsx`
- `src/modules/auth/page-content.ts`
- `src/modules/auth/auth-form.tsx`
- `src/modules/app-shell/public-shell.tsx`
- `src/modules/app-shell/area-shell-content.ts`

---

## 9. Criterio de conclusao

So marcar como concluido quando:
- o codigo estiver alterado
- a UI tiver ficado objetivamente mais economica
- a mensagem principal da tela estiver mais clara
- a redundancia tiver sido reduzida de verdade
- nao houver regressao de branding
