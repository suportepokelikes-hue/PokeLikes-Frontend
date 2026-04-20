# Landing CSS Source of Truth

## Arquivo de destino
`src/app/globals.css`

## Regra
Este bloco é a fonte principal de CSS da landing pública.
O Codex deve inserir/substituir este bloco em `globals.css`.

## Ação obrigatória
- Adicionar o bloco novo da família `public-shell-v3`
- Adicionar o bloco novo da família `landing-v2`
- Parar de usar a família `public-shell-v2` na landing
- Garantir que `public-shell-main-v3` não tenha width cap herdado
- Garantir hero com duas colunas reais

## Onde inserir no globals.css
Insira o novo bloco abaixo da seção de estilos públicos existentes, ou substitua diretamente o bloco antigo do shell público/landing se ele já existir.

## O que deve sair de uso na landing
- .public-shell-v2
- .public-header-v2
- .public-header-inner-v2
- .public-shell-main-v2
- .public-footer-v2
- .public-footer-inner-v2

## O que deve entrar em uso
- .public-shell-v3
- .public-header-v3
- .public-header-inner-v3
- .public-brand-copy-v3
- .public-nav-v3
- .public-nav-link-v3
- .public-header-actions-v3
- .public-mobile-toggle-v3
- .public-mobile-panel-v3
- .public-mobile-link-v3
- .public-shell-main-v3
- .public-footer-v3
- .public-footer-inner-v3
- .landing-v2
- .landing-v2-hero
- .landing-v2-hero-copy-shell
- .landing-v2-hero-copy
- .landing-v2-hero-art-shell
- .landing-v2-hero-art
- .landing-v2-hero-art-frame
- .landing-v2-badge
- .landing-v2-trust-row
- .landing-v2-section
- .landing-v2-benefits-grid
- .landing-v2-service-grid
- .landing-v2-stats-band
- .landing-v2-testimonial-grid
- .landing-v2-final-cta

