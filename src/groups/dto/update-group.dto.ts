import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({ example: 'N20' })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  status?: boolean;
}
