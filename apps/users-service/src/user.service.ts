import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(userId: string) {
    const user = await this.userRepository.findBy({ id: userId });

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
        error: 'User not found',
      });
    }

    return user;
  }
}
