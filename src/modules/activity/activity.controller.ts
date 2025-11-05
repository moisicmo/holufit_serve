import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { checkAbilities, CurrentUser } from '@/decorator';
import { TypeAction } from '@prisma/client';
import { TypeSubject } from '@/common';
import { JwtPayload } from '../auth/entities/jwt-payload.interface';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @checkAbilities({ action: TypeAction.crear, subject: TypeSubject.branch })
  create(@CurrentUser() user: JwtPayload,@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(user.email,createActivityDto);
  }

  @Get()
  findAll() {
    return this.activityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activityService.update(+id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.remove(+id);
  }
}
