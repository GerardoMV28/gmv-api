import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import {
  LOGIN_PASSWORD_MAX,
  USERNAME_MAX,
  USERNAME_MIN,
  USERNAME_REGEX,
  USERNAME_MESSAGE,
} from '../../common/validation/constants';

export class LoginDto {
  @IsString()
  @MinLength(USERNAME_MIN)
  @MaxLength(USERNAME_MAX)
  @Matches(USERNAME_REGEX, { message: USERNAME_MESSAGE })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  username!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(LOGIN_PASSWORD_MAX)
  password!: string;
}
