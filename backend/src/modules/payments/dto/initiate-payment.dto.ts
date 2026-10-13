import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OnlinePaymentMethod {
  SSLCOMMERZ   = 'SSLCOMMERZ',
  BKASH        = 'BKASH',
  NAGAD        = 'NAGAD',
  ROCKET       = 'ROCKET',
  VISA         = 'VISA',
  MASTERCARD   = 'MASTERCARD',
  AMEX         = 'AMEX',
  DEBIT_CARD   = 'DEBIT_CARD',
  CREDIT_CARD  = 'CREDIT_CARD',
}

export class InitiatePaymentDto {
  @ApiProperty({ description: 'Order ID to pay for' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ enum: OnlinePaymentMethod })
  @IsEnum(OnlinePaymentMethod)
  paymentMethod: OnlinePaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  customerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  customerEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  customerPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  customerAddress?: string;
}
