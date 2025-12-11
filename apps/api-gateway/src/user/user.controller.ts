import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { USERS_SERVICE } from '@constants';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUser(@Req() req: { user: { userId: string } }) {
    const userId: string = req.user.userId;
    const user =await firstValueFrom<Observable<any>>(
      this.userClient.send('user-get-by-id', userId),
    );

    return user;
  }
}
