import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,128}$/;

const SAFE_TEXT = /^[^<>]*$/;

export class RegisterDto {
  @IsString()
  @MaxLength(200)
  @Matches(SAFE_TEXT, { message: 'Caracteres no permitidos' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name!: string;

  @IsString()
  @MaxLength(205)
  @Matches(SAFE_TEXT, { message: 'Caracteres no permitidos' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lastname!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message: 'Usuario solo puede contener letras, números, _ . y -',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  username!: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : typeof value === 'string'
        ? value.trim().toLowerCase()
        : value,
  )
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsString()
  @Matches(PASSWORD_REGEX, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  })
  password!: string;
}
