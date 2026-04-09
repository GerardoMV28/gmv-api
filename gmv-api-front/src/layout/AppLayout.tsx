import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function AppLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="auth-page">
        <p>Cargando…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="shell">
      <header className="topbar">
        <span className="brand">GMV</span>
        <nav>
          <Link to="/tasks">Tareas</Link>
          <Link to="/profile">Perfil</Link>
          {isAdmin ? (
            <>
              <Link to="/audit">Auditoría</Link>
              <Link to="/admin/users">Usuarios</Link>
            </>
          ) : null}
        </nav>
        <div className="user-menu">
          <span className="muted">
            {user.username} · {user.role}
          </span>
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            Salir
          </button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
