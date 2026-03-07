import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const SAFE_TEXT = /^[^<>]*$/;

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Matches(SAFE_TEXT, { message: 'Caracteres no permitidos' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(205)
  @Matches(SAFE_TEXT, { message: 'Caracteres no permitidos' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lastname?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email?: string;
}
