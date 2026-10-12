import { IsOptional, IsString, MaxLength, IsEnum, IsDateString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() avatar?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['MALE', 'FEMALE', 'OTHER']) gender?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dateOfBirth?: string;
}

export class ChangePasswordDto {
  @ApiPropertyOptional() @IsString() currentPassword: string;
  @ApiPropertyOptional() @IsString() @MinLength(8) newPassword: string;
}
