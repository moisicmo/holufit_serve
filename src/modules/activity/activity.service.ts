import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
      const { activityId, status, date } = createActivityDto;

      // 🔹 Convertir la fecha enviada desde el cliente (ISO local → Date)
      const targetDate = new Date(date);

      // 🔹 Calcular el inicio y fin del día de esa fecha (00:00 a 23:59:59)
      const startOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        0, 0, 0, 0,
      );
      const endOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        23, 59, 59, 999,
      );

      // 🔹 Buscar si ya existe progreso para este activityId en ese día
      const existing = await this.prisma.activityProgress.findFirst({
        where: {
          activityId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      // 🔹 Si existe, actualizar el status
      if (existing) {
        const updated = await this.prisma.activityProgress.update({
          where: { id: existing.id },
          data: { status },
        });

        return {
          message: 'Progreso actualizado correctamente',
          data: updated,
        };
      }

      // 🔹 Si no existe, crear nuevo registro
      const activityProgress = await this.prisma.activityProgress.create({
        data: {
          activityId,
          status,
        },
      });

      return {
        message: 'Progreso registrado correctamente',
        data: activityProgress,
      };

    } catch (error) {
      console.error('❌ Error en activityProgress.create():', error);

      throw new InternalServerErrorException('Hubo un error al registrar el progreso de la actividad');
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
