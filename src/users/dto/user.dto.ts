import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'ChocoBowl',
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'choco.bowl@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'The password for the user account',
    minLength: 6,
    example: 'Password@123',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'Choco Bowl',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
