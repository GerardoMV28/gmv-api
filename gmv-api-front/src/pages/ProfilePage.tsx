import { type FormEvent, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import type { UserMe } from '../types';

export function ProfilePage() {
  const { refresh } = useAuth();
  const [profile, setProfile] = useState<UserMe | null>(null);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const me = await api<UserMe>('/users/me');
        setProfile(me);
        setName(me.name);
        setLastname(me.lastname);
        setEmail(me.email ?? '');
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Error al cargar perfil');
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setPending(true);
    try {
      const body: { name?: string; lastname?: string; email?: string } = {};
      if (name !== profile?.name) body.name = name;
      if (lastname !== profile?.lastname) body.lastname = lastname;
      const emailVal = email.trim();
      if (emailVal !== (profile?.email ?? '')) {
        body.email = emailVal || undefined;
      }
      if (Object.keys(body).length === 0) {
        setOk('Sin cambios');
        return;
      }
      const updated = await api<UserMe>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      setProfile(updated);
      setOk('Perfil actualizado');
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar');
    } finally {
      setPending(false);
    }
  }

  if (!profile && !error) {
    return <p className="muted">Cargando perfil…</p>;
  }

  return (
    <div className="page">
      <h1>Mi perfil</h1>
      {error ? <p className="error">{error}</p> : null}
      {ok ? <p className="ok">{ok}</p> : null}
      <form className="card" onSubmit={onSubmit}>
        <p className="muted">
          Rol: <strong>{profile?.role}</strong>
        </p>
        <label>
          Nombre
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Apellido
          <input value={lastname} onChange={(e) => setLastname(e.target.value)} required />
        </label>
        <label>
          Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit" disabled={pending}>
          Guardar
        </button>
      </form>
    </div>
  );
}
