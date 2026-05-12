import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  IconClipboard,
  IconLogout,
  IconShield,
  IconUser,
  IconUsers,
} from '../components/icons';

export function AppLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="loading-screen" role="status">
        <span>Cargando…</span>
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
        <nav className="topbar-nav" aria-label="Principal">
          <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="nav-link-inner">
              <IconClipboard motion="bob" />
              Tareas
            </span>
          </NavLink>
          {isAdmin ? (
            <>
              <NavLink to="/audit" className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="nav-link-inner">
                  <IconShield motion="sway" />
                  Auditoría
                </span>
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="nav-link-inner">
                  <IconUsers motion="pulse" />
                  Usuarios
                </span>
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="user-menu-cluster">
          <span className="user-menu-label" title={`${user.username} · ${user.role}`}>
            <strong>{user.username}</strong>
            <span className="user-menu-role">{user.role}</span>
          </span>
          <div className="user-menu-actions" role="group" aria-label="Cuenta">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `user-menu-link${isActive ? ' active' : ''}`
              }
            >
              <span className="nav-link-inner">
                <IconUser motion="float" />
                Perfil
              </span>
            </NavLink>
            <button
              type="button"
              className="user-menu-logout btn-ghost btn-with-icon"
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
            >
              <IconLogout motion="spin" />
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
