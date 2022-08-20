import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class LoginUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterUserDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class EditUserDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  isNotificationActive: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  fiat: string;

  @ApiProperty({ required: false })
  @IsOptional()
  deposit: number;
}