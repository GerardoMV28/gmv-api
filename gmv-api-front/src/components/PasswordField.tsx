import { useId, useState } from 'react';

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  id?: string;
  maxLength?: number;
};

function IconEye() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10.6 5.6A10.3 10.3 0 0 1 12 5c6 0 10 7 10 7a19.8 19.8 0 0 1-4.3 5.1M6.4 6.4 4 4m0 0L2 2m2 2 18 18m-4.3-4.3A10.1 10.1 0 0 1 12 19c-6 0-10-7-10-7a19.8 19.8 0 0 1 3.3-4.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2-5.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  required,
  id: idProp,
  maxLength,
}: PasswordFieldProps) {
  const uid = useId();
  const id = idProp ?? `pwd-${uid}`;
  const [visible, setVisible] = useState(false);

  return (
    <div className="field field--password">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field-password-wrap">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          className="field-password-input"
        />
        <button
          type="button"
          className="field-password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {visible ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
    </div>
  );
}
