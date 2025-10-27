import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAddressDto {

  @IsString()
  @ApiProperty({
    example: 'La Paz',
    description: 'Nombre de la ciudad',
  })
  city: string;

  @IsString()
  @ApiProperty({
    example: 'Zona Norte',
    description: 'Zona',
  })
  zone: string;

  @IsString()
  @ApiProperty({
    example: 'Calle Falsa 123',
    description: 'Dirección',
  })
  detail: string;

}
