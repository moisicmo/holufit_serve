import { envs } from '@/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { createPublicKey } from 'crypto';

@Injectable()
export class FacebookAuthService {

  private fbJwksUrl = 'https://www.facebook.com/.well-known/oauth/openid/jwks/';

  async verifyToken(idToken: string) {
    try {
      console.log("ID Token recibido:", idToken);

      // 1. Obtener las claves públicas de Facebook
      const { data } = await axios.get(this.fbJwksUrl);
      const jwks = data.keys;

      // 2. Decodificar header
      const decodedHeader: any = jwt.decode(idToken, { complete: true });

      if (!decodedHeader?.header?.kid) {
        throw new UnauthorizedException('ID Token inválido (sin kid).');
      }

      const kid = decodedHeader.header.kid;

      // 3. Buscar clave JWK que coincide
      const jwk = jwks.find((key: any) => key.kid === kid);

      if (!jwk) {
        throw new UnauthorizedException('No se encontró clave para validar el token.');
      }

      // 4. Convertir JWK → clave pública PEM usando crypto nativo
      const publicKey = createPublicKey({ format: 'jwk', key: jwk });

      // 5. Validar JWT con la clave pública
      const payload: any = jwt.verify(idToken, publicKey.export({ format: 'pem', type: 'spki' }).toString(), {
        algorithms: ['RS256'],
        audience: envs.fbAppId,
        issuer: 'https://www.facebook.com',
      });

      // 6. Retornar datos del usuario
      return {
        provider: 'facebook',
        providerId: payload.sub,
        email: payload.email,
        name: payload.name,
        photo: payload.picture,
      };

    } catch (error) {
      console.error('❌ Error verificando ID Token de Facebook:', error);
      throw new UnauthorizedException('ID Token inválido o expirado.');
    }
  }
}
