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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { RefreshTokenPayload } from './types';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USERS_SERVICE as InjectionToken)
    private readonly userClient: ClientProxy,

    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}

  async refresh(refreshToken: string) {
    console.log('Refresh method');
    console.log('Refresh token', refreshToken);

    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      console.log(payload);

      const session = await this.sessionRepo.findOne({
        where: { id: payload.sessionId },
      });

      const user = await firstValueFrom<PublicUserDTO>(
        this.userClient.send('user.get.byId', payload.sub),
      );

      console.log('ALL SESSION ON DB', await this.sessionRepo.find());

      console.log('session: ', session);
      console.log('user: ', user);

      if (!session)
        throw new RpcException({
          message: 'Session not found',
          statusCode: 401,
        });

      if (session.expiresAt < new Date()) {
        throw new RpcException({
          message: 'Session expired',
          statusCode: 401,
        });
      }

      const isValid = await verify(session.refreshTokenHash, refreshToken);

      if (!isValid) {
        await this.sessionRepo.delete({ id: session.id });
        throw new RpcException({
          message: 'Refresh token invalid',
          statusCode: 401,
        });
      }

      const newRefreshToken = this.generateRefreshToken(payload.sub);

      session.refreshTokenHash = await hash(newRefreshToken);
      await this.sessionRepo.save(session);

      const publicUserDto = new PublicUserDTO();
      publicUserDto.email = user.email;
      publicUserDto.id = user.id;
      publicUserDto.role = user.role;
      const accessToken = this.generateAccessToken(publicUserDto);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      Logger.error('Error on payload', error);
      throw new RpcException({
        statusCode: error.statusCode ?? 500,
        message: error.message ?? 'Unknown Error',
      });
    }
  }

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

    const accessToken = this.generateAccessToken(registeredUser);

    const safeUser = plainToInstance(PublicUserDTO, registeredUser, {
      excludeExtraneousValues: true,
    });

    return {
      user: safeUser,
      accessToken,
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

      if (!validPassword) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid password',
        });
      }

      const accessToken = this.generateAccessToken(existingUser);
      const refreshToken = this.generateRefreshToken(existingUser.id);

      const { sessionId }: { sessionId: string } = this.jwtService.verify(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      try {
        const session = await this.sessionRepo.save({
          id: sessionId,
          userId: existingUser.id,
          refreshTokenHash: await hash(refreshToken),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });
      } catch (error) {
        Logger.error('Error saving session', error);
        throw new RpcException({
          statusCode: 500,
          message: 'Error saving session. Try again.',
        });
      }

      return { accessToken, refreshToken };
    } catch (e) {
      Logger.error('Not an valid argon2 password hash', e);
      throw new RpcException({
        statusCode: 400,
        message: 'This password hash do not have an valid algorithm.',
      });
    }
  }

  generateAccessToken(publicUserDto: PublicUserDTO) {
    return this.jwtService.sign(
      {
        sub: publicUserDto.id,
        email: publicUserDto.email,
        role: publicUserDto.role,
      },
      { expiresIn: '15m', secret: process.env.JWT_ACCESS_SECRET },
    );
  }

  generateRefreshToken(userId: string) {
    const sessionId = crypto.randomUUID();

    return this.jwtService.sign(
      {
        sub: userId,
        sessionId,
      },
      {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );
  }

  async validateToken(token: string) {
    try {
      const decoded: { sub: string; role: string; email: string } =
        await this.jwtService.verify(token);
      return {
        valid: true,
        userId: decoded.sub,
        role: decoded.role,
        email: decoded.email,
      };
    } catch (error: any) {
      Logger.error('Error validating token', error);
      return { valid: false, userId: null, role: null };
    }
  }
}
