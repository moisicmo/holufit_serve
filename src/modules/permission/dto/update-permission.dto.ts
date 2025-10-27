import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Identificador del permiso',
    example: 1,
  })
  id?: number;
}
