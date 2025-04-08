import { Role } from './create-user.dto';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  full_name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

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
  @IsEnum(['full_name', 'createdAt'])
  sortBy?: 'full_name' | 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderBy?: 'asc' | 'desc';
}
