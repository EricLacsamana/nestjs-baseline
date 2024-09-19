import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'The username of the user',
    minLength: 4,
    maxLength: 20,
    example: 'juan_delacruz',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'juan.delacruz@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    minLength: 6,
    maxLength: 20,
    example: 'Password@123',
  })
  @IsString()
  @Length(6, 20)
  password: string;

  @ApiProperty({
    description: 'The full name of the user (optional)',
    required: false,
    example: 'Juan Dela Cruz',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;

  @ApiProperty({
    description: 'The roles assigned to the user (optional)',
    type: [String],
    required: false,
    example: ['admin', 'user'],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roles?: string[]; // Array of role identifiers or names
}
