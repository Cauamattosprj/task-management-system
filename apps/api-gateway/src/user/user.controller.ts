import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getPublicUser(@Req() req: { user: { userId: string } }) {
    const userId: string = req.user.userId;
    const user = this.userService.getUserById(userId);

    return user;
  }

  @Get()
  async getAllUsers(@Req() req: { user: { userId: string } }) {
    const userId: string = req.user.userId;
    const user = this.userService.getAllUsers();

    return user;
  }
}
