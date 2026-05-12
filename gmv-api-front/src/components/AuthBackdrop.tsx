/** Fondo decorativo (solo estética, sin impacto en accesibilidad). */
export function AuthBackdrop() {
  return (
    <div className="auth-backdrop" aria-hidden>
      <div className="auth-backdrop__gradient" />
      <div className="auth-backdrop__grid" />
      <span className="auth-orb auth-orb--1" />
      <span className="auth-orb auth-orb--2" />
      <span className="auth-orb auth-orb--3" />
      <span className="auth-orb auth-orb--4" />
    </div>
  );
}
