import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HabitService } from './habit.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { checkAbilities, CurrentUser } from '@/decorator';
import { TypeAction } from '@prisma/client';
import { TypeSubject } from '@/common';
import { JwtPayload } from '../auth/entities/jwt-payload.interface';

@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  @checkAbilities({ action: TypeAction.crear, subject: TypeSubject.branch })
  create(@CurrentUser() user: JwtPayload,@Body() createHabitDto: CreateHabitDto) {
    return this.habitService.create(user.email,createHabitDto);
  }

  @Get()
  findAll() {
    return this.habitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.habitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto) {
    return this.habitService.update(+id, updateHabitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.habitService.remove(+id);
  }
}
