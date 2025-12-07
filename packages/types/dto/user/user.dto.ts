import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserDTO {
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }: {value: string}) => value?.toLowerCase().trim())
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password!: string

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    username!: string
}