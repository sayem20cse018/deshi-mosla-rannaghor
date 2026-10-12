import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: 'rahim@example.com' })
  @IsString()
  identifier: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'OTP অবশ্যই ৬ সংখ্যার হতে হবে' })
  otp: string;
}
