import { USERS_SERVICE } from '@constants';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { instanceToPlain } from 'class-transformer';
import { firstValueFrom } from 'rxjs';

export class UserService {
  constructor(
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  async getUserById(userId: string) {
    const user = await firstValueFrom(
      this.userClient.send('user-get-by-id', userId),
    );
    const safeUser = instanceToPlain(user);
    return safeUser;
  }
}
