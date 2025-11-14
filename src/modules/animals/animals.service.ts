import { Injectable } from '@nestjs/common';
import { readdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AnimalsService {
  findAll(): string[] {
    const animalsDir = join(__dirname, '..', '..', 'public', 'animals');
    const baseUrl = 'https://holufitserve-production.up.railway.app/static/animals';

    const files = readdirSync(animalsDir);

    // Opcional: filtrar solo imágenes .png o .jpg
    const images = files.filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.webp'));

    return images.map(file => `${baseUrl}/${file}`);
  }
}
