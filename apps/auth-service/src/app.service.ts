import {
  Inject,
  Injectable,
  InjectionToken,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDTO } from '@dto/user/login.dto';
import { UserDTO } from '@dto/user/user.dto';
import { UserRegisterDTO } from '@dto/user/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { USERS_SERVICE } from '@constants/inject-tokens';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USERS_SERVICE as InjectionToken)
    private readonly userClient: ClientProxy,
  ) {}

  async register(registerDto: UserRegisterDTO) {
    const existingUser = await firstValueFrom(
      this.userClient.send('user-get-by-email', registerDto.email),
    );

    console.log('Existing user: ', existingUser);

    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'User already exists',
        error: 'Conflict',
      });
    }

    const registeredUser: UserDTO = await firstValueFrom<UserDTO>(
      this.userClient.send('user-register', registerDto),
    );

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
    console.log('Service: Login: ', userLoginDto);
    const existingUser: UserDTO = await firstValueFrom(
      this.userClient.send('user-get-by-email', userLoginDto.email),
    );

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
