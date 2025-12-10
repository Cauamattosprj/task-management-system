import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UserRegisterDTO } from '@dto/user/register.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user-get-by-email')
  async getUserByEmail(@Payload() email: string) {
    return await this.userService.getUserByEmail(email);
  }

  @MessagePattern('user-get-by-id')
  async getUserById(@Payload() userId: string) {
    return await this.userService.getUserById(userId);
  }

  @MessagePattern('user-register')
  async registerUser(@Payload() userRegisterDTO: UserRegisterDTO) {
    return await this.userService.registerUser(userRegisterDTO);
  }
}
