import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { HabitType } from '@prisma/client';
import { UserSelect } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { provider, email, height, weight, habits, doMore, doLess, activities, ...rest } = createUserDto;

    const normalizedEmail = email.toLowerCase();

    try {
      const userExists = await this.prisma.user.findFirst({
        where: {
          numberDocument: rest.numberDocument,
          authProviders: {
            some: {
              email: normalizedEmail,
              provider,
            }
          }
        }
      });

      if (userExists) {
        throw new BadRequestException('El usuario ya existe');
      }

      const salt = bcrypt.genSaltSync(10);

      const user = await this.prisma.user.create({
        data: {
          ...rest,
          password: bcrypt.hashSync(rest.password, salt),
          createdBy: normalizedEmail,
        },
      });

      await this.prisma.authProvider.create({
        data: {
          userId: user.id,
          provider,
          email: normalizedEmail,
          verified: true,
          createdBy: normalizedEmail,
        }
      });

      await this.prisma.weightRecord.create({
        data: {
          userId: user.id,
          heightCm: height,
          weightKg: weight,
          createdBy: normalizedEmail,
        }
      });


      await this.prisma.userHabit.createMany({
        data: [
          ...habits.map((e) => ({
            userId: user.id,
            title: e,
          })),
          ...doMore.map((e) => ({
            userId: user.id,
            title: e,
            type: HabitType.do_more
          })),
          ...doLess.map((e) => ({
            userId: user.id,
            title: e,
            type: HabitType.do_less
          })),
        ]
      });

      await this.prisma.dailyActivity.createMany({
        data: activities.map((e) => ({
          userId: user.id,
          title: e.title,
          time: e.time,
        })),
      });

      const newUser = await this.findOne(user.id);
      return newUser;

    } catch (error) {
      console.error('❌ Error en UserService.create():', error);

      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Hubo un error al crear el usuario');
    }
  }


  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: UserSelect,
      });

      if (!user) {
        throw new BadRequestException('El usuario no existe');
      }

      return user;

    } catch (error) {
      console.error('❌ Error en UserService.findOne():', error);

      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Hubo un error al consultar el usuario');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const {
      email,
      provider,
      height,
      weight,
      habits,
      doMore,
      doLess,
      activities,
      image,
      name,
      lastName,
      numberDocument,
      birthDate,
    } = updateUserDto;

    const normalizedEmail = email?.toLowerCase();

    try {
      const user = await this.findOne(id);
      if (!user) throw new NotFoundException('Usuario no encontrado');

      // Actualizar campos básicos del usuario
      await this.prisma.user.update({
        where: { id },
        data: {
          ...(image !== undefined && { image: image }),
          ...(name !== undefined && { name: name }),
          ...(lastName !== undefined && { lastName: lastName }),
          ...(numberDocument !== undefined && { numberDocument: numberDocument }),
          ...(birthDate !== undefined && { birthDate: birthDate }),
          ...(birthDate !== undefined && { birthDate: birthDate }),
        },
      });
      // Registrar nuevo proveedor de autenticación
      if (normalizedEmail && provider) {
        await this.prisma.authProvider.create({
          data: {
            userId: id,
            provider,
            email: normalizedEmail,
            createdBy: normalizedEmail,
          },
        });
      }
      // Registrar nuevo peso/talla
      if (normalizedEmail && height && weight) {
        await this.prisma.weightRecord.create({
          data: {
            userId: id,
            heightCm: height,
            weightKg: weight,
            createdBy: normalizedEmail,
          },
        });
      }
      // Actualizar hábitos
      if (habits || doMore || doLess) {
        await this.prisma.userHabit.deleteMany({ where: { userId: id } });
        await this.prisma.userHabit.createMany({
          data: [
            ...(habits ?? []).map((title) => ({ userId: id, title })),
            ...(doMore ?? []).map((title) => ({ userId: id, title, type: 'do_more' })),
            ...(doLess ?? []).map((title) => ({ userId: id, title, type: 'do_less' })),
          ],
        });
      }
      // Actualizar actividades diarias
      if (activities) {
        await this.prisma.dailyActivity.deleteMany({ where: { userId: id } });

        await this.prisma.dailyActivity.createMany({
          data: activities.map((a) => ({
            userId: id,
            title: a.title,
            time: a.time,
          })),
        });
      }

      const userUpdated = await this.findOne(id);
      return userUpdated;
    } catch (error) {
      console.error('❌ Error en UserService.update():', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Hubo un error al actualizar el usuario');
    }
  }



  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
