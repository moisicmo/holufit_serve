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
      const { habitId, status, date } = createHabitDto;

      // 🔹 Convertir la fecha enviada por el frontend (día local del usuario)
      const targetDate = new Date(date);

      // 🔹 Calcular el inicio y fin del día (00:00 a 23:59:59)
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

      // 🔹 Buscar si ya existe un progreso para este hábito en esa fecha
      const existing = await this.prisma.habitProgress.findFirst({
        where: {
          habitId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      // 🔹 Si ya existe, no permitir otro registro
      if (existing) {
        throw new BadRequestException('Ya existe un registro de progreso para este hábito hoy.');
      }

      // 🔹 Si no existe, crear un nuevo registro
      const habitProgress = await this.prisma.habitProgress.create({
        data: {
          habitId,
          status,
          createdBy: email,
        },
      });

      return {
        message: 'Progreso del hábito registrado correctamente',
        data: habitProgress,
      };

    } catch (error) {
      console.error('❌ Error en habitProgress.create():', error);

      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Hubo un error al registrar el progreso del hábito');
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
