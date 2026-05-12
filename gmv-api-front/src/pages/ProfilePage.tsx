import { type FormEvent, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import type { UserMe } from '../types';
import {
  EMAIL_MAX,
  PERSON_NAME_MAX,
  validateOptionalEmail,
  validatePersonName,
} from '../lib/validation';

export function ProfilePage() {
  const { refresh } = useAuth();
  const [profile, setProfile] = useState<UserMe | null>(null);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [lastnameErr, setLastnameErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
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
    const nErr = validatePersonName(name);
    const lErr = validatePersonName(lastname);
    const eErr = validateOptionalEmail(email);
    setNameErr(nErr);
    setLastnameErr(lErr);
    setEmailErr(eErr);
    if (nErr || lErr || eErr) return;

    setPending(true);
    try {
      const body: { name?: string; lastname?: string; email?: string } = {};
      if (name.trim() !== profile?.name) body.name = name.trim();
      if (lastname.trim() !== profile?.lastname) body.lastname = lastname.trim();
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
    return (
      <div className="page page-center-forms">
        <p className="muted">Cargando perfil…</p>
      </div>
    );
  }

  return (
    <div className="page page-center-forms">
      <h1>Mi perfil</h1>
      {error ? <p className="error">{error}</p> : null}
      {ok ? <p className="ok">{ok}</p> : null}
      <form className="card" onSubmit={onSubmit} noValidate>
        <p className="muted">
          Rol: <strong>{profile?.role}</strong>
        </p>
        <label>
          Nombre
          <input
            value={name}
            onChange={(ev) => {
              const v = ev.target.value;
              setName(v);
              setNameErr(validatePersonName(v));
            }}
            maxLength={PERSON_NAME_MAX}
            aria-invalid={nameErr ? true : undefined}
            required
          />
          {nameErr ? <span className="field-error">{nameErr}</span> : null}
        </label>
        <label>
          Apellido
          <input
            value={lastname}
            onChange={(ev) => {
              const v = ev.target.value;
              setLastname(v);
              setLastnameErr(validatePersonName(v));
            }}
            maxLength={PERSON_NAME_MAX}
            aria-invalid={lastnameErr ? true : undefined}
            required
          />
          {lastnameErr ? <span className="field-error">{lastnameErr}</span> : null}
        </label>
        <label>
          Correo (opcional)
          <input
            type="email"
            value={email}
            onChange={(ev) => {
              const v = ev.target.value;
              setEmail(v);
              setEmailErr(validateOptionalEmail(v));
            }}
            maxLength={EMAIL_MAX}
            aria-invalid={emailErr ? true : undefined}
          />
          {emailErr ? <span className="field-error">{emailErr}</span> : null}
        </label>
        <button type="submit" disabled={pending}>
          Guardar
        </button>
      </form>
    </div>
  );
}
