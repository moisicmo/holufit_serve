import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Identificador del rol',
    example: 1,
  })
  id?: number;
}
