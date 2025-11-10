import { envs } from '@/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private readonly client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client();
  }

  /**
   * Verifica el idToken recibido desde Flutter
   * y retorna los datos del usuario autenticado por Google.
   */
  async verifyToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: [
          envs.googleClientId,
          envs.googleClientIdIos,
          envs.googleClientIdAndroid,
        ].filter(Boolean),
      });
      console.log('ticket',ticket);

      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Token inválido');

      const { sub, email, name, picture } = payload;

      return {
        provider: 'google',
        providerId: sub,
        email,
        name,
        photo: picture,
      };
    } catch (error) {
      console.error('Error verificando token de Google:', error);
      throw new UnauthorizedException('Error verificando token de Google');
    }
  }
}
