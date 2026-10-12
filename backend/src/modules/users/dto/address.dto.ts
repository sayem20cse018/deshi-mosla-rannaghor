import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50)  label?:       string;
  @ApiProperty()                        @IsString() @MaxLength(100) fullName:     string;
  @ApiProperty()                        @IsString() @MaxLength(20)  phone:        string;
  @ApiProperty()                        @IsString() @MaxLength(50)  division:     string;
  @ApiProperty()                        @IsString() @MaxLength(50)  district:     string;
  @ApiProperty()                        @IsString() @MaxLength(100) area:         string;
  @ApiProperty()                        @IsString() @MaxLength(500) fullAddress:  string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(10)  postalCode?:  string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean()                 isDefault?:   boolean;
}

export class UpdateAddressDto extends CreateAddressDto {}
