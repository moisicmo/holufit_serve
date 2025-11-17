import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RadioService } from './radio.service';
import { CreateRadioDto } from './dto/create-radio.dto';
import { UpdateRadioDto } from './dto/update-radio.dto';
import { checkAbilities, CurrentUser } from '@/decorator';
import { TypeAction } from '@prisma/client';
import { PaginationDto, TypeSubject } from '@/common';
import { JwtPayload } from '../auth/entities/jwt-payload.interface';

@Controller('radio')
export class RadioController {
  constructor(private readonly radioService: RadioService) { }

  @Post()
  @checkAbilities({ action: TypeAction.crear, subject: TypeSubject.radio })
  create(@CurrentUser() user: JwtPayload, @Body() createRadioDto: CreateRadioDto) {
    return this.radioService.create(user.email, createRadioDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.radioService.findAll(paginationDto);
  }

  @Get()
  findAllCategories(@Query() paginationDto: PaginationDto) {
    return this.radioService.findAllCategories(paginationDto);
  }

  @Get(':id')
  @checkAbilities({ action: TypeAction.leer, subject: TypeSubject.radio })
  findOne(@Param('id') id: string) {
    return this.radioService.findOne(+id);
  }

  @Patch(':id')
  @checkAbilities({ action: TypeAction.editar, subject: TypeSubject.radio })
  update(@Param('id') id: string, @Body() updateRadioDto: UpdateRadioDto) {
    return this.radioService.update(+id, updateRadioDto);
  }

  @Delete(':id')
  @checkAbilities({ action: TypeAction.eliminar, subject: TypeSubject.radio })
  remove(@Param('id') id: string) {
    return this.radioService.remove(+id);
  }
}
