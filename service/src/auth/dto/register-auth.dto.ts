import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль пользователя (минимум 6 символов)',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Иванов',
    description: 'Фамилия пользователя',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '+79001234567',
    description: 'Номер телефона пользователя',
    required: false,
  })
  phone?: string;
}
