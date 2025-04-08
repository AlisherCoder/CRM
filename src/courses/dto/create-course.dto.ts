import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'English' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'English for beginners' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'English ielts' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  children?: string[];
}
