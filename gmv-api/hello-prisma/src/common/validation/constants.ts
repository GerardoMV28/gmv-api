/**
 * Reglas alineadas con el front: `gmv-api-front/src/lib/validation.ts`.
 * Mantener ambos archivos sincronizados.
 */

export const PERSON_NAME_MIN = 2;
export const PERSON_NAME_MAX = 100;

/** Letras unicode, espacios simples entre palabras, guión o apóstrofe dentro de palabras. Sin números ni otros símbolos. */
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

/** Sin <>, sin espacios dobles; letras, números, espacio y puntuación habitual. */
export const TASK_TEXT_REGEX =
  /^(?!.*\s{2,})(?!.*[<>])[\p{L}\p{N}\s.,:;¡!¿?'"()\-–—_]+$/u;

export const TASK_TEXT_MESSAGE =
  'Sin los caracteres < o >, sin espacios dobles; usa letras, números y signos habituales.';
