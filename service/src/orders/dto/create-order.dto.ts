import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'Адрес доставки', example: 'ул. Примерная, д. 1, кв. 1' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  shippingAddress: string;
} 