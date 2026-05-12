import { type FormEvent, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import type { AuditLog } from '../types';

export function AuditPage() {
  const { user, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [userId, setUserId] = useState('');
  const [eventType, setEventType] = useState('');
  const [severity, setSeverity] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const params = new URLSearchParams();
    if (from) params.set('from', new Date(from).toISOString());
    if (to) params.set('to', new Date(to).toISOString());
    if (userId.trim()) params.set('userId', userId.trim());
    if (eventType.trim()) params.set('eventType', eventType.trim());
    if (severity.trim()) params.set('severity', severity.trim());
    const q = params.toString();
    try {
      const data = await api<AuditLog[]>(`/audit/logs${q ? `?${q}` : ''}`);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los logs');
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (user?.role === 'ADMIN') {
      void load();
    }
  }, [authLoading, user?.role]);

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

  function onFilter(e: FormEvent) {
    e.preventDefault();
    void load();
  }

  return (
    <div className="page page-audit">
      <h1>Auditoría</h1>
      <p className="muted-hint">
        Por seguridad no se muestra la ruta técnica del servidor; solo el tipo de evento y el detalle.
      </p>
      {error ? <p className="error">{error}</p> : null}
      <form className="card filters" onSubmit={onFilter}>
        <div className="row wrap">
          <label>
            Desde
            <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            Hasta
            <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <label>
            Usuario (id)
            <input value={userId} onChange={(e) => setUserId(e.target.value)} />
          </label>
          <label>
            Tipo de evento
            <input
              placeholder="LOGIN_FAILED"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            />
          </label>
          <label>
            Severidad
            <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="">Todas</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
          </label>
        </div>
        <button type="submit">Filtrar</button>
      </form>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Evento</th>
              <th>Severidad</th>
              <th>Usuario</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{new Date(l.timeStamp).toLocaleString()}</td>
                <td>{l.eventType}</td>
                <td>{l.severity}</td>
                <td>{l.sesion_id ?? '—'}</td>
                <td>{l.error}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
