import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Cart } from '../database/entities/cart.entity';

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
  @ApiOperation({ summary: 'Получить корзину пользователя' })
  @ApiResponse({ status: 200, type: CartWithTotalsDto })
  async getCart(@Request() req): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.getOrCreateCart(req.user);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return { ...cart, total, itemsCount };
  }

  @Post('items')
  @ApiOperation({ summary: 'Добавить товар в корзину по productId' })
  @ApiResponse({ status: 201, type: CartWithTotalsDto })
  async addToCart(
    @Request() req,
    @Body() dto: AddToCartDto,
  ): Promise<CartWithTotalsDto> {
    const { productId, quantity } = dto;

    if (!productId || quantity < 1) {
      throw new BadRequestException(
        'Некорректные данные: productId и quantity обязательны',
      );
    }
    const cart = await this.cartService.addToCart(
      req.user,
      String(productId),
      quantity,
    );
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return { ...cart, total, itemsCount };
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Изменить количество товара в корзине' })
  @ApiResponse({ status: 200, type: CartWithTotalsDto })
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
    return { ...cart, total, itemsCount };
  }

  @Delete('items/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiResponse({ status: 200, type: CartWithTotalsDto })
  async removeFromCart(
    @Request() req,
    @Param('id') itemId: string,
  ): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.removeFromCart(req.user, itemId);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return { ...cart, total, itemsCount };
  }

  @Delete()
  @HttpCode(200)
  @ApiOperation({ summary: 'Очистить корзину пользователя' })
  @ApiResponse({ status: 200, type: CartWithTotalsDto })
  async clearCart(@Request() req): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.clearCart(req.user);
    const { total, itemsCount } = await this.cartService.calculateTotal(cart);
    return { ...cart, total, itemsCount };
  }
}
