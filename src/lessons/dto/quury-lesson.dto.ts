import { Type } from 'class-transformer';
import {
  IsOptional,
  IsMongoId,
  IsNotEmpty,
  IsInt,
  Min,
  IsEnum,
  IsDate,
} from 'class-validator';

export class QueryLessonDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date?: string;

  @IsOptional()
  @IsMongoId()
  @IsNotEmpty()
  teacher?: string;

  @IsOptional()
  @IsMongoId()
  @IsNotEmpty()
  group?: string;

  @IsOptional()
  @IsMongoId()
  @IsNotEmpty()
  course?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limit?: number;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderBy?: 'asc' | 'desc';
}
