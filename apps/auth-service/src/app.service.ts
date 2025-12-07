import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDTO } from '../../../packages/types/dto/user/login.dto';
import { UserRegisterDTO } from '../../../packages/types/dto/user/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  register(registerDto: UserRegisterDTO) {
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

  login(userLoginDto: UserLoginDTO) {
    const existingUser = this.userRepository.findByEmail(userLoginDto.email);

    if (!existingUser) {
      Logger.log(
        `User with email ${userLoginDto.email} do not exist and have tried to login`,
      );
      throw new NotFoundException('This user is not finded on db.');
    }

    if (existingUser.password == userLoginDto.password) {
      const payload = {
        sub: existingUser.id,
        username: existingUser.username,
        role: existingUser.role,
      };

      const token = this.jwtService.sign(payload);

      return token;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
