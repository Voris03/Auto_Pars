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
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from '../database/entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: Order,
  })
  async createOrder(
    @Request() req,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.createOrder(
      req.user,
      createOrderDto.shippingAddress,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all user orders' })
  @ApiResponse({
    status: 200,
    description: 'Return all user orders',
    type: [Order],
  })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiQuery({ name: 'startDate', type: Date, required: false })
  @ApiQuery({ name: 'endDate', type: Date, required: false })
  async findAll(
    @Request() req,
    @Query('status') status?: OrderStatus,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<Order[]> {
    return this.ordersService.findAll(req.user, status, startDate, endDate);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiResponse({
    status: 200,
    description: 'Return order statistics',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        byStatus: { type: 'object' },
        averageOrderValue: { type: 'number' },
      },
    },
  })
  async getStatistics(@Request() req) {
    return this.ordersService.getOrderStatistics(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiResponse({ status: 200, description: 'Return order by id', type: Order })
  async findOne(@Request() req, @Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(req.user, id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated',
    type: Order,
  })
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.ordersService.updateStatus(
      req.user,
      id,
      updateStatusDto.status,
    );
  }

  @Put(':id/tracking')
  @ApiOperation({ summary: 'Update order tracking number' })
  @ApiResponse({
    status: 200,
    description: 'Order tracking number updated',
    type: Order,
  })
  async updateTrackingNumber(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTrackingDto: UpdateTrackingDto,
  ): Promise<Order> {
    return this.ordersService.updateTrackingNumber(
      req.user,
      id,
      updateTrackingDto.trackingNumber,
    );
  }
}
