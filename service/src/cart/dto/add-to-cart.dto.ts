// add-to-cart.dto.ts
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    example: 1020,
    description: 'ID товара (число)',
  })
  @IsInt({ message: 'productId должен быть целым числом' })
  @Min(1, { message: 'productId должен быть больше 0' })
  productId: number;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Количество товара',
  })
  @IsInt({ message: 'quantity должен быть целым числом' })
  @Min(1, { message: 'quantity должен быть не менее 1' })
  quantity: number;
}
