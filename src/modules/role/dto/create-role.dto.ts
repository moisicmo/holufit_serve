import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateRoleDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Identificador del tenant',
  })
  tenantId: number;

  @IsString()
  @ApiProperty({
    example: 'admin',
    description: 'Nombre del rol',
  })
  name: string;

  @IsArray()
  @ApiProperty({
    example: [1, 2],
    description: 'Lista de Identificadores de permisos',
  })
  permissionIds: number[];

}
