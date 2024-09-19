import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({
    description: 'The unique identifier of the role',
    example: 2,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the role',
    example: 'Admin',
  })
  name: string;

  @ApiProperty({
    description: 'The identifier for the role',
    example: 'admin',
  })
  identifier: string;
}
