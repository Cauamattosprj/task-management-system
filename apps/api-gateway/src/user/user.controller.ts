import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getPublicUser(@Req() req: { user: { userId: string } }) {
    const userId: string = req.user.userId;
    const user = this.userService.getUserById(userId);

    return user;
  }
}
