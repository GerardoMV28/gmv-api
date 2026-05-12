import { type FormEvent, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import type { PublicUser, RolOption } from '../types';

export function AdminUsersPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [roles, setRoles] = useState<RolOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function load() {
    try {
      const [u, r] = await Promise.all([
        api<PublicUser[]>('/users'),
        api<RolOption[]>('/admin/roles'),
      ]);
      setUsers(u);
      setRoles(r);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al cargar datos');
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (user?.role === 'ADMIN') {
      void load();
    }
  }, [authLoading, user?.role]);

  async function changeRole(userId: number, rolId: number) {
    setPendingId(userId);
    setError(null);
    try {
      await api(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ rolId }),
      });
      if (user != null && userId === user.id) {
        await logout();
        navigate('/login', { replace: true });
        return;
      }
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cambiar el rol');
    } finally {
      setPendingId(null);
    }
  }

  function onRoleSubmit(e: FormEvent, userId: number, rolId: number) {
    e.preventDefault();
    void changeRole(userId, rolId);
  }

  if (authLoading) {
    return (
      <div className="loading-screen" role="status">
        <span>Cargando…</span>
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <div className="page">
      <h1>Usuarios (admin)</h1>
      <p className="muted">
        Los correos no se muestran en esta vista. Solo puedes cambiar roles desde aquí.
      </p>
      {error ? <p className="error">{error}</p> : null}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Cambiar rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>
                  {u.name} {u.lastname}
                </td>
                <td>{u.role}</td>
                <td>
                  <form
                    onSubmit={(e) => {
                      const fd = new FormData(e.currentTarget);
                      const rid = Number(fd.get('rolId'));
                      onRoleSubmit(e, u.id, rid);
                    }}
                  >
                    <select
                      name="rolId"
                      defaultValue={u.rolId != null ? String(u.rolId) : ''}
                      required
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.description}
                        </option>
                      ))}
                    </select>
                    <button type="submit" disabled={pendingId === u.id}>
                      {pendingId === u.id ? '…' : 'Guardar'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
