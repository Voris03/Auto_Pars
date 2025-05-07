import { Controller, Post, Body, UseGuards, Request, Get, Param, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @Post('register')
  async register(@Body() registerData: RegisterAuthDto) {
    this.logger.debug('Registration attempt with data:', registerData);
    try {
      const result = await this.authService.register(registerData);
      this.logger.debug('Registration successful:', result);
      return result;
    } catch (error) {
      this.logger.error('Registration failed:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ status: 200, description: 'Успешный вход' })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginData: LoginAuthDto) {
    this.logger.debug('Login attempt with data:', loginData);
    try {
      const result = await this.authService.login(loginData);
      this.logger.debug('Login successful:', result);
      return result;
    } catch (error) {
      this.logger.error('Login failed:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Получение профиля пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль успешно получен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Запрос на сброс пароля' })
  @ApiResponse({ status: 200, description: 'Инструкции по сбросу пароля отправлены' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @ApiOperation({ summary: 'Сброс пароля' })
  @ApiResponse({ status: 200, description: 'Пароль успешно сброшен' })
  @ApiResponse({ status: 400, description: 'Неверный или истекший токен' })
  @Post('reset-password/:token')
  async resetPassword(
    @Body('password') password: string,
    @Body('token') token: string,
  ) {
    return this.authService.resetPassword(token, password);
  }
}
