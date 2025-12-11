import {
  Inject,
  Injectable,
  InjectionToken,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDTO } from '@dto/user/login.dto';
import { UserDTO } from '@dto/user/user.dto';
import { PublicUserDTO } from '@dto/user/public-user.dto';
import { UserRegisterDTO } from '@dto/user/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { USERS_SERVICE } from '@constants/inject-tokens';
import { firstValueFrom } from 'rxjs';
import { hash, verify } from 'argon2';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USERS_SERVICE as InjectionToken)
    private readonly userClient: ClientProxy,
  ) {}

  async register(registerDto: UserRegisterDTO) {
    const existingUser = await firstValueFrom(
      this.userClient.send<UserDTO | null>(
        'user-get-by-email',
        registerDto.email,
      ),
    );

    console.log('Existing user: ', existingUser);

    if (existingUser) {
      Logger.log('service.register user not found', existingUser);
      throw new RpcException({
        statusCode: 409,
        message: 'User already exists',
        error: 'Conflict',
      });
    }

    const passwordHash = await hash(registerDto.password, {
      type: 2,
      memoryCost: 64 * 1024,
      timeCost: 3,
      parallelism: 1,
      salt: Buffer.from(crypto.randomUUID()),
    });

    const registeredUser = await firstValueFrom<UserDTO>(
      this.userClient.send('user-register', {
        ...registerDto,
        password: passwordHash,
      }),
    );

    const token = this.jwtService.sign({
      sub: registeredUser.id,
      login: registeredUser.email,
      role: registeredUser.role,
    });

    const safeUser = plainToInstance(PublicUserDTO, registeredUser, {
      excludeExtraneousValues: true,
    });

    return {
      user: safeUser,
      token: token,
    };
  }

  async login(userLoginDto: UserLoginDTO) {
    console.log('Service: Login: ', userLoginDto);
    const existingUser: UserDTO = await firstValueFrom(
      this.userClient.send('user.auth.get.byEmail', userLoginDto.email),
    );

    console.log('user: ', existingUser);

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

    try {
      const validPassword = await verify(
        existingUser.password,
        userLoginDto.password,
      );

      if (validPassword) {
        const token = this.jwtService.sign({
          sub: existingUser.id,
          login: existingUser.email,
          role: existingUser.role,
        });
        return { token: token };
      }

      throw new RpcException({
        statusCode: 401,
        message: 'Invalid password',
      });
    } catch (e) {
      Logger.error('Not an valid argon2 password hash', e);
      throw new RpcException({
        statusCode: 400,
        message: 'This password hash do not have an valid algorithm.',
      });
    }
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
