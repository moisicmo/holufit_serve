import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ActivityService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(email: string, createActivityDto: CreateActivityDto) {
    try {
      const { activityId, status } = createActivityDto;

      // Obtener la fecha de hoy a las 00:00 para comparar solo por día
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Buscar si ya existe progreso para este activityId hoy
      const existing = await this.prisma.activityProgress.findFirst({
        where: {
          activityId,
          createdAt: {
            gte: startOfDay,
            lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      if (existing) {
        throw new BadRequestException('Ya existe un registro de progreso para esta actividad hoy.');
      }

      const activityProgress = await this.prisma.activityProgress.create({
        data: {
          activityId,
          status,
        },
      });

      return activityProgress;

    } catch (error) {
      console.error('❌ Error en activityProgress.create():', error);

      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Hubo un error al crear el progreso de la actrividad');
    }
  }


  findAll() {
    return `This action returns all activity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activity`;
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
