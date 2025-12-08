import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserLoginDTO } from '../../../packages/types/dto/user/login.dto';
import { UserRegisterDTO } from '../../../packages/types/dto/user/register.dto';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { User } from './users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

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
      throw new RpcException({
        statusCode: 409,
        message: 'User already exists',
        error: 'Conflict',
      });
    }

    const registeredUser = await this.userRepository.save(registerDto);

    const token = this.jwtService.sign({
      sub: registeredUser.id,
      login: registeredUser.email,
      role: registeredUser.role,
    });

    return {
      user: registeredUser,
      token: token,
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
      throw new RpcException({
        statusCode: 401,
        message: `User with email ${userLoginDto.email} do not exist and have tried to login`,
        error: 'Not found',
      });
    }

    if (existingUser.password == userLoginDto.password) {
      const token = this.jwtService.sign({
        sub: existingUser.id,
        login: existingUser.email,
        role: existingUser.role,
      });

      return { token: token };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async validateToken(token: string) {
    try {
      const decoded: { sub: string; role: string; userId: string } =
        await this.jwtService.verify(token);
      return { valid: true, userId: decoded.sub, role: decoded.role };
    } catch (error: any) {
      return { valid: false, userId: null, role: null };
    }
  }
}
