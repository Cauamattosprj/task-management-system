import { PickType } from "@nestjs/mapped-types";
import { UserDTO } from "./user.dto";

export class UserRegisterDTO extends PickType(UserDTO, ['email', 'password', 'username']) {
    // if the base DTO (UserDTO) increase some day,
    // register DTO will still the same.
}