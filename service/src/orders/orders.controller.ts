import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Put,
  Query,
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

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать заказ' })
  @ApiResponse({ status: 201, description: 'Заказ создан', type: Order })
  async createOrder(
    @Request() req,
    @Body() dto: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.createOrder(req.user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить заказы текущего пользователя' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiQuery({ name: 'startDate', type: Date, required: false })
  @ApiQuery({ name: 'endDate', type: Date, required: false })
  @ApiResponse({ status: 200, description: 'Список заказов', type: [Order] })
  async findAll(
    @Request() req,
    @Query('status') status?: OrderStatus,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<Order[]> {
    return this.ordersService.findAll(req.user, status, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заказ по ID' })
  @ApiResponse({ status: 200, description: 'Информация о заказе', type: Order })
  async findOne(@Request() req, @Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(req.user, id);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Статистика заказов пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Статистика по заказам',
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
  async getStats(@Request() req) {
    return this.ordersService.getOrderStatistics(req.user);
  }

  @Put(':id/status')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Обновить статус заказа (только для админа)' })
  @ApiResponse({
    status: 200,
    description: 'Статус заказа обновлён',
    type: Order,
  })
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.ordersService.updateStatus(req.user, id, dto.status);
  }

  @Put(':id/tracking')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Обновить трек-номер (только для админа)' })
  @ApiResponse({
    status: 200,
    description: 'Трек-номер обновлён',
    type: Order,
  })
  async updateTracking(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateTrackingDto,
  ): Promise<Order> {
    return this.ordersService.updateTrackingNumber(
      req.user,
      id,
      dto.trackingNumber,
    );
  }
}
