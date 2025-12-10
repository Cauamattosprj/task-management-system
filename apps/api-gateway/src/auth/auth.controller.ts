import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { UserLoginDTO } from '@dtos/login.dto';
import { UserRegisterDTO } from '@dtos/register.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'src/constants';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() userLoginDto: UserLoginDTO) {
    return this.authClient.send('auth-login', userLoginDto);
  }

  @Post('register')
  register(@Body() userRegisterDto: UserRegisterDTO) {
    return this.authClient.send('auth-register', userRegisterDto);
  }
}
