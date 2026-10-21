import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AdminOrderStatus {
  PENDING    = 'PENDING',
  CONFIRMED  = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  PACKED     = 'PACKED',
  SHIPPED    = 'SHIPPED',
  DELIVERED  = 'DELIVERED',
  CANCELLED  = 'CANCELLED',
  RETURNED   = 'RETURNED',
  REFUNDED   = 'REFUNDED',
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: AdminOrderStatus })
  @IsEnum(AdminOrderStatus)
  status: AdminOrderStatus;

  @ApiPropertyOptional({ example: 'Courier: Pathao, Tracking: PT12345' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @ApiPropertyOptional({ example: 'Pathao' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  courierName?: string;

  @ApiPropertyOptional({ example: 'PT123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  trackingNumber?: string;
}