## CSS base
```css
.public-shell-v3 {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(73, 163, 255, 0.08), transparent 24rem),
    radial-gradient(circle at top right, rgba(139, 108, 255, 0.08), transparent 24rem),
    linear-gradient(180deg, #060914 0%, #06070d 100%);
}

.public-header-v3 {
  position: sticky;
  top: 0;
  z-index: 70;
  padding: 0.9rem 1.5rem 0;
}

.public-header-inner-v3 {
  width: min(100%, 1290px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem 1.15rem;
  border-radius: 1.45rem;
  background:
    radial-gradient(circle at top right, rgba(73, 163, 255, 0.14), transparent 18rem),
    radial-gradient(circle at top left, rgba(139, 108, 255, 0.12), transparent 16rem),
    rgba(9, 11, 22, 0.92);
  border: 1px solid rgba(125, 146, 219, 0.16);
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(18px);
}

.public-brand-v3 {
  gap: 0.85rem;
}

.public-brand-copy-v3 strong {
  font-size: 1.06rem;
  color: #f5f7ff;
}

.public-nav-v3 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.public-nav-link-v3 {
  min-height: 2.8rem;
  padding: 0.78rem 1rem;
  border-radius: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(17, 23, 40, 0.68);
  color: rgba(230, 236, 255, 0.84);
  font-size: 0.92rem;
  font-weight: 700;
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.public-nav-link-v3:hover {
  transform: translateY(-1px);
  border-color: rgba(248, 198, 23, 0.18);
}

.public-nav-link-v3.is-current {
  border-color: rgba(248, 198, 23, 0.24);
  background: linear-gradient(180deg, rgba(29, 38, 67, 0.96), rgba(18, 24, 43, 1));
}

.public-header-actions-v3 {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.85rem;
}

.public-shell-inline-link {
  color: rgba(241, 244, 255, 0.9);
  font-size: 0.95rem;
  font-weight: 700;
}

.public-mobile-toggle-v3 {
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(24, 31, 56, 0.98), rgba(13, 18, 34, 1));
  border: 1px solid rgba(125, 146, 219, 0.16);
}

.public-mobile-panel-v3 {
  border-radius: 1.4rem;
  background:
    radial-gradient(circle at top right, rgba(73, 163, 255, 0.16), transparent 15rem),
    radial-gradient(circle at top left, rgba(139, 108, 255, 0.16), transparent 14rem),
    rgba(9, 11, 22, 0.98);
}

.public-mobile-link-v3 {
  background: rgba(15, 20, 38, 0.92);
  border-color: rgba(125, 146, 219, 0.12);
}

.public-shell-main-v3 {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0 0 4rem;
}

.public-footer-v3 {
  padding: 0 1.5rem 1.5rem;
}

.public-footer-inner-v3 {
  width: min(100%, 1290px);
  margin: 0 auto;
  min-height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.25rem;
  background: rgba(9, 11, 22, 0.9);
  border: 1px solid rgba(125, 146, 219, 0.1);
  color: rgba(218, 224, 245, 0.68);
  font-size: 0.88rem;
}

.landing-v2 {
  display: grid;
  gap: 0;
  background:
    radial-gradient(circle at top left, rgba(42, 88, 194, 0.18), transparent 26rem),
    radial-gradient(circle at top right, rgba(128, 63, 211, 0.18), transparent 28rem),
    linear-gradient(90deg, #0b1734 0%, #17163b 100%);
}

.landing-v2-section,
.landing-v2-final-cta,
.landing-v2-stats-band {
  padding: 5.5rem clamp(1.25rem, 3vw, 2rem);
}

.landing-v2-hero {
  width: min(100%, 1320px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(420px, 0.92fr);
  gap: clamp(2rem, 4vw, 4.5rem);
  align-items: center;
  min-height: calc(100vh - 5rem);
  padding: clamp(3.5rem, 7vw, 7rem) clamp(1.5rem, 3vw, 2rem);
  overflow: visible;
}

.landing-v2-hero-copy-shell {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-width: 0;
}

.landing-v2-hero-copy {
  display: grid;
  gap: 1.5rem;
  max-width: 44rem;
  justify-items: start;
  align-content: center;
  z-index: 1;
}

.landing-v2-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 209, 59, 0.28);
  background: rgba(255, 209, 59, 0.08);
  color: #f7c81a;
  font-size: 0.94rem;
  font-weight: 700;
}

.landing-v2-hero h1 {
  margin: 0;
  font-size: clamp(3.5rem, 6vw, 6.1rem);
  line-height: 0.96;
  letter-spacing: -0.07em;
  color: #f5f7ff;
}

.landing-v2-hero h1 span,
.landing-v2-section-head h2 span,
.landing-v2-section-head-center h2 span {
  color: #f8c617;
}

.landing-v2-hero p {
  margin: 0;
  max-width: 39rem;
  font-size: 1.34rem;
  line-height: 1.7;
  color: rgba(222, 228, 255, 0.74);
}

.landing-v2-hero-actions,
.landing-v2-final-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.landing-v2-primary,
.landing-v2-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.85rem;
  padding: 0 1.8rem;
  border-radius: 1rem;
  text-decoration: none;
  font-weight: 800;
  font-size: 1.05rem;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.landing-v2-primary {
  background: #f8c617;
  color: #151515;
  box-shadow: 0 18px 44px rgba(248, 198, 23, 0.2);
}

.landing-v2-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 52px rgba(248, 198, 23, 0.28);
}

.landing-v2-secondary {
  border: 1px solid rgba(248, 198, 23, 0.34);
  background: rgba(17, 23, 41, 0.42);
  color: #f6f8ff;
}

.landing-v2-secondary:hover {
  transform: translateY(-2px);
  border-color: rgba(248, 198, 23, 0.5);
}

.landing-v2-trust-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  padding-top: 0.9rem;
}

.landing-v2-trust-row span {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.7rem;
  padding: 0 1rem;
  border-radius: 999px;
  background: rgba(13, 19, 38, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(221, 227, 255, 0.78);
  font-size: 0.95rem;
}

.landing-v2-hero-art-shell {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 0;
}

.landing-v2-hero-art {
  display: flex;
  justify-content: center;
  width: 100%;
}

.landing-v2-hero-art-frame {
  position: relative;
  width: min(100%, 38rem);
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.landing-v2-mascot {
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 24px 42px rgba(92, 76, 255, 0.22));
}

.landing-v2-floating {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(74, 94, 197, 0.96), rgba(92, 60, 190, 0.88));
  color: #fff;
  box-shadow: 0 18px 30px rgba(12, 16, 30, 0.26);
  font-size: 1.2rem;
  z-index: 2;
}

.landing-v2-floating-left { top: 14%; left: 6%; }
.landing-v2-floating-right { top: 17%; right: 4%; }
.landing-v2-floating-bottom { right: 13%; bottom: 12%; }

.landing-v2-section {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
}

.landing-v2-section-head {
  display: grid;
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.landing-v2-section-head-center {
  text-align: center;
  justify-items: center;
}

.landing-v2-section-head h2,
.landing-v2-stats-inner h2,
.landing-v2-final-copy h2 {
  margin: 0;
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  line-height: 1.08;
  letter-spacing: -0.05em;
  color: #f5f7ff;
}

.landing-v2-section-head p,
.landing-v2-final-copy p {
  margin: 0;
  max-width: 42rem;
  color: rgba(221, 227, 255, 0.7);
  font-size: 1.15rem;
  line-height: 1.7;
}

.landing-v2-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
}

.landing-v2-step-card {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  background: rgba(13, 17, 31, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-height: 10rem;
}

.landing-v2-step-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.landing-v2-step-number {
  font-size: 0.95rem;
  font-weight: 800;
  color: rgba(248, 198, 23, 0.88);
}

.landing-v2-step-icon,
.landing-v2-benefit-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 1rem;
  background: rgba(40, 78, 183, 0.22);
  color: #6da0ff;
}

.landing-v2-step-card strong,
.landing-v2-benefit-card strong,
.landing-v2-service-card strong,
.landing-v2-stat-card strong,
.landing-v2-testimonial-meta strong {
  color: #f5f7ff;
}

.landing-v2-benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.6rem;
}

.landing-v2-benefit-card {
  display: grid;
  gap: 1rem;
  padding: 1.8rem;
  border-radius: 1.6rem;
  background: rgba(14, 18, 34, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-height: 15rem;
}

.landing-v2-benefit-card strong {
  font-size: 1.55rem;
  line-height: 1.2;
}

.landing-v2-benefit-card p {
  margin: 0;
  color: rgba(221, 227, 255, 0.66);
  line-height: 1.65;
  font-size: 1.04rem;
}

.landing-v2-service-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.landing-v2-service-card {
  display: grid;
  gap: 1rem;
  padding: 1.4rem 1.5rem;
  border-radius: 1.4rem;
  text-decoration: none;
  background: rgba(13, 17, 31, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
}

.landing-v2-service-card:hover {
  transform: translateY(-2px);
  border-color: rgba(248, 198, 23, 0.18);
}

.landing-v2-service-card span {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: rgba(248, 198, 23, 0.92);
  font-weight: 700;
}

.landing-v2-stats-band {
  background: linear-gradient(90deg, #487ae0 0%, #9950f0 100%);
}

.landing-v2-stats-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  gap: 2.5rem;
  text-align: center;
}

.landing-v2-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.4rem;
}

.landing-v2-stat-card {
  display: grid;
  gap: 0.8rem;
  justify-items: center;
}

.landing-v2-stat-icon {
  color: rgba(255, 255, 255, 0.86);
}

.landing-v2-stat-card strong {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  line-height: 1;
}

.landing-v2-stat-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
}

.landing-v2-testimonial-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.landing-v2-testimonial-card {
  display: grid;
  gap: 1rem;
  padding: 1.6rem;
  border-radius: 1.5rem;
  background: rgba(14, 18, 34, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.landing-v2-stars {
  display: inline-flex;
  gap: 0.25rem;
  color: #f8c617;
}

.landing-v2-testimonial-card p {
  margin: 0;
  color: rgba(221, 227, 255, 0.72);
  line-height: 1.7;
}

.landing-v2-testimonial-meta {
  display: grid;
  gap: 0.2rem;
}

.landing-v2-testimonial-meta span {
  color: rgba(221, 227, 255, 0.58);
  font-size: 0.94rem;
}

.landing-v2-final-cta {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
  justify-items: center;
  text-align: center;
}

.landing-v2-final-copy {
  display: grid;
  gap: 0.85rem;
  justify-items: center;
}

@media (max-width: 1180px) {
  .public-header-inner-v3 {
    grid-template-columns: auto 1fr auto;
  }

  .landing-v2-hero {
    grid-template-columns: minmax(0, 1fr) minmax(340px, 0.95fr);
  }
}

@media (max-width: 1100px) {
  .landing-v2-steps,
  .landing-v2-benefits-grid,
  .landing-v2-service-grid,
  .landing-v2-stats-grid,
  .landing-v2-testimonial-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .public-nav-v3,
  .public-header-actions-v3 {
    display: none;
  }

  .public-mobile-toggle-v3 {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .public-header-inner-v3 {
    grid-template-columns: auto auto;
    justify-content: space-between;
  }

  .landing-v2-hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding-top: 2.8rem;
  }

  .landing-v2-hero-copy-shell,
  .landing-v2-hero-art-shell {
    justify-content: center;
  }

  .landing-v2-hero-copy {
    max-width: 100%;
  }

  .landing-v2-hero h1 {
    font-size: clamp(2.8rem, 10vw, 4.4rem);
  }
}

@media (max-width: 860px) {
  .landing-v2-benefits-grid,
  .landing-v2-service-grid,
  .landing-v2-testimonial-grid,
  .landing-v2-stats-grid,
  .landing-v2-steps {
    grid-template-columns: 1fr;
  }

  .landing-v2-hero p,
  .landing-v2-section-head p,
  .landing-v2-final-copy p {
    font-size: 1rem;
  }
}

@media (max-width: 640px) {
  .public-header-v3,
  .public-footer-v3 {
    padding-inline: 1rem;
  }

  .landing-v2-primary,
  .landing-v2-secondary {
    width: 100%;
  }

  .landing-v2-trust-row span {
    width: 100%;
    justify-content: center;
  }

  .landing-v2-floating {
    width: 3.2rem;
    height: 3.2rem;
    font-size: 1rem;
  }
}