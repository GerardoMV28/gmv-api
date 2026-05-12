import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  TASK_DESC_MAX,
  TASK_DESC_MIN,
  TASK_NAME_MAX,
  TASK_NAME_MIN,
  TASK_TEXT_MESSAGE,
  TASK_TEXT_REGEX,
} from '../../common/validation/constants';

function trimOrUndef(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return undefined;
  const t = value.trim();
  return t === '' ? undefined : t;
}

export class UpdateTaskDto {
  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== null && String(v).trim() !== '')
  @IsString()
  @MinLength(TASK_NAME_MIN)
  @MaxLength(TASK_NAME_MAX)
  @Matches(TASK_TEXT_REGEX, { message: TASK_TEXT_MESSAGE })
  @Transform(({ value }) => trimOrUndef(value))
  name?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== null && String(v).trim() !== '')
  @IsString()
  @MinLength(TASK_DESC_MIN)
  @MaxLength(TASK_DESC_MAX)
  @Matches(TASK_TEXT_REGEX, { message: TASK_TEXT_MESSAGE })
  @Transform(({ value }) => trimOrUndef(value))
  description?: string;

  @IsOptional()
  @IsBoolean()
  priority?: boolean;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsDateString()
  dueDate?: string | null;
}
