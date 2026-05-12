/**
 * Reglas alineadas con el back: `gmv-api/hello-prisma/src/common/validation/constants.ts`
 */

export const PERSON_NAME_MIN = 2;
export const PERSON_NAME_MAX = 100;
export const PERSON_NAME_REGEX =
  /^(?!.*\s{2,})(?:[\p{L}]+(?:[-'][\p{L}]+)*)(?:\s(?:[\p{L}]+(?:[-'][\p{L}]+)*))*$/u;
export const PERSON_NAME_MESSAGE =
  'Solo letras y un espacio entre palabras (sin números ni símbolos). No uses varios espacios seguidos.';

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 150;
export const USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;
export const USERNAME_MESSAGE =
  'Usuario: solo letras, números, guión bajo, punto y guión (3–150 caracteres).';

export const EMAIL_MAX = 150;

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,128}$/;
export const PASSWORD_MESSAGE =
  'La contraseña debe tener entre 8 y 128 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';

export const LOGIN_PASSWORD_MAX = 200;

export const TASK_NAME_MIN = 2;
export const TASK_NAME_MAX = 250;
export const TASK_DESC_MIN = 2;
export const TASK_DESC_MAX = 200;
export const TASK_TEXT_REGEX =
  /^(?!.*\s{2,})(?!.*[<>])[\p{L}\p{N}\s.,:;¡!¿?'"()\-–—_]+$/u;
export const TASK_TEXT_MESSAGE =
  'Sin los caracteres < o >, sin espacios dobles; usa letras, números y signos habituales.';

export function validatePersonName(value: string): string | null {
  const t = value.trim();
  if (!t) return 'Este campo es obligatorio.';
  if (t.length < PERSON_NAME_MIN) return `Mínimo ${PERSON_NAME_MIN} caracteres.`;
  if (t.length > PERSON_NAME_MAX) return `Máximo ${PERSON_NAME_MAX} caracteres.`;
  if (!PERSON_NAME_REGEX.test(t)) return PERSON_NAME_MESSAGE;
  return null;
}

export function validateUsername(value: string): string | null {
  const t = value.trim();
  if (!t) return 'El usuario es obligatorio.';
  if (t.length < USERNAME_MIN) return `Mínimo ${USERNAME_MIN} caracteres.`;
  if (t.length > USERNAME_MAX) return `Máximo ${USERNAME_MAX} caracteres.`;
  if (!USERNAME_REGEX.test(t)) return USERNAME_MESSAGE;
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return 'La contraseña es obligatoria.';
  if (value.length < PASSWORD_MIN) return `Mínimo ${PASSWORD_MIN} caracteres.`;
  if (value.length > PASSWORD_MAX) return `Máximo ${PASSWORD_MAX} caracteres.`;
  if (!PASSWORD_REGEX.test(value)) return PASSWORD_MESSAGE;
  return null;
}

export function validateLoginPassword(value: string): string | null {
  if (!value) return 'La contraseña es obligatoria.';
  if (value.length > LOGIN_PASSWORD_MAX) return `Máximo ${LOGIN_PASSWORD_MAX} caracteres.`;
  return null;
}

export function validateOptionalEmail(value: string): string | null {
  const t = value.trim();
  if (!t) return null;
  if (t.length > EMAIL_MAX) return `Máximo ${EMAIL_MAX} caracteres.`;
  if (/\s/.test(t) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
    return 'Introduce un correo válido.';
  }
  return null;
}

export function validateTaskTitle(value: string): string | null {
  const t = value.trim();
  if (!t) return 'El nombre es obligatorio.';
  if (t.length < TASK_NAME_MIN) return `Mínimo ${TASK_NAME_MIN} caracteres.`;
  if (t.length > TASK_NAME_MAX) return `Máximo ${TASK_NAME_MAX} caracteres.`;
  if (!TASK_TEXT_REGEX.test(t)) return TASK_TEXT_MESSAGE;
  return null;
}

export function validateTaskDescription(value: string): string | null {
  const t = value.trim();
  if (!t) return 'La descripción es obligatoria.';
  if (t.length < TASK_DESC_MIN) return `Mínimo ${TASK_DESC_MIN} caracteres.`;
  if (t.length > TASK_DESC_MAX) return `Máximo ${TASK_DESC_MAX} caracteres.`;
  if (!TASK_TEXT_REGEX.test(t)) return TASK_TEXT_MESSAGE;
  return null;
}
