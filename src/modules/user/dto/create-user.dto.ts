import { ApiProperty } from "@nestjs/swagger";
import { AuthProviderType, Gender } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsString } from "class-validator";

export class CreateUserDto {
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
    example: 'maria@gmail.com',
    description: 'Correo electrónico del usuario',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: '123123',
    description: 'Número de documento del usuario',
  })
  numberDocument: string;

  @IsString()
  @ApiProperty({
    example: 'maria',
    description: 'Nombre del usuario',
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'perez',
    description: 'Apellido del usuario',
  })
  lastName: string;

  @IsEnum(Gender)
  @ApiProperty({
    example: Gender.female,
    description: 'Género del usuario',
    enum: Gender,
  })
  gender: Gender;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: '1990-05-20T00:00:00.000Z',
    description: 'Fecha de nacimiento del usuario',
  })
  birthDate: Date;


  @IsString()
  @ApiProperty({
    example: '123123',
    description: 'Contraseña del usuario',
  })
  password: string;
}
