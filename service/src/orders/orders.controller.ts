import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from '../database/entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { User } from '../database/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать заказ' })
  @ApiResponse({
    status: 201,
    description: 'Заказ успешно создан',
    type: Order,
  })
  async createOrder(
    @CurrentUser() user: User,
    @Body() dto: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.createOrder(user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все заказы текущего пользователя' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiQuery({ name: 'startDate', type: Date, required: false })
  @ApiQuery({ name: 'endDate', type: Date, required: false })
  @ApiResponse({ status: 200, description: 'Список заказов', type: [Order] })
  async findAll(
    @CurrentUser() user: User,
    @Query('status') status?: OrderStatus,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<Order[]> {
    return this.ordersService.findAll(user, status, startDate, endDate);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Получить статистику заказов пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Объект со статистикой',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        averageOrderValue: { type: 'number' },
        byStatus: {
          type: 'object',
          additionalProperties: { type: 'number' },
        },
      },
    },
  })
  async getStats(@CurrentUser() user: User) {
    return this.ordersService.getOrderStatistics(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить конкретный заказ по ID' })
  @ApiResponse({ status: 200, description: 'Детали заказа', type: Order })
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<Order> {
    return this.ordersService.findOne(user, id);
  }

  @Put(':id/status')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Изменить статус заказа (только админ)' })
  @ApiResponse({ status: 200, description: 'Статус обновлён', type: Order })
  async updateStatus(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.ordersService.updateStatus(user, id, dto.status);
  }

  @Put(':id/tracking')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Добавить трек-номер к заказу (только админ)' })
  @ApiResponse({ status: 200, description: 'Трек-номер добавлен', type: Order })
  async updateTracking(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateTrackingDto,
  ): Promise<Order> {
    return this.ordersService.updateTrackingNumber(
      user,
      id,
      dto.trackingNumber,
    );
  }
}
