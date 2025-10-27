import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { provider, email, ...rest } = createUserDto;

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

      return user;

    } catch (error) {
      console.error('❌ Error en UserService.create():', error);

      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Hubo un error al crear el usuario');
    }
  }


  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
