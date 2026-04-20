import { useState, useEffect, useRef } from "react";

const COLORS = {
  yellow: "#FFD93D",
  blue: "#4CC9F0",
  purple: "#7B2FBE",
  purpleLight: "#A855F7",
  neon: "#00F5FF",
  dark: "#0D0D1A",
  darkCard: "#13132A",
  darkBorder: "#1E1E3A",
  white: "#F8F8FF",
  gray: "#8888AA",
};

const gradients = {
  hero: "linear-gradient(135deg, #0D0D1A 0%, #1a0a2e 50%, #0D0D1A 100%)",
  cta: "linear-gradient(135deg, #7B2FBE, #4CC9F0)",
  card: "linear-gradient(135deg, #13132A, #1a1a35)",
  yellow: "linear-gradient(135deg, #FFD93D, #FF9F1C)",
  purple: "linear-gradient(135deg, #7B2FBE, #A855F7)",
};

// SVG Mascot: electric creature
const Mascot = ({ size = 120, variant = 1 }) => {
  const colors = variant === 1
    ? { body: "#4CC9F0", accent: "#FFD93D", glow: "#4CC9F0" }
    : { body: "#A855F7", accent: "#00F5FF", glow: "#A855F7" };

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <filter id={`glow${variant}`}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id={`bodyGrad${variant}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={colors.body} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.body} stopOpacity="0.6" />
        </radialGradient>
      </defs>
      {/* Body */}
      <ellipse cx="60" cy="70" rx="32" ry="28" fill={`url(#bodyGrad${variant})`} filter={`url(#glow${variant})`} />
      {/* Head */}
      <circle cx="60" cy="42" r="24" fill={`url(#bodyGrad${variant})`} filter={`url(#glow${variant})`} />
      {/* Ears */}
      <polygon points="40,25 34,8 48,20" fill={colors.accent} />
      <polygon points="80,25 86,8 72,20" fill={colors.accent} />
      {/* Eyes */}
      <circle cx="52" cy="40" r="6" fill="white" />
      <circle cx="68" cy="40" r="6" fill="white" />
      <circle cx="53" cy="41" r="3" fill="#0D0D1A" />
      <circle cx="69" cy="41" r="3" fill="#0D0D1A" />
      <circle cx="54" cy="40" r="1" fill="white" />
      <circle cx="70" cy="40" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="47" rx="3" ry="2" fill={colors.accent} />
      {/* Smile */}
      <path d="M54 52 Q60 57 66 52" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Tail lightning */}
      <path d="M88 65 L95 55 L90 58 L97 45" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" fill="none" filter={`url(#glow${variant})`} />
      {/* Cheek marks */}
      <circle cx="44" cy="46" r="5" fill={colors.accent} opacity="0.6" />
      <circle cx="76" cy="46" r="5" fill={colors.accent} opacity="0.6" />
      {/* Stars */}
      <text x="15" y="30" fontSize="10" fill={colors.accent} opacity="0.8">✦</text>
      <text x="96" y="35" fontSize="8" fill={colors.body} opacity="0.7">✦</text>
      <text x="25" y="80" fontSize="6" fill={colors.accent} opacity="0.5">⚡</text>
    </svg>
  );
};

