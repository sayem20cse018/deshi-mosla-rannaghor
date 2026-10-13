import {
  IsString, IsOptional, IsEnum, IsNotEmpty,
  MaxLength, ValidateNested, IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeliveryAddressDto {
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(100) fullName:    string;
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(20)  phone:       string;
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(50)  division:    string;
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(50)  district:    string;
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(100) area:        string;
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(500) fullAddress: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(10)  postalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() saveAddress?: boolean;
}

export class CreateOrderDto {
  @ApiProperty({ type: DeliveryAddressDto })
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;

  @ApiPropertyOptional({ example: 'দ্রুত ডেলিভারি দিলে ভালো হয়' })
  @IsOptional() @IsString() @MaxLength(500)
  deliveryNote?: string;

  @ApiPropertyOptional({ example: 'WELCOME10' })
  @IsOptional() @IsString() @MaxLength(50)
  couponCode?: string;

  @ApiPropertyOptional({ enum: ['CASH_ON_DELIVERY'], default: 'CASH_ON_DELIVERY' })
  @IsOptional()
  @IsEnum(['CASH_ON_DELIVERY'], { message: 'শুধুমাত্র CASH_ON_DELIVERY সমর্থিত' })
  paymentMethod?: string = 'CASH_ON_DELIVERY';
}
