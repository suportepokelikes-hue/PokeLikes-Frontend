# Landing Implementation

## Escopo permitido
O Codex pode alterar somente:
- src/modules/app-shell/public-home.tsx
- src/modules/app-shell/public-shell.tsx
- src/app/globals.css

## Regra principal
Tratar a landing como homepage propria.
Nao fazer patch incremental confuso sobre a solucao anterior.
Nao manter shell v2 governando a landing.
A landing deve usar shell v3.

## PublicShell
- usar somente familia v3
- remover uso da familia v2 na landing
- header fino e escuro
- footer curto e discreto
- main sem width cap herdado
- sem subtitulo da marca
- sem copy mobile desnecessaria

## PublicHome
- manter namespace landing-v2 na home
- hero com duas colunas reais
- coluna esquerda dominante
- coluna direita com mascote
- manter secoes:
  - hero
  - como funciona
  - beneficios
  - servicos
  - stats
  - depoimentos
  - cta final

## CSS
- O CSS da landing deve ficar em src/app/globals.css
- O shell novo deve usar:
  - .public-shell-v3
  - .public-header-v3
  - .public-header-inner-v3
  - .public-shell-main-v3
  - .public-footer-v3
  - .public-footer-inner-v3
- A landing deve usar .landing-v2 como namespace principal
- public-shell-main-v3 deve ser full width
- classes v2 podem continuar existindo no projeto, mas nao podem governar a landing atual

## O que deve sair de uso na landing
- .public-shell-v2
- .public-header-v2
- .public-header-inner-v2
- .public-brand-copy-v2
- .public-nav-v2
- .public-header-actions-v2
- .public-mobile-panel-v2
- .public-shell-main-v2
- .public-footer-v2
- .public-footer-inner-v2

## Entrega esperada
- landing corrigida
- hero com composicao correta
- shell v3 em uso
- CSS novo governando a homepage
- sem conflito entre v2 e v3