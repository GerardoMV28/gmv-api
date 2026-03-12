import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const SAFE_TEXT = /^[^<>]*$/;

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(250)
  @Matches(SAFE_TEXT, { message: 'Caracteres no permitidos' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Matches(SAFE_TEXT, { message: 'Caracteres no permitidos' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
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
