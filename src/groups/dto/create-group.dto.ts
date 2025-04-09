import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'N20' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2025-04-10' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2025-09-10' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ example: ['course_id'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true, message: 'Invalid course ID' })
  courses: string[];

  @ApiProperty({ example: ['student_id'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true, message: 'Invalid student ID' })
  students: string[];

  @ApiProperty({ example: ['teacher_id'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true, message: 'Invalid teacher ID' })
  teachers: string[];
}

export class AddDelStudentDto {
  @ApiProperty({ example: 'group_id' })
  @IsMongoId()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({ example: 'student_id' })
  @IsMongoId()
  @IsNotEmpty()
  student_id: string;
}

export class AddDelCourseDto {
  @ApiProperty({ example: 'group_id' })
  @IsMongoId()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({ example: 'course_id' })
  @IsMongoId()
  @IsNotEmpty()
  course_id: string;
}

export class AddDelTeacherDto {
  @ApiProperty({ example: 'group_id' })
  @IsMongoId()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({ example: 'teacher_id' })
  @IsMongoId()
  @IsNotEmpty()
  teacher_id: string;
}
