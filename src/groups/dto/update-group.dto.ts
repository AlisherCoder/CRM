import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({ example: 'N20' })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @Type(() => Boolean)
  @IsNotEmpty()
  status?: boolean;
}
