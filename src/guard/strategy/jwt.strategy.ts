import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { envs } from '@/config';
import { JwtPayload } from '@/modules/auth/entities/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.jwtSecret,
      ignoreExpiration: true, // ⚠️ manejamos expiración manualmente
      passReqToCallback: true, // 👈 esto es la clave
    });
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    try {
      // 📦 obtenemos el token directamente del header
      const authHeader = req.headers['authorization'];
      const token = authHeader?.toString().replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException({
          message: 'Token no proporcionado',
          code: 'TOKEN_MISSING',
          statusCode: 401,
        });
      }

      // 🔍 verificamos manualmente con jsonwebtoken
      jwt.verify(token, envs.jwtSecret, { ignoreExpiration: false });

      // ✅ token válido → devolvemos el payload
      return payload;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: 'Token expirado',
          code: 'TOKEN_EXPIRED',
          statusCode: 401,
        });
      }

      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException({
          message: 'Token inválido',
          code: 'TOKEN_INVALID',
          statusCode: 401,
        });
      }

      throw new UnauthorizedException({
        message: 'Token no autorizado',
        code: 'TOKEN_UNAUTHORIZED',
        statusCode: 401,
      });
    }
  }
}
