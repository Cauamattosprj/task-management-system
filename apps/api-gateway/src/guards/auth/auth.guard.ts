import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';
import { AUTH_SERVICE } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request & { user: { userId: string; role: string } } = context
      .switchToHttp()
      .getRequest();
    const authHeader = req.headers['authorization'] as string;

    if (!authHeader) throw new UnauthorizedException('Missing token');
    const token = authHeader.split(' ')[1];

    const result: { userId: string; role: string; valid: boolean } =
      await firstValueFrom(this.authClient.send('auth-validate-token', token));

    if (!result.valid) throw new UnauthorizedException('Invalid token');

    req.user = { userId: result.userId, role: result.role };

    return true;
  }
}
