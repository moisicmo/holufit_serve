import { ApiProperty } from "@nestjs/swagger";
import { ProgressStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsNumber } from "class-validator";

export class CreateHabitDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Identificador del hábito',
  })
  habitId: number;

  @IsEnum(ProgressStatus)
  @ApiProperty({
    description: 'Estado del hábito diario',
    example: ProgressStatus.done,
    enum: ProgressStatus,
  })
  status: ProgressStatus;

  @IsDateString()
  @ApiProperty({
    description: 'Fecha local del usuario (YYYY-MM-DD o ISO)',
    example: '2025-12-15',
  })
  date: string;
}

