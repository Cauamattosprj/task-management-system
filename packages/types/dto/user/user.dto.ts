import { Expose, Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

export class UserDTO {
  @IsUUID()
  @IsNotEmpty()
  @Expose()
  id!: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  @Expose()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Expose()
  username!: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  role: string;
}
