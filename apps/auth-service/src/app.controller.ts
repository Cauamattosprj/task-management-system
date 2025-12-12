import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UserLoginDTO } from '../../../packages/types/dto/user/login.dto';
import { UserRegisterDTO } from '../../../packages/types/dto/user/register.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth-refresh')
  async refresh(@Payload() refreshToken: string) {
    return await this.appService.refresh(refreshToken);
  }

  @MessagePattern('auth-login')
  async login(@Payload() loginDto: UserLoginDTO) {
    return await this.appService.login(loginDto);
  }

  @MessagePattern('auth-register')
  registerUser(@Payload() registerDTO: UserRegisterDTO) {
    return this.appService.register(registerDTO);
  }

  @MessagePattern('auth-validate-token')
  async validateToken(@Payload() token: string) {
    return this.appService.validateToken(token);
  }
}
