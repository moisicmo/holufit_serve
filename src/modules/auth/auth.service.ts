import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RequestInfo } from '@/decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './entities/jwt-payload.interface';
import { CreateRefreshDto } from './dto/create-refresh.dto';
import { randomUUID } from 'crypto';
import { ValidatePinDto } from './dto/validate-pin.dto';
import { AuthProviderType } from '@prisma/client';
import { GoogleAuthService } from '@/common/google/auth/google.auth.service';
import { UserEntity, UserSelect } from '@/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly googleAuth: GoogleAuthService,
  ) { }

  signJWT(payload: JwtPayload, expiresIn?: string | number) {
    if (expiresIn) {
      return this.jwtService.sign(payload, {
        expiresIn: expiresIn as any,
      });
    }
    return this.jwtService.sign(payload);
  }

  async login(createAuthDto: CreateAuthDto, requestInfo: RequestInfo) {
    const { provider } = createAuthDto;
    console.log(provider);
    try {
      switch (provider) {
        case AuthProviderType.email:
          return await this.authLogin(createAuthDto, requestInfo);
        case AuthProviderType.google:
          return await this.authGoogle(createAuthDto, requestInfo);
        default:
          throw new BadRequestException('Proveedor no soportado');
      }
    } catch (error) {
      console.error('❌ login error:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Error interno en el servicio de autenticación',
      );
    }
  }


  private async authLogin(createAuthDto: CreateAuthDto, requestInfo: RequestInfo) {
    const { email, password } = createAuthDto;
    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son requeridos');
    }
    const user = await this.prisma.user.findFirst({
      where: {
        authProviders: { some: { email } },
      },
      select: {
        ...UserSelect,
        password: true,
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Contraseña incorrecta');
    return await this.generateSession(user, user.authProviders[0].email!, requestInfo);
  }

  private async authGoogle(createAuthDto: CreateAuthDto, requestInfo: RequestInfo) {
    const { idToken } = createAuthDto;
    if (!idToken) throw new BadRequestException('Falta el idToken de Google');
    const googleUser = await this.googleAuth.verifyToken(idToken);
    console.log(googleUser)
    const { email } = googleUser;
    const user = await this.prisma.user.findFirst({
      where: {
        authProviders: { some: { email } },
      },
      select: UserSelect,
    });
    console.log(user);
    if (!user) throw new NotFoundException({
      message:'Usuario no encontrado',
      googleUser
    });
    return await this.generateSession(user, email!, requestInfo);
  }
  private async generateSession(
    user: UserEntity,
    email: string,
    requestInfo: RequestInfo) {
    const { userAgent, ipAddress } = requestInfo;
    const tokenPayload = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email,
      jti: randomUUID(),
    };

    const token = this.signJWT(tokenPayload);
    const refreshToken = this.signJWT(tokenPayload, '1d');

    await this.prisma.authSession.create({
      data: {
        userId: user.id,
        accessToken: token,
        refreshToken,
        userAgent,
        ipAddress,
      },
    });

    return {
      ...tokenPayload,
      token,
      refreshToken,
    };
  }


  async refreshToken(createRefreshDto: CreateRefreshDto, requestInfo: RequestInfo) {
    const { refreshToken } = createRefreshDto;
    const { ipAddress, userAgent } = requestInfo;

    try {
      const payload = this.jwtService.verify(refreshToken);
      const session = await this.prisma.authSession.findUnique({
        where: { refreshToken: refreshToken },
      });
      if (!session || !session.active) {
        throw new UnauthorizedException('Sesión no válida o ya revocada');
      }
      await this.prisma.authSession.update({
        where: { id: session.id },
        data: {
          active: false,
          revokedAt: new Date(),
        },
      });
      const { exp: _, iat: __, nbf: ___, ...cleanPayload } = payload;
      const newAccessToken = this.signJWT(cleanPayload);
      const newRefreshToken = this.signJWT(cleanPayload, '1d');
      await this.prisma.authSession.create({
        data: {
          userId: cleanPayload.id,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          userAgent,
          ipAddress,
          active: true,
        },
      });
      return {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error('refreshToken error:', error);
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }


  async sendPinEmail(idUser: string) {
    // try {
    //   const user = await this.prisma.user.findUnique({
    //     where: { id: idUser },
    //     select: { email: true },
    //   });

    //   if (!user?.email) {
    //     throw new BadRequestException('El usuario no tiene correo registrado');
    //   }
    //   const pin = Math.floor(100000 + Math.random() * 900000).toString();

    //   const salt = bcrypt.genSaltSync(10);
    //   const hashedPin = bcrypt.hashSync(pin, salt);
    //   await this.prisma.user.update({
    //     where: { id: idUser },
    //     data: { codeValidation: hashedPin },
    //   });

    //   // Enviar correo
    //   const htmlMessage = `
    //     <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    //       <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    //         <div style="background:#f2f2f2; padding:20px; text-align:center;">
    //           <img src="cid:logo" alt="Logo" style="height:50px;"/>
    //         </div>
    //         <div style="padding:30px; text-align:center;">
    //           <h2 style="color:#333;">Tu PIN de verificación</h2>
    //           <p style="font-size:16px; color:#555;">Hola, este es tu código de verificación:</p>
    //           <p style="font-size:32px; font-weight:bold; letter-spacing:4px; color:#004aad; margin:20px 0;">
    //             ${pin}s
    //           </p>
    //           <p style="font-size:14px; color:#888;">Si no solicitaste este código, ignora este mensaje.</p>
    //         </div>
    //         <div style="background:#f1f1f1; padding:10px; text-align:center; font-size:12px; color:#666;">
    //           © 2025 HoluFit. Todos los derechos reservados.
    //         </div>
    //       </div>
    //     </div>
    //   `;

    //   await this.gmailService.sendEmail(
    //     user.email,
    //     'Tu PIN de verificación',
    //     htmlMessage,
    //   );

    //   return { success: true, message: 'PIN enviado al correo' };
    //   // ⚠️ quita el pin de la respuesta si no quieres exponerlo
    // } catch (error) {
    //   console.error('sendPinEmail error:', error);
    //   throw new BadRequestException('No se pudo enviar el PIN');
    // }
  }

  async validationPin(validatePinDto: ValidatePinDto) {
    // try {
    //   console.log(validatePinDto);
    //   const { idUser, pin, newPassword } = validatePinDto;

    //   const user = await this.prisma.user.findUnique({
    //     where: { id: idUser },
    //     select: { email: true, codeValidation: true, },
    //   });

    //   if (!user?.email && !user?.codeValidation) {
    //     throw new BadRequestException('El usuario no tiene correo registrado o pin solicitado');
    //   }

    //   const isPinValid = bcrypt.compareSync(pin, user.codeValidation!);
    //   if (!isPinValid) {
    //     throw new UnauthorizedException('El PIN no coinside, revisa tu correo');
    //   }
    //   const salt = bcrypt.genSaltSync(10);
    //   const hashedPassword = bcrypt.hashSync(newPassword, salt);
    //   await this.prisma.user.update({
    //     where: { id: idUser },
    //     data: {
    //       emailValidated: true,
    //       password: hashedPassword,
    //     },
    //   });

    //   return { success: true, message: 'Cuenta valida' };

    // } catch (error) {
    //   console.error('validationPin error:', error);
    //   throw new BadRequestException('No se pudo validar el PIN');
    // }
  }


}
