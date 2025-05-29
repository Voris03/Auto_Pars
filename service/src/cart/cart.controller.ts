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
  async getCart(@Request() req): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.getOrCreateCart(req.user);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }

  @Post('items')
  async addToCart(
    @Request() req,
    @Body() dto: AddToCartDto,
  ): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.addToCart(
      req.user,
      dto.product,
      dto.quantity,
    );
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }

  @Put('items/:id')
  async updateCartItem(
    @Request() req,
    @Param('id') itemId: string,
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
  async removeFromCart(
    @Request() req,
    @Param('id') itemId: string,
  ): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.removeFromCart(req.user, itemId);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }

  @Delete()
  async clearCart(@Request() req): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.clearCart(req.user);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }
}
