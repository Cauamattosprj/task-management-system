import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserLoginDTO } from '@dtos/login.dto';
import { UserRegisterDTO } from '@dtos/register.dto';
import { AUTH_SERVICE } from 'src/app.module';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('login')
  login(@Body() userLoginDto: UserLoginDTO) {
    return this.authClient.send('auth-login', userLoginDto);
  }

  @Post('register')
  register(@Body() userRegisterDto: UserRegisterDTO) {
    return this.authClient.send('auth-register', userRegisterDto);
  }
}
