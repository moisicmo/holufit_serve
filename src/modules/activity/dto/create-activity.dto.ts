import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProgressStatus } from "@prisma/client";
import { IsEnum, IsNumber } from "class-validator";

export class CreateActivityDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Identificador de la actividad',
  })
  activityId: number;

  @ApiPropertyOptional({
    description: 'estado de la actividad diaria',
    example: ProgressStatus.done,
    enum: ProgressStatus,
  })
  @IsEnum(ProgressStatus)
  status: ProgressStatus;
}
