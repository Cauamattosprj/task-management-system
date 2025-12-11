import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserRegisterDTO } from '@dto/user/register.dto';
import { UserDTO } from '@dto/user/user.dto';
import { instanceToPlain } from 'class-transformer';

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

      Logger.log('User registered', registeredUser.id);

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

    const { password, ...userWithoutPassword } = user;

    Logger.log(`Usuário encontrado, usuário: `, userWithoutPassword);
    return userWithoutPassword;
  }

  async getUserByEmailForAuth(userEmail: string) {
    console.log('GET USER METODO: ', userEmail);
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
      select: ['email', 'password', 'id', 'role'],
    });

    if (!user) {
      Logger.log(`Usuário não encontrado - email: `, userEmail);
      return null;
    }

    Logger.log(`Usuário encontrado, usuário: `, user);
    return user;
  }
}
