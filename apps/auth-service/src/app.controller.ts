import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDTO } from '../../../packages/types/dto/user/login.dto';
import { UserDTO } from '../../../packages/types/dto/user/user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth-login')
  login(@Payload() loginDto: LoginDTO) {
    return this.appService.login(loginDto);
  }

  @MessagePattern('auth-register')
  registerUser(registerDTO: RegisterDTO) {
    return this.appService.register(userDTO);
  }
}
