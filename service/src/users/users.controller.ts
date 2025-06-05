import { Controller, Get, Put, Delete, Body, Param, Post, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';



@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, updateData);
  }

  @Post(':id/parts')
  async attachPart(
    @Param('id') id: string,
    @Body('partId') partId: number,
  ): Promise<User> {
    return this.usersService.attachPart(id, partId);
  }

  @Get(':id/orders')
  async getUserOrders(@Param('id') id: string) {
    return this.usersService.getOrders(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}