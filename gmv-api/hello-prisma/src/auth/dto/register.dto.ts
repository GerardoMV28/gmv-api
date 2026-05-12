import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  EMAIL_MAX,
  PASSWORD_MAX,
  PASSWORD_MESSAGE,
  PASSWORD_MIN,
  PASSWORD_REGEX,
  PERSON_NAME_MAX,
  PERSON_NAME_MESSAGE,
  PERSON_NAME_MIN,
  PERSON_NAME_REGEX,
  USERNAME_MAX,
  USERNAME_MESSAGE,
  USERNAME_MIN,
  USERNAME_REGEX,
} from '../../common/validation/constants';

export class RegisterDto {
  @IsString()
  @MinLength(PERSON_NAME_MIN)
  @MaxLength(PERSON_NAME_MAX)
  @Matches(PERSON_NAME_REGEX, { message: PERSON_NAME_MESSAGE })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name!: string;

  @IsString()
  @MinLength(PERSON_NAME_MIN)
  @MaxLength(PERSON_NAME_MAX)
  @Matches(PERSON_NAME_REGEX, { message: PERSON_NAME_MESSAGE })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lastname!: string;

  @IsString()
  @MinLength(USERNAME_MIN)
  @MaxLength(USERNAME_MAX)
  @Matches(USERNAME_REGEX, {
    message: USERNAME_MESSAGE,
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
  @MaxLength(EMAIL_MAX)
  email?: string;

  @IsString()
  @MinLength(PASSWORD_MIN)
  @MaxLength(PASSWORD_MAX)
  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_MESSAGE,
  })
  password!: string;
}
