import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { AUTH_SERVICE } from 'src/constants';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUser(@Req() req: { user: { userId: string } }) {
    const userId: string = req.user.userId;
    const user = await firstValueFrom<Observable<any>>(
      this.authClient.send('user-get', userId),
    );

    return user;
  }
}
