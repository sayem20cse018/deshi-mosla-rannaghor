import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'rahim@example.com or 01700000000' })
  @IsString()
  identifier: string; // email or phone
}
