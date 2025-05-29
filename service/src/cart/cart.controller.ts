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
    const totals = await this.cartService.calculateTotal(cart);
    return { ...cart, ...totals };
  }

  @Post('items')
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiResponse({ status: 201, type: CartWithTotalsDto })
  async addToCart(
    @Request() req,
    @Body() dto: AddToCartDto,
  ): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.addToCart(req.user, dto.product, dto.quantity);
    const totals = await this.cartService.calculateTotal(cart);
    return { ...cart, ...totals };
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Изменить количество товара' })
  @ApiResponse({ status: 200, type: CartWithTotalsDto })
  async updateCartItem(
    @Request() req,
    @Param('id') itemId: string,
    @Body('quantity') quantity: number,
  ): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.updateCartItem(req.user, itemId, quantity);
    const totals = await this.cartService.calculateTotal(cart);
    return { ...cart, ...totals };
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
    const totals = await this.cartService.calculateTotal(cart);
    return { ...cart, ...totals };
  }

  @Delete()
  @HttpCode(200)
  @ApiOperation({ summary: 'Очистить всю корзину' })
  @ApiResponse({ status: 200, type: CartWithTotalsDto })
  async clearCart(@Request() req): Promise<CartWithTotalsDto> {
    const cart = await this.cartService.clearCart(req.user);
    const totals = await this.cartService.calculateTotal(cart);
    return { ...cart, ...totals };
  }
}