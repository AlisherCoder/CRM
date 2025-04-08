import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  full_name?: string;

  @ApiProperty({ example: 'image.jpg' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  image?: string;

  @ApiProperty({ example: '+998953901313' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+998[0-9]{2}\d{7}$/, {
    message: 'The phone number format must be only: +998901234567.',
  })
  phone?: string;

  @ApiProperty({ example: 'root' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'The password must contain only letters and numbers.',
  })
  @MinLength(4)
  @MaxLength(32)
  password?: string;
}
