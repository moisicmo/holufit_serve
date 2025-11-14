import { ApiProperty } from "@nestjs/swagger";
import { AuthProviderType, Gender } from "@prisma/client";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
export class ActivityDto {
  @IsString()
  @ApiProperty({ example: '06:00', description: 'Hora de la actividad (HH:mm)' })
  time: string;

  @IsString()
  @ApiProperty({ example: 'Levantarse', description: 'Nombre o título de la actividad' })
  title: string;
}

export class CreateUserDto {
  @IsEnum(AuthProviderType)
  @ApiProperty({
    example: AuthProviderType.email,
    description: 'Tipo de proveedor de autenticación',
    enum: AuthProviderType,
  })
  provider: AuthProviderType;

  @IsString()
  @ApiProperty({ example: 'https://holufitserve-production.up.railway.app/static/animals/crocodile.png', description: 'url de la imagen' })
  image: string;

  @IsString()
  @ApiProperty({ example: 'maria', description: 'Nombre del usuario' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'perez', description: 'Apellido del usuario' })
  lastName: string;

  @IsEmail()
  @ApiProperty({ example: 'maria@gmail.com', description: 'Correo electrónico del usuario' })
  email: string;

  @IsString()
  @ApiProperty({ example: '123123', description: 'Número de documento del usuario' })
  numberDocument: string;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ example: '1990-05-20T00:00:00.000Z', description: 'Fecha de nacimiento del usuario' })
  birthDate: Date;

  @IsString()
  @ApiProperty({ example: '123123', description: 'Contraseña del usuario' })
  password: string;

  @IsEnum(Gender)
  @ApiProperty({ example: Gender.female, description: 'Género del usuario', enum: Gender })
  gender: Gender;

  @IsNumber()
  @ApiProperty({ example: 170, description: 'Altura del usuario (cm)' })
  height: number;

  @IsNumber()
  @ApiProperty({ example: 90.5, description: 'Peso del usuario (kg)' })
  weight: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    example: ['Dejar de comer pan', 'Dejar el azúcar'],
    description: 'Hábitos que desea adoptar el usuario (mínimo 1)',
  })
  habits: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    example: ['Andar en bicicleta', 'Silenciar el teléfono en la noche'],
    description: 'Acciones que el usuario quiere hacer más (puede estar vacío)',
  })
  doMore: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    example: ['Procrastinar', 'Apagar alarma y seguir durmiendo'],
    description: 'Acciones que el usuario quiere hacer menos (puede estar vacío)',
  })
  doLess: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDto)
  @ApiProperty({
    type: [ActivityDto],
    description: 'Actividades diarias programadas por el usuario (puede estar vacío)',
    example: [
      { time: '06:00', title: 'Levantarse' },
      { time: '06:30', title: 'Entrenar cuerpo' },
    ],
  })
  activities: ActivityDto[];
}

