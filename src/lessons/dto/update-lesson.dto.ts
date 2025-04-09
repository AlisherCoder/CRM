import { Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateLessonDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  startTime?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  endTime?: string;
}
