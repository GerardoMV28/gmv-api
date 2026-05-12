import { type FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthBackdrop } from '../components/AuthBackdrop';
import { PasswordField } from '../components/PasswordField';
import { ApiError } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import {
  EMAIL_MAX,
  PASSWORD_MAX,
  PERSON_NAME_MAX,
  USERNAME_MAX,
  validateOptionalEmail,
  validatePassword,
  validatePersonName,
  validateUsername,
} from '../lib/validation';

type FieldKey = 'name' | 'lastname' | 'username' | 'email' | 'password';

export function RegisterPage() {
  const { user, register, loading } = useAuth();
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [pending, setPending] = useState(false);

  if (!loading && user) {
    return <Navigate to="/tasks" replace />;
  }

  function patchFieldError(key: FieldKey, msg: string | null) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (msg) next[key] = msg;
      else delete next[key];
      return next;
    });
  }

  function validateAll(): boolean {
    const e: Partial<Record<FieldKey, string>> = {};
    const en = validatePersonName(name);
    if (en) e.name = en;
    const el = validatePersonName(lastname);
    if (el) e.lastname = el;
    const eu = validateUsername(username);
    if (eu) e.username = eu;
    const em = validateOptionalEmail(email);
    if (em) e.email = em;
    const ep = validatePassword(password);
    if (ep) e.password = ep;
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  const formValid =
    validatePersonName(name) === null &&
    validatePersonName(lastname) === null &&
    validateUsername(username) === null &&
    validateOptionalEmail(email) === null &&
    validatePassword(password) === null;

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setError(null);
    if (!validateAll()) return;
    setPending(true);
    try {
      await register({
        name: name.trim(),
        lastname: lastname.trim(),
        username: username.trim(),
        email: email.trim() || undefined,
        password,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo registrar');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-page">
      <AuthBackdrop />
      <form className="card" onSubmit={onSubmit} noValidate>
        <h1>Crear cuenta</h1>
        <label>
          Nombre
          <input
            value={name}
            onChange={(ev) => {
              const v = ev.target.value;
              setName(v);
              patchFieldError('name', validatePersonName(v));
            }}
            maxLength={PERSON_NAME_MAX}
            aria-invalid={fieldErrors.name ? true : undefined}
            autoComplete="given-name"
            required
          />
          {fieldErrors.name ? <span className="field-error">{fieldErrors.name}</span> : null}
        </label>
        <label>
          Apellido
          <input
            value={lastname}
            onChange={(ev) => {
              const v = ev.target.value;
              setLastname(v);
              patchFieldError('lastname', validatePersonName(v));
            }}
            maxLength={PERSON_NAME_MAX}
            aria-invalid={fieldErrors.lastname ? true : undefined}
            autoComplete="family-name"
            required
          />
          {fieldErrors.lastname ? <span className="field-error">{fieldErrors.lastname}</span> : null}
        </label>
        <label>
          Usuario
          <input
            autoComplete="username"
            value={username}
            onChange={(ev) => {
              const v = ev.target.value;
              setUsername(v);
              patchFieldError('username', validateUsername(v));
            }}
            maxLength={USERNAME_MAX}
            aria-invalid={fieldErrors.username ? true : undefined}
            required
          />
          {fieldErrors.username ? <span className="field-error">{fieldErrors.username}</span> : null}
        </label>
        <label>
          Correo (opcional)
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(ev) => {
              const v = ev.target.value;
              setEmail(v);
              patchFieldError('email', validateOptionalEmail(v));
            }}
            maxLength={EMAIL_MAX}
            aria-invalid={fieldErrors.email ? true : undefined}
          />
          {fieldErrors.email ? <span className="field-error">{fieldErrors.email}</span> : null}
        </label>
        <PasswordField
          label="Contraseña"
          value={password}
          onChange={(v) => {
            setPassword(v);
            patchFieldError('password', validatePassword(v));
          }}
          autoComplete="new-password"
          required
          maxLength={PASSWORD_MAX}
        />
        {fieldErrors.password ? <span className="field-error">{fieldErrors.password}</span> : null}
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={pending || !formValid}>
          {pending ? 'Creando…' : 'Registrarme'}
        </button>
        <p className="muted">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
