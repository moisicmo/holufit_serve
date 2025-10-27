import { ApiProperty } from "@nestjs/swagger";
import { AuthProviderType } from "@prisma/client";
import { IsEmail, IsEnum, IsString } from "class-validator";

export class CreateAuthDto {

  @IsEnum(AuthProviderType)
  @ApiProperty({
    example: AuthProviderType.email,
    description: 'Tipo de documento del usuario',
    enum: AuthProviderType,
  })
  provider: AuthProviderType;

  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'shirley.arias.mo@gmail.com',
    description: 'Correo electrónico del usuario',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: '123123',
    description: 'Contraseña del usuario',
  })
  password: string;
}
