// src/orders/dto/create-order.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum DeliveryType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
}

class CardInfoDto {
  @ApiProperty({ example: '1234 5678 9012 3456' })
  @IsString()
  number: string;

  @ApiProperty({ example: '12/25' })
  @IsString()
  date: string;

  @ApiProperty({ example: '123' })
  @IsString()
  cvv: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'ул. Примерная, д. 1, кв. 1' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({ enum: DeliveryType })
  @IsEnum(DeliveryType)
  deliveryType: DeliveryType;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ required: false, type: () => CardInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CardInfoDto)
  cardInfo?: CardInfoDto;
}