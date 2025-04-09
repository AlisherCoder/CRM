import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Lesson 1' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: '2025-04-09' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'group_id' })
  @IsMongoId()
  @IsNotEmpty()
  group: string;

  @ApiProperty({ example: 'course_id' })
  @IsMongoId()
  @IsNotEmpty()
  course: string;

  @ApiProperty({ example: 'teacher_id' })
  @IsMongoId()
  @IsNotEmpty()
  teacher: string;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '11:30' })
  @IsString()
  @IsNotEmpty()
  endTime: string;
}
