import { PickType } from '@nestjs/mapped-types';
import { UserDTO } from './user.dto';


export class UserLoginDTO extends PickType(UserDTO, ['email', 'password']) {}