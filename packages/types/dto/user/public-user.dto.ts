import { OmitType } from "@nestjs/mapped-types";
import { UserDTO } from "./user.dto";

export class PublicUserDTO extends OmitType(UserDTO, ["password"]) {}
