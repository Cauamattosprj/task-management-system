import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UserLoginDTO } from '../../../packages/types/dto/user/login.dto';
import { UserRegisterDTO } from '../../../packages/types/dto/user/register.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth-login')
  async login(@Payload() loginDto: UserLoginDTO) {
    try {
      console.log('auth-login recebeu a mensagem: ', loginDto);
      return await this.appService.login(loginDto);
    } catch (error) {
      if (error instanceof RpcException) throw error;
    }
  }

  @MessagePattern('auth-register')
  registerUser(@Payload() registerDTO: UserRegisterDTO) {
    try {
      return this.appService.register(registerDTO);
    } catch (error) {
      if (error instanceof RpcException) throw error;
    }
  }

  @MessagePattern('auth-validate-token')
  async validateToken(@Payload() token: string) {
    return this.appService.validateToken(token);
  }
}
