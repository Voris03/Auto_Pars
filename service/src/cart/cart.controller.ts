import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { Cart } from '../database/entities/cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

export class CartWithTotalsDto extends Cart {
  total: number;
  itemsCount: number;
}

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({
    status: 200,
    description: 'Return user cart',
    type: CartWithTotalsDto,
  })
  async getCart(@Request() req): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.getOrCreateCart(req.user);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({
    status: 200,
    description: 'Item added to cart',
    type: CartWithTotalsDto,
  })
  async addToCart(
    @Request() req,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.addToCart(
      req.user,
      addToCartDto.productId,
      addToCartDto.quantity,
    );
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated',
    type: CartWithTotalsDto,
  })
  async updateCartItem(
    @Request() req,
    @Param('id') itemId: number,
    @Body('quantity') quantity: number,
  ): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.updateCartItem(
      req.user,
      itemId,
      quantity,
    );
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart',
    type: CartWithTotalsDto,
  })
  async removeFromCart(
    @Request() req,
    @Param('id') itemId: number,
  ): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.removeFromCart(req.user, itemId);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart cleared',
    type: CartWithTotalsDto,
  })
  async clearCart(@Request() req): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.clearCart(req.user);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }
}
