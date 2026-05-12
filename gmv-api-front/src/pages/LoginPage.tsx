import { type FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthBackdrop } from '../components/AuthBackdrop';
import { PasswordField } from '../components/PasswordField';
import { ApiError } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import {
  LOGIN_PASSWORD_MAX,
  USERNAME_MAX,
  validateLoginPassword,
  validateUsername,
} from '../lib/validation';

export function LoginPage() {
  const { user, login, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [userErr, setUserErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!loading && user) {
    return <Navigate to="/tasks" replace />;
  }

  const formValid =
    validateUsername(username) === null && validateLoginPassword(password) === null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const u = validateUsername(username);
    const p = validateLoginPassword(password);
    setUserErr(u);
    setPassErr(p);
    if (u || p) return;
    setPending(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-page">
      <AuthBackdrop />
      <form className="card" onSubmit={onSubmit} noValidate>
        <h1>Iniciar sesión</h1>
        <label>
          Usuario
          <input
            autoComplete="username"
            value={username}
            onChange={(ev) => {
              const v = ev.target.value;
              setUsername(v);
              setUserErr(validateUsername(v));
            }}
            maxLength={USERNAME_MAX}
            aria-invalid={userErr ? true : undefined}
            required
          />
          {userErr ? <span className="field-error">{userErr}</span> : null}
        </label>
        <PasswordField
          label="Contraseña"
          value={password}
          onChange={(v) => {
            setPassword(v);
            setPassErr(validateLoginPassword(v));
          }}
          autoComplete="current-password"
          required
          maxLength={LOGIN_PASSWORD_MAX}
        />
        {passErr ? <span className="field-error">{passErr}</span> : null}
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={pending || !formValid}>
          {pending ? 'Enviando…' : 'Entrar'}
        </button>
        <p className="muted">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
