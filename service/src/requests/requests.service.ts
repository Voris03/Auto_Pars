import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestForm, RequestStatus } from '../database/entities/request-form.entity';
import { User } from '../database/entities/user.entity';
import { validateEmail, validatePhone } from '../utils/validators';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestForm)
    private requestFormRepository: Repository<RequestForm>,
  ) {}

  async create(
    requestData: {
      name: string;
      email: string;
      phone: string;
      message: string;
    },
    userId?: string,
  ): Promise<RequestForm> {
    const { name, email, phone, message } = requestData;

    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Name is required');
    }

    if (!validateEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    if (!validatePhone(phone)) {
      throw new BadRequestException('Invalid phone number format');
    }

    if (!message || message.length < 10) {
      throw new BadRequestException('Message must be at least 10 characters long');
    }

    const requestForm = this.requestFormRepository.create({
      name,
      email,
      phone,
      message,
      status: RequestStatus.NEW,
      user: userId ? ({ id: userId } as User) : undefined,
    });

    return this.requestFormRepository.save(requestForm);
  }

  async findAll(): Promise<RequestForm[]> {
    return this.requestFormRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUserRequests(userId: string): Promise<RequestForm[]> {
    return this.requestFormRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<RequestForm> {
    const request = await this.requestFormRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return request;
  }

  async updateStatus(
    id: string,
    data: { status: RequestStatus; adminResponse?: string },
  ): Promise<RequestForm> {
    const request = await this.findOne(id);

    request.status = data.status;
    if (data.adminResponse) {
      request.adminResponse = data.adminResponse;
    }

    return this.requestFormRepository.save(request);
  }
}