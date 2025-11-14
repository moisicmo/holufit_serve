import { Controller, Get } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { Public } from '@/decorator';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) { }
 
  @Public()
  @Get()
  findAll() {
    return this.animalsService.findAll();
  }

}
