import { ApiPropertyOptional } from "@nestjs/swagger";
import { ConditionOperator } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateConditionDto {

  @ApiPropertyOptional({
    description: 'Campo a comparar (por ejemplo "branchId" o "hour")',
    example: 'hour',
  })
  @IsString()
  field: string;

  @ApiPropertyOptional({
    description: 'Operador de comparación',
    example: 'between',
    enum: ConditionOperator,
  })
  @IsEnum(ConditionOperator)
  operator: ConditionOperator;

  @ApiPropertyOptional({
    description: 'Valor esperado (string, número o JSON string)',
    example: '[8,20]',
  })

  @IsOptional()
  id?: number;

  @IsOptional()
  permissionId?: number;

  @IsString()
  value: string;
  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  createdById?: string;
}