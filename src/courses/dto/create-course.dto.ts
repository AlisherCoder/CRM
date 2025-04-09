import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCourseDto {
  @ApiProperty({ example: 'English' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'English for beginners' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  duration_value: number;

  @ApiProperty({ example: 'year' })
  @IsNotEmpty()
  @IsEnum(['day', 'year', 'week', 'month'])
  duration_unit: 'day' | 'year' | 'week' | 'month';

  @ApiProperty({ example: 'parent_id' })
  @IsOptional()
  @IsMongoId({ message: 'Invalid parent course ID' })
  parent?: Types.ObjectId;
}
