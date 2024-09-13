export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  name?: string;
  roles?: number[] | string[];
}
