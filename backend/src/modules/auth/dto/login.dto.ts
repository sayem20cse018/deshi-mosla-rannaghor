import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'rahim@example.com or 01700000000' })
  @IsString()
  identifier: string; // email or phone

  @ApiProperty({ example: 'StrongPass@123' })
  @IsString()
  @MinLength(1)
  password: string;
}
