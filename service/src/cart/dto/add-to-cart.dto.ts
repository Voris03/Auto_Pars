// src/cart/dto/add-to-cart.dto.ts
import { IsInt, Min, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ProductSnapshotDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: false })
  brand?: string;

  @ApiProperty({ required: false })
  image?: string;
}

export class AddToCartDto {
  @ApiProperty({ type: ProductSnapshotDto })
  @ValidateNested()
  @Type(() => ProductSnapshotDto)
  product: ProductSnapshotDto;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}