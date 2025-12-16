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

    // Fecha enviada por el frontend (día local)
    const inputDate = new Date(date);

    // Normalizar al inicio del día (LOCAL)
    const progressDate = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate(),
      0, 0, 0, 0,
    );

    // 🔎 Buscar progreso del día
    const existing = await this.prisma.activityProgress.findFirst({
      where: {
        activityId,
        progressDate,
      },
    });

    // 🔁 Si existe → actualizar
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

    // ✅ Si no existe → crear
    const activityProgress = await this.prisma.activityProgress.create({
      data: {
        activityId,
        status,
        progressDate,
      },
    });

    return {
      message: 'Progreso registrado correctamente',
      data: activityProgress,
    };
  } catch (error) {
    console.error('❌ Error en activityProgress.create():', error);
    throw new InternalServerErrorException(
      'Hubo un error al registrar el progreso de la actividad',
    );
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
