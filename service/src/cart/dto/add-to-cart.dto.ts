import { IsNumber, Min, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: 'ID товара', example: 1 })
  @IsNumber()
  @IsInt()
  productId: number;

  @ApiProperty({ description: 'Количество товара', example: 1, minimum: 1 })
  @IsNumber()
  @IsInt()
  @Min(1)
  quantity: number;
} 