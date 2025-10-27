import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PaginationDto, TypeSubject } from '@/common';
import { checkAbilities, CurrentUser } from '@/decorator';
import { TypeAction } from "@prisma/client";
import { JwtPayload } from '../auth/entities/jwt-payload.interface';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  @Post()
  @checkAbilities({ action: TypeAction.crear, subject: TypeSubject.permission })
  create(@CurrentUser() user: JwtPayload, @Body() createRoleDto: CreatePermissionDto) {
    return this.permissionService.create(user.email, createRoleDto);
  }

  @Get()
  @checkAbilities({ action: TypeAction.leer, subject: TypeSubject.permission })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.permissionService.findAll(paginationDto);
  }

  @Get(':id')
  @checkAbilities({ action: TypeAction.leer, subject: TypeSubject.permission })
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  @checkAbilities({ action: TypeAction.editar, subject: TypeSubject.permission })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @checkAbilities({ action: TypeAction.eliminar, subject: TypeSubject.permission })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }

}
