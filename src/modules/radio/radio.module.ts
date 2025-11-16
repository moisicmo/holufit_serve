import { Module } from '@nestjs/common';
import { RadioService } from './radio.service';
import { RadioController } from './radio.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [RadioController],
  providers: [RadioService],
  imports: [PrismaModule],
})
export class RadioModule { }
