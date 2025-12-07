import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../../../packages/types/dto/user/user.dto';

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  async registerUser(userDTO: UserDTO) {
    existingUser = this.userRepository.findByEmail(userDTO.email);
    if (existingUser) {
      throw new ConflictException('User already registered');
    }

    registeredUser = await this.userRepository.save(userDTO);

    const token = this.jwtService.sign({
      sub: this.registerUser.id,
      login: this.registerUser.email,
    });

    return {
      user: this.registerUser,
      token,
    };
  }
  getHello(): string {
    return 'Hello World!';
  }
}
