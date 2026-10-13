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

// All supported payment methods
export enum SupportedPaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  SSLCOMMERZ       = 'SSLCOMMERZ',
  BKASH            = 'BKASH',
  NAGAD            = 'NAGAD',
  ROCKET           = 'ROCKET',
  VISA             = 'VISA',
  MASTERCARD       = 'MASTERCARD',
  AMEX             = 'AMEX',
  DEBIT_CARD       = 'DEBIT_CARD',
  CREDIT_CARD      = 'CREDIT_CARD',
  INTERNET_BANKING = 'INTERNET_BANKING',
  BANK_TRANSFER    = 'BANK_TRANSFER',
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

  @ApiPropertyOptional({
    enum: SupportedPaymentMethod,
    default: SupportedPaymentMethod.CASH_ON_DELIVERY,
    description: 'Payment method. Online methods (SSLCOMMERZ/BKASH etc.) return a gatewayUrl for redirect.',
  })
  @IsOptional()
  @IsEnum(SupportedPaymentMethod, { message: 'অবৈধ পেমেন্ট পদ্ধতি' })
  paymentMethod?: SupportedPaymentMethod = SupportedPaymentMethod.CASH_ON_DELIVERY;
}
