import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateLessonDto {
  @ApiProperty({ example: '2025-04-09' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date?: string;

  @ApiProperty({ example: '08:00' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  startTime?: string;

  @ApiProperty({ example: '11:30' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  endTime?: string;
}
