import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UserService } from './user.service';

@Controller('users')
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

  @Get(':id')
  async getUserById(
    @Param('id') id: string,
    @Req() req: { user: { userId: string } },
  ) {
    const user = this.userService.getUserById(id);

    return user;
  }
}
