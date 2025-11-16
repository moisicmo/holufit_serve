import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateRadioDto {
  @IsString()
  @ApiProperty({
    example: 'radio 1',
    description: 'Nombre de la radio',
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'radio 1',
    description: 'Nombre de la radio',
  })
  url: string;

  @IsString()
  @ApiProperty({
    example: 'radio 1',
    description: 'Nombre de la radio',
  })
  image: string;

  @IsString()
  @ApiProperty({
    example: 'radio 1',
    description: 'Nombre de la radio',
  })
  category: string;

  @IsString()
  @ApiProperty({
    example: 'radio 1',
    description: 'Nombre de la radio',
  })
  genre: string;

  @IsString()
  @ApiProperty({
    example: 'radio 1',
    description: 'Nombre de la radio',
  })
  country: string;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Nombre de la radio',
  })
  bitrate: number;

  @IsString()
  @ApiProperty({
    example: 'radio 1',
    description: 'Nombre de la radio',
  })
  codec: string;

  @IsArray()
  @ApiProperty({
    example: 'radio 1',
    description: 'Nombre de la radio',
  })
  tags: string[];

  @IsArray()
  @ApiProperty({
    example: 'radio 1',
    description: 'Nombre de la radio',
  })
  languages: string[];

}
