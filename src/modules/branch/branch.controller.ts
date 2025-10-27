import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PaginationDto, TypeSubject } from '@/common';
import { checkAbilities, CurrentUser } from '@/decorator';
import { TypeAction } from "@prisma/client";
import { JwtPayload } from '@/modules/auth/entities/jwt-payload.interface';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) { }

  @Post()
  @checkAbilities({ action: TypeAction.crear, subject: TypeSubject.branch })
  create(@CurrentUser() user: JwtPayload, @Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(user.email, createBranchDto);
  }

  @Get()
  @checkAbilities({ action: TypeAction.leer, subject: TypeSubject.branch })
  findAll(  @Query() paginationDto: PaginationDto ) {
    return this.branchService.findAll(paginationDto);
  }

  @Get(':id')
  @checkAbilities({ action: TypeAction.leer, subject: TypeSubject.branch })
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(+id);
  }

  @Patch(':id')
  @checkAbilities({ action: TypeAction.editar, subject: TypeSubject.branch })
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(+id, updateBranchDto);
  }

  @Delete(':id')
  @checkAbilities({ action: TypeAction.eliminar, subject: TypeSubject.branch })
  remove(@Param('id') id: string) {
    return this.branchService.remove(+id);
  }
}

