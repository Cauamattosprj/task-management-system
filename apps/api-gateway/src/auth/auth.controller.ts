import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { UserLoginDTO } from '@dtos/user/login.dto';
import { UserRegisterDTO } from '@dtos/user/register.dto';
import { PublicUserDTO } from '@dtos/user/public-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@constants';
import { firstValueFrom } from 'rxjs';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() body: { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const authRefreshResponse: { accessToken: string; refreshToken: string } =
      await firstValueFrom(
        this.authClient.send<{ accessToken: string; refreshToken: string }>(
          'auth-refresh',
          body.refreshToken,
        ),
      );

    res.cookie('refreshToken', authRefreshResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production' ? true : false,
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return authRefreshResponse;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() userLoginDto: UserLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResponse: { accessToken: string; refreshToken: string } =
      await firstValueFrom(
        this.authClient.send<{ accessToken: string; refreshToken: string }>(
          'auth-login',
          userLoginDto,
        ),
      );

    res.cookie('refreshToken', authResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production' ? true : false,
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      accessToken: authResponse.accessToken,
    };
  }

  @Post('register')
  register(@Body() userRegisterDto: UserRegisterDTO) {
    return this.authClient.send('auth-register', userRegisterDto);
  }
}
