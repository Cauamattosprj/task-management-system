import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { UserRegisterDTO } from '@dto/user/register.dto';
import { UserDTO } from '@dto/user/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserById(userId: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        Logger.log('User with this id not found', userId);
      }
      return user;
    } catch (error) {
      Logger.error(error);
    }
  }

  async registerUser(userRegisterDTO: UserRegisterDTO) {
    Logger.log('Registering user', userRegisterDTO);
    try {
      const registeredUser: UserDTO =
        await this.userRepository.save(userRegisterDTO);
      Logger.log('User registered', registeredUser);
      return registeredUser;
    } catch (error) {
      Logger.error(error);
    }
  }

  async getUserByEmail(userEmail: string) {
    console.log('GET USER METODO: ', userEmail);
    const user = await this.userRepository.findOneBy({ email: userEmail });

    if (!user) {
      Logger.log(`Usuário não encontrado - email: `, userEmail);
      return null;
    }

    Logger.log(`Usuário encontrado, usuário: `, user);
    return user;
  }
}
