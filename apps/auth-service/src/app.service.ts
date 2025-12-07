import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDTO } from '../../../packages/types/dto/user/login.dto';
import { UserRegisterDTO } from '../../../packages/types/dto/user/register.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: UserRegisterDTO) {
    const existingUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User already registered');
    }

    const registeredUser = await this.userRepository.save(registerDto);

    const token = this.jwtService.sign({
      sub: registeredUser.id,
      login: registeredUser.email,
      role: registeredUser.role,
    });

    return {
      user: registeredUser,
      token,
    };
  }

  async login(userLoginDto: UserLoginDTO) {
    const existingUser = await this.userRepository.findOneBy({
      email: userLoginDto.email,
    });

    if (!existingUser) {
      Logger.log(
        `User with email ${userLoginDto.email} do not exist and have tried to login`,
      );
      throw new NotFoundException('This user is not finded on db.');
    }

    if (existingUser.password == userLoginDto.password) {
      const token = this.jwtService.sign({
        sub: existingUser.id,
        login: existingUser.email,
        role: existingUser.role,
      });

      return token;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
