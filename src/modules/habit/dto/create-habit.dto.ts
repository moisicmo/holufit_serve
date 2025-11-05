import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProgressStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsNumber } from "class-validator";

export class CreateHabitDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Identificador del habito',
  })
  habitId: number;

  @ApiPropertyOptional({
    description: 'estado del habitó diario',
    example: ProgressStatus.done,
    enum: ProgressStatus,
  })
  @IsEnum(ProgressStatus)
  status: ProgressStatus;

  @ApiPropertyOptional({
    description: 'Fecha local del usuario (día en que se registró el habito)',
    example: '2025-11-04T00:00:00.000',
  })
  @IsDateString()
  date: string;
}
