import { Role } from "src/auth/entities/role.entity";

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  name?: string;
  roles?: number [] | string [];
}
