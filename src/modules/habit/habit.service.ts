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

      // Fecha enviada por el frontend (día local)
      const inputDate = new Date(date);

      // Normalizar al inicio del día (LOCAL)
      const progressDate = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate(),
        0, 0, 0, 0,
      );

      // 🔎 Buscar duplicado por día lógico
      const existing = await this.prisma.habitProgress.findFirst({
        where: {
          habitId,
          progressDate,
        },
      });

      if (existing) {
        throw new BadRequestException(
          'Ya existe un registro de progreso para este hábito hoy.',
        );
      }

      // ✅ Crear progreso
      const habitProgress = await this.prisma.habitProgress.create({
        data: {
          habitId,
          status,
          progressDate,
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
      throw new InternalServerErrorException(
        'Hubo un error al registrar el progreso del hábito',
      );
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
