import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({ example: 'English' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ example: 'English for beginners' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ example: 500000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration_value?: number;

  @ApiProperty({ example: 'year' })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(['day', 'year', 'week', 'month'])
  duration_unit?: 'day' | 'year' | 'week' | 'month';
}
