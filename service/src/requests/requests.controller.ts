import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestForm, RequestStatus } from '../database/entities/request-form.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(
    @Body() requestData: {
      name: string;
      email: string;
      phone: string;
      message: string;
    },
    @Request() req: ExpressRequest & { user?: { id: string } },
  ): Promise<RequestForm> {
    return this.requestsService.create(requestData, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<RequestForm[]> {
    return this.requestsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RequestForm> {
    return this.requestsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { status: RequestStatus; adminResponse?: string },
  ): Promise<RequestForm> {
    return this.requestsService.updateStatus(id, data);
  }
} 