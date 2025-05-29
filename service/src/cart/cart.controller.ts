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
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Получить корзину текущего пользователя' })
  @ApiResponse({ status: 200, type: Cart })
  async getCart(@Request() req): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.getOrCreateCart(req.user);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }

  @Post('items')
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiResponse({ status: 201, type: Cart })
  async addToCart(
    @Request() req,
    @Body() dto: AddToCartDto,
  ): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.addToCart(req.user, dto.product, dto.quantity);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Обновить количество товара в корзине' })
  @ApiResponse({ status: 200, type: Cart })
  async updateCartItem(
    @Request() req,
    @Param('id') itemId: string,
    @Body('quantity') quantity: number,
  ): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.updateCartItem(req.user, itemId, quantity);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiResponse({ status: 200, type: Cart })
  async removeFromCart(
    @Request() req,
    @Param('id') itemId: string,
  ): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.removeFromCart(req.user, itemId);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }

  @Delete()
  @ApiOperation({ summary: 'Очистить корзину' })
  @ApiResponse({ status: 200, type: Cart })
  async clearCart(@Request() req): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.clearCart(req.user);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return Object.assign(cart, { total, itemsCount });
  }
}