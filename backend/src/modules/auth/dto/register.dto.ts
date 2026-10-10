import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'রহিম উদ্দিন' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'rahim@example.com' })
  @IsEmail({}, { message: 'সঠিক ইমেইল দিন' })
  email: string;

  @ApiProperty({ example: '01700000000' })
  @IsString()
  @Matches(/^(?:\+?88)?01[3-9]\d{8}$/, { message: 'সঠিক বাংলাদেশি ফোন নম্বর দিন' })
  phone: string;

  @ApiProperty({ example: 'StrongPass@123' })
  @IsString()
  @MinLength(8, { message: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে' })
  @MaxLength(100)
  password: string;
}
