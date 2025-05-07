import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackingDto {
  @ApiProperty({
    description: 'Номер отслеживания',
    example: 'TRK123456789',
  })
  @IsString()
  @Matches(/^[A-Z0-9]{10,}$/, {
    message: 'Номер отслеживания должен содержать минимум 10 символов и состоять только из заглавных букв и цифр',
  })
  trackingNumber: string;
} 