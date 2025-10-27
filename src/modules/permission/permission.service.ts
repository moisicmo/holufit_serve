import { PaginationDto, PaginationResult } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PermissionSelect, PermissionType } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ConditionOperator, Prisma } from '@prisma/client';
import { UpdatePermissionDto } from './dto/update-permission.dto';
@Injectable()
export class PermissionService {

  constructor(private readonly prisma: PrismaService) { }

  async create(email: string, createPermissionDto: CreatePermissionDto) {
    try {
      const { action, subject, reason, conditions } = createPermissionDto;

      const permission = await this.prisma.permission.create({
        data: {
          action,
          subject,
          reason: reason ?? null,
          createdBy: email,
        },
      });

      if (conditions && conditions.length > 0) {
        await this.prisma.condition.createMany({
          data: conditions.map((cond) => ({
            permissionId: permission.id,
            field: cond.field,
            operator: cond.operator,
            value: cond.value,
            createdBy: email,
          })),
        });
      }

      const fullPermission = await this.prisma.permission.findUnique({
        where: { id: permission.id },
        select: PermissionSelect,
      });

      return fullPermission;
    } catch (error) {
      console.error('❌ Error en create(Permission):', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Hubo un error al crear el permiso');
    }
  }



  async findAll(paginationDto: PaginationDto): Promise<PaginationResult<PermissionType>> {
    try {
      const { page = 1, limit = 10, keys = '' } = paginationDto;


      // 🔹 Armamos el filtro principal
      const whereClause: Prisma.PermissionWhereInput = {
        active: true,
        OR: [
          { reason: { contains: keys, mode: Prisma.QueryMode.insensitive } },
        ],
      };

      const total = await this.prisma.permission.count({ where: whereClause });
      const lastPage = Math.ceil(total / limit);

      const data = await this.prisma.permission.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: 'asc' },
        select: PermissionSelect,
      });

      return { data, meta: { total, page, lastPage } };
    } catch (error) {
      console.error('❌ Error en findAll(Permission):', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Hubo un error al listar permisos');
    }
  }


  async findOne(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      select: PermissionSelect,
    });

    if (!permission) {
      throw new NotFoundException(`Permission with id #${id} not found`);
    }

    return permission;
  }

  async update(id: number, dto: UpdatePermissionDto) {
    try {
      const { action, subject, reason, conditions } = dto;

      const existing = await this.prisma.permission.findUnique({
        where: { id },
        include: { conditions: true },
      });

      if (!existing)
        throw new NotFoundException('El permiso especificado no existe');

      await this.prisma.permission.update({
        where: { id },
        data: {
          action,
          subject,
          reason: reason ?? existing.reason,
        },
      });

      if (Array.isArray(conditions)) {
        // Eliminar condiciones anteriores
        await this.prisma.condition.deleteMany({ where: { permissionId: id } });

        // Crear nuevas (solo si son válidas)
        const validConditions = conditions.filter(
          (c): c is { field: string; operator: ConditionOperator; value: string } =>
            !!c.field && !!c.operator && !!c.value,
        );

        if (validConditions.length > 0) {
          await this.prisma.condition.createMany({
            data: validConditions.map((cond) => ({
              permissionId: id,
              field: cond.field,
              operator: cond.operator,
              value: cond.value,
              createdBy: existing.createdBy,
            })),
          });
        }
      }


      return this.prisma.permission.findUnique({
        where: { id },
        include: { conditions: true },
      });
    } catch (error) {
      console.error('❌ Error en PermissionService.update():', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error al actualizar el permiso',
      );
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.permission.update({
      where: { id },
      data: {
        active: false,
      },
      select: PermissionSelect,
    });
  }

}
