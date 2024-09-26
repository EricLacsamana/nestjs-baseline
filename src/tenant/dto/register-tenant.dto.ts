import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterTenantDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  subdomain: string;

  @IsEmail()
  email: string;

  @IsOptional()
  logoUrl?: string; // Optional logo URL

  // @IsNotEmpty()
  // @IsString()
  // password?: string; // You might want to hash this later
}
