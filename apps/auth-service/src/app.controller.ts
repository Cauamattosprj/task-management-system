import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserLoginDTO } from '../../../packages/types/dto/user/login.dto';
import { UserRegisterDTO } from '../../../packages/types/dto/user/register.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth-login')
  login(@Payload() loginDto: UserLoginDTO) {
    return this.appService.login(loginDto);
  }

  @MessagePattern('auth-register')
  registerUser(registerDTO: UserRegisterDTO) {
    return this.appService.register(registerDTO);
  }
}
