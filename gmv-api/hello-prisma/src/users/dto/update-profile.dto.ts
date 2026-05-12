import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  EMAIL_MAX,
  PERSON_NAME_MAX,
  PERSON_NAME_MESSAGE,
  PERSON_NAME_MIN,
  PERSON_NAME_REGEX,
} from '../../common/validation/constants';

function trimOrUndef(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return undefined;
  const t = value.trim();
  return t === '' ? undefined : t;
}

export class UpdateProfileDto {
  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== null && String(v).trim() !== '')
  @IsString()
  @MinLength(PERSON_NAME_MIN)
  @MaxLength(PERSON_NAME_MAX)
  @Matches(PERSON_NAME_REGEX, { message: PERSON_NAME_MESSAGE })
  @Transform(({ value }) => trimOrUndef(value))
  name?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== null && String(v).trim() !== '')
  @IsString()
  @MinLength(PERSON_NAME_MIN)
  @MaxLength(PERSON_NAME_MAX)
  @Matches(PERSON_NAME_REGEX, { message: PERSON_NAME_MESSAGE })
  @Transform(({ value }) => trimOrUndef(value))
  lastname?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== null && String(v).trim() !== '')
  @IsEmail()
  @MaxLength(EMAIL_MAX)
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'string') return value;
    const t = value.trim().toLowerCase();
    return t === '' ? undefined : t;
  })
  email?: string;
}
