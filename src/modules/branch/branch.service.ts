import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchSelect, BranchType } from './entities/branch.entity';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationDto, PaginationResult } from '@/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class BranchService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(email: string, createBranchDto: CreateBranchDto) {
    try {
      const { city, zone, detail, ...branchDto } = createBranchDto;

      const address = await this.prisma.address.create({
        data: {
          city,
          zone,
          detail,
          createdBy: email,
        }
      });

      return await this.prisma.branch.create({
        data: {
          ...branchDto,
          addressId: address.id,
          createdBy: email,
        },
        select: BranchSelect,
      });

    } catch (error) {
      console.log(error);
      throw new Error(`No se pudo crear la sucursal: ${error.message}`);
    }
  }

  async findAll( paginationDto: PaginationDto ): Promise<PaginationResult<BranchType>> {
    try {
      const { page = 1, limit = 10, keys = '' } = paginationDto;

      // 🔹 Armar el filtro final para Prisma
      const whereClause: Prisma.BranchWhereInput = {
        ...(keys ? { name: { contains: keys, mode: Prisma.QueryMode.insensitive } } : {}),
      };

      // 🔹 Paginación
      const total = await this.prisma.branch.count({ where: whereClause });
      const lastPage = Math.ceil(total / limit);

      // 🔹 Consulta final con selección de campos
      const data = await this.prisma.branch.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: 'asc' },
        select: BranchSelect,
      });

      // 🔹 Retornar la respuesta formateada
      return {
        data,
        meta: { total, page, lastPage },
      };
    } catch (error) {
      console.error('❌ Error en findAll(Branch):', error);
      // Manejo de errores personalizado
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Hubo un error al listar las sucursales');
    }
  }



  async findOne(id: number) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      select: BranchSelect,
    });

    if (!branch) {
      throw new NotFoundException(`Branch with id #${id} not found`);
    }

    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    const { city, zone, detail, ...rest } = updateBranchDto;
    await this.findOne(id);

    const data: any = {
      ...rest,
      address: {
        update: {
          ...(city !== undefined && { city }),
          ...(zone !== undefined && { zone }),
          ...(detail !== undefined && { detail }),
        },
      },
    };

    return this.prisma.branch.update({
      where: { id },
      data,
      select: BranchSelect,
    });
  }


  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.branch.update({
      where: { id },
      data: { active: false },
      select: BranchSelect,
    });
  }
}
