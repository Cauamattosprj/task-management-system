import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDTO } from '@dtos/user/login.dto';
import { UserRegisterDTO } from '@dtos/user/register.dto';
import { PublicUserDTO } from '@dtos/user/public-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@constants';
import { firstValueFrom } from 'rxjs';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const authRefreshResponse: { accessToken: string; refreshToken: string } =
      await firstValueFrom(
        this.authClient.send<{ accessToken: string; refreshToken: string }>(
          'auth-refresh',
          refreshToken,
        ),
      );

    res.cookie('refreshToken', authRefreshResponse.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
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
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      accessToken: authResponse.accessToken,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token missing. User already logged out',
      );
    }
    const authRefreshResponse: { accessToken: string; refreshToken: string } =
      await firstValueFrom(
        this.authClient.send<{ accessToken: string; refreshToken: string }>(
          'auth-logout',
          refreshToken,
        ),
      );

    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return authRefreshResponse;
  }

  @Post('register')
  register(@Body() userRegisterDto: UserRegisterDTO) {
    return this.authClient.send('auth-register', userRegisterDto);
  }
}
