import { TypeSubject } from "@/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TypeAction } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateConditionDto } from "./create-condition.dto";

export class CreatePermissionDto {

  @IsEnum(TypeAction)
  @ApiProperty({
    enum: TypeAction,
    example: TypeAction.crear,
    description: 'Acción que representa el permiso',
  })
  action: TypeAction;

  @IsString()
  @ApiProperty({
    example: TypeSubject.all,
    description: 'Entidad o recurso al que aplica el permiso',
  })
  subject: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Razón por la cual se asigna este permiso',
    example: 'Acceso restringido por rol de supervisor',
  })
  reason?: string | null;

  @ApiPropertyOptional({
    description: 'Condiciones opcionales del permiso (lista)',
    type: [CreateConditionDto],
    example: [
      { field: 'hour', operator: 'between', value: '[8,20]' },
      { field: 'id', operator: 'in', value: '{{branchIds}}' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConditionDto)
  conditions?: CreateConditionDto[];
}


