import { IsInt, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePermissionsDto {
  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @IsInt()
  @IsNotEmpty()
  resourceId: number;

  @IsInt()
  @IsNotEmpty()
  actionId: number;

  @IsBoolean()
  @IsOptional()
  allowed?: boolean;
}
