import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { checkAbilities } from '@/decorator';
import { TypeAction } from '@prisma/client';
import { PaginationDto, TypeSubject } from '@/common';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) { }

  @Post()
  @checkAbilities({ action: TypeAction.crear, subject: TypeSubject.tenant })
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }w

  @Get()
  // @checkAbilities({ action: TypeAction.leer, subject: TypeSubject.tenant })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tenantService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantService.update(+id, updateTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantService.remove(+id);
  }
}
