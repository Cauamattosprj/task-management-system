import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../../../packages/types/dto/user/user.dto';

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
