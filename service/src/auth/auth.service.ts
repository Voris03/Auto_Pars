import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    this.logger.debug('Registering new user:', userData);
    try {
      const existingUser = await this.usersService.findByEmail(userData.email);
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.usersService.create({
        ...userData,
        password: hashedPassword,
      });

      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);

      this.logger.debug('Registration successful');
      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        },
      };
    } catch (error) {
      this.logger.error('Registration failed:', error);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.debug(`Validating user with email: ${email}`);
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.debug('User not found');
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.debug('Invalid password');
      return null;
    }

    const { password: _, ...result } = user;
    this.logger.debug('User validation successful');
    return result;
  }

  async login(loginData: any) {
    this.logger.debug('Login attempt:', loginData);
    try {
      const user = await this.validateUser(loginData.email, loginData.password);
      if (!user) {
        this.logger.debug('Invalid credentials');
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);

      this.logger.debug('Login successful');
      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        },
      };
    } catch (error) {
      this.logger.error('Login failed:', error);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    this.logger.debug('Password reset requested for email:', email);
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15);
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1);

      // Save reset token and expiration
      await this.usersService.update(user.id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      });

      this.logger.debug('Password reset token generated');
      return { message: 'Password reset instructions sent to your email' };
    } catch (error) {
      this.logger.error('Password reset request failed:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    this.logger.debug('Password reset attempt with token');
    try {
      const user = await this.usersService.findByResetToken(token);
      if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      if (user.resetPasswordExpires < new Date()) {
        throw new BadRequestException('Reset token has expired');
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password and clear reset token
      await this.usersService.update(user.id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      this.logger.debug('Password reset successful');
      return { message: 'Password has been reset successfully' };
    } catch (error) {
      this.logger.error('Password reset failed:', error);
      throw error;
    }
  }
}
