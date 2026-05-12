import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  TASK_DESC_MAX,
  TASK_DESC_MIN,
  TASK_NAME_MAX,
  TASK_NAME_MIN,
  TASK_TEXT_MESSAGE,
  TASK_TEXT_REGEX,
} from '../../common/validation/constants';

export class CreateTaskDto {
  @IsString()
  @MinLength(TASK_NAME_MIN)
  @MaxLength(TASK_NAME_MAX)
  @Matches(TASK_TEXT_REGEX, { message: TASK_TEXT_MESSAGE })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name!: string;

  @IsString()
  @MinLength(TASK_DESC_MIN)
  @MaxLength(TASK_DESC_MAX)
  @Matches(TASK_TEXT_REGEX, { message: TASK_TEXT_MESSAGE })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description!: string;

  @IsBoolean()
  priority!: boolean;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
