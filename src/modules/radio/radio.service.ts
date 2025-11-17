import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRadioDto } from './dto/create-radio.dto';
import { UpdateRadioDto } from './dto/update-radio.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationDto, PaginationResult } from '@/common';
import { RadioSelect, RadioType } from './entities/radio.entity';
import { Prisma } from '@prisma/client';
import { RadioCategorySelect, RadioCategoryType } from './entities/radio.category.entity';

@Injectable()
export class RadioService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(email: string, createRadioDto: CreateRadioDto) {
    try {
      // const { name } = createRadioDto;

      const radio = await this.prisma.radio.create({
        data: {
          ...createRadioDto,
          createdBy: email,
        },
        select: RadioSelect,
      });

      return radio;

    } catch (error) {
      console.log(error);
      throw new Error(`No se pudo crear la sucursal: ${error.message}`);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginationResult<RadioType>> {
    try {
      const { page = 1, limit = 10, keys = '' } = paginationDto;
      const whereClause: Prisma.RadioWhereInput = keys
        ? {
          OR: [
            { name: { contains: keys, mode: "insensitive" } },
            { genre: { contains: keys, mode: "insensitive" } },
            { country: { contains: keys, mode: "insensitive" } },

            // 🔍 Buscar en las categorías relacionadas
            {
              category: {
                name: { contains: keys, mode: "insensitive" },
              },
            },
            {
              tags: {
                has: keys.toLowerCase(),
              },
            },
          ],
        }
        : {};

      // 🔹 Paginación
      const total = await this.prisma.radio.count({ where: whereClause });
      const lastPage = Math.ceil(total / limit);

      // 🔹 Consulta final con selección de campos
      const data = await this.prisma.radio.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: 'asc' },
        select: RadioSelect,
      });
      console.log(data)

      // 🔹 Retornar la respuesta formateada
      return {
        data,
        meta: { total, page, lastPage },
      };
    } catch (error) {
      console.error('❌ Error en findAll(Radio):', error);
      // Manejo de errores personalizado
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Hubo un error al listar las radios');
    }
  }

  async findAllCategories(paginationDto: PaginationDto): Promise<PaginationResult<RadioCategoryType>> {
    try {
      const { page = 1, limit = 10, keys = '' } = paginationDto;
      // 🔹 Armar el filtro final para Prisma
      const whereClause: Prisma.RadioCategoryWhereInput = {
        ...(keys ? { name: { contains: keys, mode: Prisma.QueryMode.insensitive } } : {}),
      };

      // 🔹 Paginación
      const total = await this.prisma.radioCategory.count({ where: whereClause });
      const lastPage = Math.ceil(total / limit);

      // 🔹 Consulta final con selección de campos
      const data = await this.prisma.radioCategory.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: 'asc' },
        select: RadioCategorySelect,
      });
      console.log(data)

      // 🔹 Retornar la respuesta formateada
      return {
        data,
        meta: { total, page, lastPage },
      };
    } catch (error) {
      console.error('❌ Error en findAll(RadioCategory):', error);
      // Manejo de errores personalizado
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Hubo un error al listar las radios');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} radio`;
  }

  update(id: number, updateRadioDto: UpdateRadioDto) {
    return `This action updates a #${id} radio`;
  }

  remove(id: number) {
    return `This action removes a #${id} radio`;
  }
}
