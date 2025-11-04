import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProgressStatus } from "@prisma/client";
import { IsEnum, IsNumber } from "class-validator";

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
}
