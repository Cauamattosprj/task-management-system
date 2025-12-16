import { USERS_SERVICE } from '@constants';
import { UserDTO } from '@dtos/user/user.dto';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { instanceToPlain } from 'class-transformer';
import { firstValueFrom } from 'rxjs';

export class UserService {
  constructor(
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  async getAllUsers() {
    const users = await firstValueFrom(
      this.userClient.send<UserDTO[]>('user.get.all', {}),
    );

    return users.map((user) => instanceToPlain(user));
  }

  async getUserById(userId: string) {
    const user = await firstValueFrom(
      this.userClient.send<UserDTO>('user.get.byId', userId),
    );
    const safeUser = instanceToPlain(user);
    return safeUser;
  }
}
