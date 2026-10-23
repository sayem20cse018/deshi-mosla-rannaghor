import {
  IsString, IsOptional, IsEnum, IsNotEmpty, IsEmail,
  MaxLength, ValidateNested, IsArray, IsInt, Min, IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SupportedPaymentMethod } from './create-order.dto';

export class GuestDeliveryAddressDto {
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(100) fullName:    string;
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(20)  phone:       string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() @MaxLength(100) email?: string;
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(50)  division:    string;
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(50)  district:    string;
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(100) area:        string;
  @ApiProperty()  @IsString() @IsNotEmpty() @MaxLength(500) fullAddress: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(10) postalCode?: string;
}

export class GuestOrderItemDto {
  @ApiProperty() @IsString() @IsNotEmpty() productId: string;
  @ApiProperty({ minimum: 1 }) @IsInt() @Min(1) quantity: number;
}

export class CreateGuestOrderDto {
  @ApiProperty({ type: [GuestOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestOrderItemDto)
  items: GuestOrderItemDto[];

  @ApiProperty({ type: GuestDeliveryAddressDto })
  @ValidateNested()
  @Type(() => GuestDeliveryAddressDto)
  deliveryAddress: GuestDeliveryAddressDto;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @MaxLength(500)
  deliveryNote?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @MaxLength(50)
  couponCode?: string;

  @ApiPropertyOptional({
    enum: SupportedPaymentMethod,
    default: SupportedPaymentMethod.CASH_ON_DELIVERY,
  })
  @IsOptional()
  @IsEnum(SupportedPaymentMethod, { message: 'Invalid payment method' })
  paymentMethod?: SupportedPaymentMethod = SupportedPaymentMethod.CASH_ON_DELIVERY;
}