// Lightning bolt icon
const Lightning = ({ size = 20, color = "#FFD93D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

// Star icon
const Star = ({ size = 16, color = "#FFD93D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const navLinks = ["Início", "Serviços", "Como Funciona", "Benefícios", "Depoimentos", "FAQ"];

// Dashboard Mockup
const DashboardMockup = () => (
  <div style={{
    background: "#0f0f20",
    border: "1px solid #2a2a4a",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 0 60px rgba(76,201,240,0.15), 0 0 120px rgba(123,47,190,0.1)",
    fontFamily: "monospace",
    maxWidth: 600,
  }}>
    {/* Top bar */}
    <div style={{ background: "#13132a", padding: "12px 20px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #2a2a4a" }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
      <span style={{ color: "#8888AA", fontSize: 12, marginLeft: 8 }}>painel.pokelike.com</span>
    </div>
    <div style={{ display: "flex", minHeight: 320 }}>
      {/* Sidebar */}
      <div style={{ width: 70, background: "#0d0d1a", borderRight: "1px solid #2a2a4a", padding: "20px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        {["🏠", "🛒", "📊", "⚡", "🎯", "⚙️"].map((icon, i) => (
          <div key={i} style={{
            width: 42, height: 42, borderRadius: 12,
            background: i === 0 ? "linear-gradient(135deg,#7B2FBE,#4CC9F0)" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            cursor: "pointer", border: i === 0 ? "none" : "1px solid transparent",
          }}>{icon}</div>
        ))}
      </div>
      {/* Main content */}
      <div style={{ flex: 1, padding: 20, overflow: "hidden" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Saldo", val: "R$ 247,50", color: "#FFD93D", icon: "💰" },
            { label: "Pedidos", val: "18 ativos", color: "#4CC9F0", icon: "📦" },
            { label: "Concluídos", val: "142 total", color: "#A855F7", icon: "✅" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#13132a", border: "1px solid #2a2a4a", borderRadius: 12, padding: "12px 10px" }}>
              <div style={{ fontSize: 16 }}>{s.icon}</div>
              <div style={{ color: s.color, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{s.val}</div>
              <div style={{ color: "#8888AA", fontSize: 10, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Chart area */}
        <div style={{ background: "#13132a", border: "1px solid #2a2a4a", borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <div style={{ color: "#8888AA", fontSize: 10, marginBottom: 10 }}>Atividade dos últimos 7 dias</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} style={{
                flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0",
                background: i === 5
                  ? "linear-gradient(180deg, #4CC9F0, #7B2FBE)"
                  : "linear-gradient(180deg, #7B2FBE44, #7B2FBE22)",
              }} />
            ))}
          </div>
        </div>
        {/* Orders list */}
        <div style={{ background: "#13132a", border: "1px solid #2a2a4a", borderRadius: 12, padding: 12 }}>
          <div style={{ color: "#8888AA", fontSize: 10, marginBottom: 8 }}>Pedidos recentes</div>
          {[
            { plat: "Instagram", type: "Seguidores", status: "Em andamento", color: "#E1306C" },
            { plat: "YouTube", type: "Visualizações", status: "Concluído", color: "#FF0000" },
            { plat: "TikTok", type: "Curtidas", status: "Em andamento", color: "#00F2EA" },
          ].map((o, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? "1px solid #1e1e3a" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: o.color + "22", border: `1px solid ${o.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                  {o.plat === "Instagram" ? "📸" : o.plat === "YouTube" ? "▶️" : "🎵"}
                </div>
                <div>
                  <div style={{ color: "#F8F8FF", fontSize: 11, fontWeight: 600 }}>{o.plat}</div>
                  <div style={{ color: "#8888AA", fontSize: 9 }}>{o.type}</div>
                </div>
              </div>
              <span style={{
                fontSize: 9, padding: "3px 8px", borderRadius: 20,
                background: o.status === "Concluído" ? "#28C84022" : "#FFD93D22",
                color: o.status === "Concluído" ? "#28C840" : "#FFD93D",
                border: `1px solid ${o.status === "Concluído" ? "#28C84044" : "#FFD93D44"}`,
              }}>{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function PokelikeLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ background: COLORS.dark, color: COLORS.white, fontFamily: "'Nunito', 'Segoe UI', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Orbitron:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0D0D1A; }
        ::-webkit-scrollbar-thumb { background: #7B2FBE; border-radius: 3px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-glow { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes slide-in { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .float { animation: float 3s ease-in-out infinite; }
        .float-2 { animation: float 4s ease-in-out infinite 1s; }
        .btn-primary {
          background: linear-gradient(135deg, #FFD93D, #FF9F1C);
          color: #0D0D1A; font-weight: 900; border: none; border-radius: 50px;
          padding: 14px 32px; cursor: pointer; font-size: 15px;
          font-family: 'Nunito', sans-serif; letter-spacing: 0.5px;
          transition: all 0.3s; box-shadow: 0 4px 20px rgba(255,217,61,0.4);
          text-decoration: none; display: inline-block;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(255,217,61,0.6); }
        .btn-outline {
          background: transparent; color: #F8F8FF; font-weight: 700;
          border: 2px solid rgba(255,255,255,0.3); border-radius: 50px;
          padding: 12px 30px; cursor: pointer; font-size: 15px;
          font-family: 'Nunito', sans-serif; transition: all 0.3s;
          text-decoration: none; display: inline-block;
        }
        .btn-outline:hover { border-color: #4CC9F0; color: #4CC9F0; transform: translateY(-2px); }
        .btn-blue {
          background: linear-gradient(135deg, #7B2FBE, #4CC9F0);
          color: white; font-weight: 800; border: none; border-radius: 50px;
          padding: 14px 32px; cursor: pointer; font-size: 15px;
          font-family: 'Nunito', sans-serif; transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(76,201,240,0.3); text-decoration: none; display: inline-block;
        }
        .btn-blue:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(76,201,240,0.5); }
        .card-hover { transition: all 0.3s; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(76,201,240,0.15) !important; }
        .nav-link { color: #8888AA; text-decoration: none; font-weight: 600; font-size: 14px; transition: color 0.2s; cursor: pointer; }
        .nav-link:hover { color: #FFD93D; }
        .service-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(123,47,190,0.25) !important; }
        .service-card { transition: all 0.3s; }
        .faq-item { transition: all 0.3s; border-bottom: 1px solid #1E1E3A; }
        .glow-text {
          background: linear-gradient(135deg, #FFD93D, #4CC9F0, #A855F7);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .stat-num { font-family: 'Orbitron', sans-serif; }
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; }
          .hero-visual { display: none !important; }
          .desktop-menu { display: none !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .benefits-grid { grid-template-columns: 1fr 1fr !important; }
          .services-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .benefits-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(13,13,26,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1E1E3A" : "none",
        transition: "all 0.3s", padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #FFD93D, #FF9F1C)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(255,217,61,0.4)",
            }}>
              <Lightning size={22} color="#0D0D1A" />
            </div>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 20, color: "#F8F8FF", letterSpacing: 1 }}>
              Poke<span style={{ color: "#FFD93D" }}>like</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="desktop-menu" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {navLinks.map(link => (
              <span key={link} className="nav-link" onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, "-"))}>{link}</span>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="desktop-menu" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn-outline" style={{ padding: "9px 20px", fontSize: 13 }}>Entrar</button>
            <button className="btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>Criar Conta</button>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#F8F8FF", cursor: "pointer", fontSize: 24, display: "none" }} className="mobile-menu-btn">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div style={{ background: "rgba(13,13,26,0.98)", borderTop: "1px solid #1E1E3A", padding: 20 }}>
            {navLinks.map(link => (
              <div key={link} style={{ padding: "12px 0", borderBottom: "1px solid #1E1E3A" }}>
                <span className="nav-link" onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, "-"))} style={{ fontSize: 16, color: "#F8F8FF" }}>{link}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button className="btn-outline" style={{ flex: 1 }}>Entrar</button>
              <button className="btn-primary" style={{ flex: 1 }}>Criar Conta</button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="início" style={{ minHeight: "100vh", background: gradients.hero, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", paddingTop: 80 }}>
        {/* Background orbs */}
        <div style={{ position: "absolute", top: "10%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,47,190,0.3), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(76,201,240,0.2), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", left: "50%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,217,61,0.08), transparent 70%)", pointerEvents: "none" }} />

        {/* Grid dots */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <div className="hero-grid" style={{ display: "flex", alignItems: "center", gap: 60 }}>
            {/* Left content */}
            <div style={{ flex: 1, maxWidth: 580 }}>
              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,217,61,0.1)", border: "1px solid rgba(255,217,61,0.3)", borderRadius: 50, padding: "6px 16px", marginBottom: 24 }}>
                <Lightning size={14} color="#FFD93D" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#FFD93D" }}>Plataforma de Marketing Digital</span>
              </div>

              <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
                Evolua sua{" "}
                <span className="glow-text">presença online</span>
                {" "}com a energia da Pokelike
              </h1>

              <p style={{ fontSize: 18, color: "#AAAACC", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                A plataforma completa para criadores, marcas e empreendedores organizarem ações de divulgação digital com praticidade, rapidez e segurança.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
                <button className="btn-primary" style={{ fontSize: 16, padding: "15px 36px" }}>⚡ Criar Conta</button>
                <button className="btn-outline" style={{ fontSize: 16, padding: "15px 36px" }}>Ver Serviços →</button>
              </div>

              {/* Trust badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {[
                  { icon: "⚡", text: "Pagamento via Pix" },
                  { icon: "🛡️", text: "Plataforma Segura" },
                  { icon: "🕐", text: "Suporte 24/7" },
                  { icon: "🚀", text: "Entrega Ágil" },
                ].map((b, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 50, padding: "6px 14px",
                  }}>
                    <span style={{ fontSize: 13 }}>{b.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#AAAACC" }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right visual */}
            <div className="hero-visual float" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
              <div style={{ position: "relative", width: 480, height: 400 }}>
                {/* Main dashboard */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                  <DashboardMockup />
                </div>
                {/* Floating mascot */}
                <div className="float-2" style={{ position: "absolute", bottom: -40, right: -20, filter: "drop-shadow(0 0 20px rgba(76,201,240,0.5))" }}>
                  <Mascot size={110} variant={1} />
                </div>
                {/* Floating mascot 2 */}
                <div className="float" style={{ position: "absolute", top: -30, right: 30, filter: "drop-shadow(0 0 15px rgba(168,85,247,0.5))" }}>
                  <Mascot size={70} variant={2} />
                </div>
                {/* Floating badge */}
                <div style={{ position: "absolute", bottom: 30, left: -20, background: "linear-gradient(135deg,#FFD93D,#FF9F1C)", borderRadius: 16, padding: "12px 18px", boxShadow: "0 8px 30px rgba(255,217,61,0.4)" }}>
                  <div style={{ color: "#0D0D1A", fontWeight: 900, fontSize: 18 }}>+10k</div>
                  <div style={{ color: "#0D0D1A", fontWeight: 600, fontSize: 11 }}>pedidos processados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" style={{ padding: "100px 24px", background: "#0a0a18" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(76,201,240,0.1)", border: "1px solid rgba(76,201,240,0.3)", borderRadius: 50, padding: "6px 16px", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#4CC9F0" }}>SIMPLES E RÁPIDO</span>
            </div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, marginBottom: 14 }}>
              Como <span style={{ color: "#FFD93D" }}>Funciona</span>
            </h2>
            <p style={{ color: "#8888AA", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>Em apenas 4 passos simples, você está pronto para impulsionar sua estratégia digital.</p>
          </div>

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { num: "01", icon: "👤", title: "Crie sua conta", desc: "Cadastre-se gratuitamente em menos de 2 minutos. Sem burocracia.", color: "#FFD93D" },
              { num: "02", icon: "💳", title: "Adicione saldo", desc: "Recarregue com Pix de forma rápida, segura e sem taxas escondidas.", color: "#4CC9F0" },
              { num: "03", icon: "🎯", title: "Escolha um serviço", desc: "Navegue por categorias e selecione o serviço ideal para sua estratégia.", color: "#A855F7" },
              { num: "04", icon: "📊", title: "Acompanhe seus pedidos", desc: "Monitore o progresso em tempo real pelo seu painel personalizado.", color: "#FFD93D" },
            ].map((step, i) => (
              <div key={i} className="card-hover" style={{
                background: gradients.card, border: "1px solid #1E1E3A", borderRadius: 20, padding: 28,
                position: "relative", overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}>
                {/* Big number background */}
                <div style={{ position: "absolute", top: -10, right: 10, fontFamily: "'Orbitron', sans-serif", fontSize: 80, fontWeight: 900, color: step.color, opacity: 0.07, lineHeight: 1 }}>
                  {step.num}
                </div>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{step.icon}</div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: step.color, fontWeight: 700, marginBottom: 8, letterSpacing: 2 }}>PASSO {step.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "#F8F8FF" }}>{step.title}</h3>
                <p style={{ color: "#8888AA", fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section id="benefícios" style={{ padding: "100px 24px", background: COLORS.dark }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, marginBottom: 14 }}>
              Por que escolher a <span style={{ color: "#A855F7" }}>Pokelike</span>?
            </h2>
            <p style={{ color: "#8888AA", fontSize: 16, maxWidth: 450, margin: "0 auto" }}>Tudo que você precisa para evoluir sua estratégia digital em um só lugar.</p>
          </div>

          <div className="benefits-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { icon: "🎮", title: "Fácil de usar", desc: "Interface intuitiva feita para qualquer nível de experiência. Sem curva de aprendizado.", color: "#FFD93D" },
              { icon: "⚡", title: "Pix instantâneo", desc: "Recarregue seu saldo em segundos com Pix. Seguro, rápido e sem complicação.", color: "#4CC9F0" },
              { icon: "💬", title: "Suporte dedicado", desc: "Nossa equipe está disponível para ajudar você a qualquer hora do dia.", color: "#A855F7" },
              { icon: "🔒", title: "Privacidade total", desc: "Seus dados e estratégias protegidos com criptografia de ponta a ponta.", color: "#00F5FF" },
              { icon: "📋", title: "Gestão organizada", desc: "Acompanhe todos os seus pedidos e campanhas em um painel centralizado.", color: "#FFD93D" },
              { icon: "💎", title: "Preços acessíveis", desc: "Planos transparentes sem taxas surpresa. Acesso premium a custo justo.", color: "#A855F7" },
            ].map((b, i) => (
              <div key={i} className="card-hover" style={{
                background: gradients.card, border: "1px solid #1E1E3A", borderRadius: 20, padding: 28,
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: b.color + "18", border: `1px solid ${b.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 18 }}>
                  {b.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10, color: "#F8F8FF" }}>{b.title}</h3>
                <p style={{ color: "#8888AA", fontSize: 14, lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section id="serviços" style={{ padding: "100px 24px", background: "#0a0a18" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, marginBottom: 14 }}>
              Plataformas <span className="glow-text">disponíveis</span>
            </h2>
            <p style={{ color: "#8888AA", fontSize: 16, maxWidth: 450, margin: "0 auto" }}>Gerencie suas campanhas em todas as principais redes sociais.</p>
          </div>

          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { name: "Instagram", icon: "📸", desc: "Aumente o alcance das suas publicações e perfil.", color: "#E1306C", bg: "#E1306C" },
              { name: "TikTok", icon: "🎵", desc: "Potencialize vídeos e ganhe visibilidade na plataforma.", color: "#00F2EA", bg: "#00F2EA" },
              { name: "YouTube", icon: "▶️", desc: "Impulsione seus vídeos com mais visualizações e engajamento.", color: "#FF0000", bg: "#FF0000" },
              { name: "Telegram", icon: "✈️", desc: "Amplie o alcance dos seus grupos e canais.", color: "#0088CC", bg: "#0088CC" },
              { name: "Twitch", icon: "🎮", desc: "Mais visibilidade para suas lives e canal.", color: "#9147FF", bg: "#9147FF" },
              { name: "Outras Redes", icon: "🌐", desc: "Twitter, Pinterest, LinkedIn e muito mais.", color: "#4CC9F0", bg: "#4CC9F0" },
            ].map((s, i) => (
              <div key={i} className="service-card" style={{
                background: gradients.card, border: `1px solid ${s.color}33`, borderRadius: 20, padding: 28, cursor: "pointer",
                boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: s.bg + "22", border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                    {s.icon}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#F8F8FF" }}>{s.name}</h3>
                </div>
                <p style={{ color: "#8888AA", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{s.desc}</p>
                <button style={{
                  background: s.color + "18", color: s.color, border: `1px solid ${s.color}44`,
                  borderRadius: 50, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif", transition: "all 0.2s",
                }}>Explorar →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS HIGHLIGHT ── */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #7B2FBE22, #4CC9F022)", borderTop: "1px solid #1E1E3A", borderBottom: "1px solid #1E1E3A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, marginBottom: 12 }}>
              Centralize suas estratégias de{" "}
              <span style={{ color: "#4CC9F0" }}>divulgação em um só lugar</span>
            </h2>
            <p style={{ color: "#8888AA", fontSize: 16 }}>Números que falam por si só.</p>
          </div>
          <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { num: "+10mil", label: "Pedidos processados", icon: "📦", color: "#FFD93D" },
              { num: "24/7", label: "Suporte ativo", icon: "💬", color: "#4CC9F0" },
              { num: "6+", label: "Plataformas suportadas", icon: "🌐", color: "#A855F7" },
              { num: "100%", label: "Painel intuitivo", icon: "🎮", color: "#00F5FF" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "28px 20px", background: gradients.card, border: "1px solid #1E1E3A", borderRadius: 20 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                <div className="stat-num" style={{ fontSize: 32, fontWeight: 900, color: s.color, marginBottom: 8 }}>{s.num}</div>
                <div style={{ color: "#8888AA", fontSize: 14, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section id="depoimentos" style={{ padding: "100px 24px", background: COLORS.dark }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, marginBottom: 14 }}>
              O que dizem nossos <span style={{ color: "#FFD93D" }}>usuários</span>
            </h2>
            <p style={{ color: "#8888AA", fontSize: 16 }}>Experiências reais de quem já usa a plataforma.</p>
          </div>
          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card-hover" style={{
                background: gradients.card, border: "1px solid #1E1E3A", borderRadius: 20, padding: 28,
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} color="#FFD93D" />)}
                </div>
                <p style={{ color: "#CCCCEE", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#F8F8FF" }}>{t.name}</div>
                    <div style={{ color: "#8888AA", fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD MOCKUP ── */}
      <section style={{ padding: "100px 24px", background: "#0a0a18" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>
                Seu painel de <span style={{ color: "#4CC9F0" }}>controle completo</span>
              </h2>
              <p style={{ color: "#8888AA", fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
                Gerencie saldo, pedidos, serviços e campanhas em um painel limpo e intuitivo. Tudo em tempo real, tudo no seu controle.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["Saldo em tempo real", "Pedidos com status detalhado", "Histórico completo de campanhas", "Relatórios visuais simplificados"].map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#7B2FBE,#4CC9F0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✓</div>
                    <span style={{ color: "#CCCCEE", fontWeight: 600 }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 36 }}>
                <button className="btn-blue">Acessar painel →</button>
              </div>
            </div>
            <div className="float" style={{ flex: 1.4, minWidth: 320 }}>
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "100px 24px", background: COLORS.dark }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, marginBottom: 14 }}>
              Perguntas <span style={{ color: "#A855F7" }}>frequentes</span>
            </h2>
            <p style={{ color: "#8888AA", fontSize: 16 }}>Tudo que você precisa saber antes de começar.</p>
          </div>
          {faqItems.map((item, i) => (
            <div key={i} className="faq-item" style={{ borderBottom: "1px solid #1E1E3A" }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "22px 0", background: "none", border: "none", color: "#F8F8FF",
                fontSize: 16, fontWeight: 700, cursor: "pointer", textAlign: "left",
                fontFamily: "'Nunito', sans-serif",
              }}>
                {item.q}
                <span style={{ fontSize: 20, color: "#A855F7", transition: "transform 0.3s", transform: faqOpen === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
              </button>
              {faqOpen === i && (
                <div style={{ paddingBottom: 20, color: "#8888AA", lineHeight: 1.7, fontSize: 15 }}>{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: "100px 24px", background: "linear-gradient(135deg, #4a1a8a, #1a3a6a, #7B2FBE)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div style={{ position: "absolute", top: "10%", left: "-5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(rgba(255,217,61,0.15), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(rgba(76,201,240,0.15), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div className="float" style={{ marginBottom: 24 }}>
            <Mascot size={90} variant={1} />
          </div>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
            Pronto para <span style={{ color: "#FFD93D" }}>evoluir</span> sua presença digital?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 18, marginBottom: 40, lineHeight: 1.7 }}>
            Junte-se a milhares de criadores e marcas que já centralizam suas estratégias na Pokelike.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 17, padding: "16px 40px" }}>⚡ Criar Conta Grátis</button>
            <button className="btn-outline" style={{ fontSize: 17, padding: "16px 40px", borderColor: "rgba(255,255,255,0.4)" }}>💬 Falar com Suporte</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#060610", borderTop: "1px solid #1E1E3A", padding: "60px 24px 30px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 50 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#FFD93D,#FF9F1C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Lightning size={20} color="#0D0D1A" />
                </div>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 18, color: "#F8F8FF" }}>
                  Poke<span style={{ color: "#FFD93D" }}>like</span>
                </span>
              </div>
              <p style={{ color: "#8888AA", fontSize: 14, lineHeight: 1.7, maxWidth: 240 }}>
                Plataforma de marketing digital para criadores, marcas e empreendedores que querem crescer com estratégia.
              </p>
            </div>
            {/* Links */}
            {[
              { title: "Plataforma", links: ["Início", "Serviços", "Como Funciona", "Benefícios"] },
              { title: "Suporte", links: ["FAQ", "Contato", "Status", "Documentação"] },
              { title: "Legal", links: ["Termos de Serviço", "Privacidade", "Cookies", "LGPD"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontWeight: 800, fontSize: 13, color: "#F8F8FF", marginBottom: 18, letterSpacing: 1, textTransform: "uppercase" }}>{col.title}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ color: "#8888AA", textDecoration: "none", fontSize: 14, fontWeight: 600, transition: "color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = "#FFD93D"}
                      onMouseLeave={e => e.target.style.color = "#8888AA"}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1E1E3A", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "#8888AA", fontSize: 13 }}>© 2025 Pokelike. Todos os direitos reservados.</p>
            <div style={{ display: "flex", gap: 16 }}>
              {["🐦", "📸", "💬", "▶️"].map((icon, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: "#1E1E3A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#2a2a4a"}
                  onMouseLeave={e => e.currentTarget.style.background = "#1E1E3A"}>
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const testimonials = [
  { name: "Mariana Costa", role: "Criadora de Conteúdo", text: "A Pokelike transformou como organizo minhas campanhas. O painel é incrível e o suporte sempre responde rápido!", avatar: "🦊", color: "#FFD93D33" },
  { name: "Rafael Souza", role: "Empreendedor Digital", text: "Nunca foi tão fácil centralizar minhas estratégias de divulgação. Recomendo para qualquer marca que quer crescer online.", avatar: "🐺", color: "#4CC9F033" },
  { name: "Ana Luiza", role: "Influenciadora", text: "Plataforma super intuitiva! Fiz o primeiro pedido em minutos e o acompanhamento em tempo real é top.", avatar: "🦋", color: "#A855F733" },
  { name: "Carlos Mendes", role: "Gestor de Marketing", text: "Excelente custo-benefício. O pagamento via Pix é rápido e nunca tive problema algum com segurança.", avatar: "🐉", color: "#00F5FF33" },
  { name: "Juliana Reis", role: "Agência Digital", text: "Uso para gerenciar campanhas de vários clientes. O painel organizado faz toda diferença no meu dia a dia.", avatar: "🌟", color: "#FFD93D33" },
  { name: "Pedro Alves", role: "Streamer", text: "Consegui organizar minha estratégia no Twitch de forma profissional. Atendimento nota 10!", avatar: "⚡", color: "#4CC9F033" },
];

const faqItems = [
  { q: "Como funciona a Pokelike?", a: "A Pokelike é uma plataforma de marketing digital onde você pode organizar e acompanhar ações de divulgação em diversas redes sociais. Basta criar sua conta, adicionar saldo e explorar as categorias disponíveis." },
  { q: "Quais formas de pagamento aceitam?", a: "Atualmente aceitamos Pix como forma principal de pagamento, garantindo agilidade e segurança nas transações. Novas formas de pagamento estão sendo planejadas." },
  { q: "Posso acompanhar meus pedidos em tempo real?", a: "Sim! Todos os pedidos ficam visíveis no seu painel pessoal com status atualizado em tempo real. Você tem total transparência sobre o andamento de cada ação." },
  { q: "O suporte funciona todos os dias?", a: "Sim, nosso suporte funciona 7 dias por semana. Você pode entrar em contato via chat ou e-mail e nossa equipe estará pronta para ajudar." },
  { q: "Como começo a usar a plataforma?", a: "É simples: clique em 'Criar Conta', preencha seus dados, adicione saldo via Pix e explore os serviços disponíveis. Todo o processo leva menos de 5 minutos." },
];
