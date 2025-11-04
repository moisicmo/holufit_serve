import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class HabitService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(email: string, createHabitDto: CreateHabitDto) {
    try {
      const { habitId, status } = createHabitDto;

      // Obtener la fecha de hoy a las 00:00 para comparar solo por día
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Buscar si ya existe progreso para este habitId hoy
      const existing = await this.prisma.habitProgress.findFirst({
        where: {
          habitId,
          createdAt: {
            gte: startOfDay,
            lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      if (existing) {
        throw new BadRequestException('Ya existe un registro de progreso para este hábito hoy.');
      }

      const habitProgress = await this.prisma.habitProgress.create({
        data: {
          habitId,
          status,
          createdBy: email,
        },
      });

      return habitProgress;

    } catch (error) {
      console.error('❌ Error en habitProgress.create():', error);

      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Hubo un error al crear el progreso del hábito');
    }
  }


  findAll() {
    return `This action returns all habit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} habit`;
  }

  update(id: number, updateHabitDto: UpdateHabitDto) {
    return `This action updates a #${id} habit`;
  }

  remove(id: number) {
    return `This action removes a #${id} habit`;
  }
}
