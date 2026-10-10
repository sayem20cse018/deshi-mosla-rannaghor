import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty() @IsString() productId: string;
  @ApiProperty({ default: 1 }) @IsInt() @Min(1) quantity: number = 1;
}
