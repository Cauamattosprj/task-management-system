import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserLoginDTO } from '../../../../packages/types/dto/user/login.dto';
import { AUTH_SERVICE } from 'src/app.module';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  @Post('login')
  login(@Body() userLoginDto: UserLoginDTO) {
    return this.authClient.send('auth-login', userLoginDto);
  }
}
