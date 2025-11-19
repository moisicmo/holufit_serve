import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RadioService } from './radio.service';
import { CreateRadioDto } from './dto/create-radio.dto';
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

  @Get('/category')
  findAllCategories(@Query() paginationDto: PaginationDto) {
    return this.radioService.findAllCategories(paginationDto);
  }
}
