import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationDto, PaginationResult } from '@/common';
import { RoleSelect, RoleType } from './entities/role.entity';
import { Prisma } from '@prisma/client';
@Injectable()
export class RoleService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(email: string, createRoleDto: CreateRoleDto) {
    try {
      const { tenantId, name, permissionIds } = createRoleDto;

      const existingRole = await this.prisma.role.findFirst({
        where: { name },
      });

      if (existingRole) {
        throw new BadRequestException(
          `Ya existe un rol con el nombre "${name}"`,
        );
      }

      const role = await this.prisma.role.create({
        data: {
          tenantId,
          name,
          createdBy: email,
          permissions: {
            connect: permissionIds.map((id) => ({ id })),
          }
        },
        select: RoleSelect,
      });

      return role;
    } catch (error) {
      console.error('❌ Error en RoleService.create():', error);

      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Hubo un error al crear el rol');
    }
  }


  async findAll(paginationDto: PaginationDto): Promise<PaginationResult<RoleType>> {
    try {
      const { page = 1, limit = 10, keys = '' } = paginationDto;

      const whereClause: Prisma.RoleWhereInput = {
        active: true,
        OR: [
          { name: { contains: keys, mode: Prisma.QueryMode.insensitive } },
        ],
      };

      const total = await this.prisma.role.count({ where: whereClause });
      const lastPage = Math.ceil(total / limit);

      const data = await this.prisma.role.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: 'asc' },
        select: RoleSelect,
      });

      return { data, meta: { total, page, lastPage } };

    } catch (error) {
      console.error('❌ Error en findAll(Role):', error);

      // Manejo de errores más claro y consistente
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Hubo un error al listar roles');
    }
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with id #${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const { name, permissionIds } = updateRoleDto;

      const existingRole = await this.prisma.role.findUnique({
        where: { id },
        select: RoleSelect,
      });

      if (!existingRole) {
        throw new NotFoundException(`No se encontró el rol con ID "${id}"`);
      }

      if (name && name !== existingRole.name) {
        const duplicate = await this.prisma.role.findFirst({ where: { name } });
        if (duplicate) {
          throw new BadRequestException(
            `Ya existe otro rol con el nombre "${name}"`,
          );
        }
      }

      const updatedRole = await this.prisma.role.update({
        where: { id },
        data: {
          name: name ?? existingRole.name,
          permissions: permissionIds
            ? {
              set: [],
              connect: permissionIds.map((pid) => ({ id: pid })),
            }
            : undefined,
        },
        select: RoleSelect,
      });

      return updatedRole;
    } catch (error) {
      console.error('❌ Error en RoleService.update():', error);

      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Hubo un error al actualizar el rol');
    }
  }







  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.role.update({
      where: { id },
      data: {
        active: false,
      },
      select: RoleSelect,
    });
  }
}
