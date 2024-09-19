import { ApiProperty } from '@nestjs/swagger';

import { RegisterDto } from './register.dto';

export class RegisterResponseDto extends RegisterDto {
  @ApiProperty({
    description: 'Optional token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  token?: string; // Optional token if applicable, ideally protected routes after successful registrations
}
