import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UserRegisterDTO } from '@dto/user/register.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user-get-by-email')
  async getUserByEmail(@Payload() email: string) {
    console.log('CHEGOU USER-GET-BY-EMAIL');
    return await this.userService.getUserByEmail(email);
  }

  @MessagePattern('user-register')
  async registerUser(@Payload() userRegisterDTO: UserRegisterDTO) {
    console.log('CHEGOU USER REGISTER');
    return await this.userService.registerUser(userRegisterDTO);
  }
}
