import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuards extends AuthGuard([
  'jwt',
  ...(process.env.GOOGLE_CLIENT_ID ? ['google'] : []),
]) {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Proceed with default AuthGuard logic
    return super.canActivate(context) as Promise<boolean>;
  }
}
