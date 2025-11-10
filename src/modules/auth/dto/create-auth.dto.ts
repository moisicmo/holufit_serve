import { ApiProperty } from "@nestjs/swagger";
import { AuthProviderType } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateAuthDto {
  @IsEnum(AuthProviderType)
  @ApiProperty({
    example: AuthProviderType.email,
    description: 'Proveedor de autenticación',
    enum: AuthProviderType,
  })
  provider: AuthProviderType;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'shirley.arias.mo@gmail.com',
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '123123',
    required: false,
  })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkpXVCJ9...', // token de Google
    required: false,
  })
  idToken?: string;
}
