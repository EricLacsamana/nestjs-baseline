import { ApiProperty } from '@nestjs/swagger';

import { RoleDto } from 'src/roles/dto/role.dto';

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 11,
  })
  id: number;

  @ApiProperty({
    description: 'The username of the user',
    example: 'juan_delacruz',
  })
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'juan.delacruz@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'Juan Dela Cruz',
  })
  name: string;

  @ApiProperty({
    description: 'The roles assigned to the user',
    type: [RoleDto],
    example: [
      { id: 2, name: 'Admin', identifier: 'admin' },
      { id: 3, name: 'User', identifier: 'user' },
    ],
  })
  roles: RoleDto[];
}
