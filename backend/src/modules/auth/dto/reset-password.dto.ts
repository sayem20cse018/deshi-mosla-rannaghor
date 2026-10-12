import { IsString, MinLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'rahim@example.com' })
  @IsString()
  identifier: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'OTP অবশ্যই ৬ সংখ্যার হতে হবে' })
  otp: string;

  @ApiProperty({ example: 'NewPass@123' })
  @IsString()
  @MinLength(8, { message: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে' })
  newPassword: string;
}
