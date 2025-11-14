import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/auth.guard';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { BranchModule } from './modules/branch/branch.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PlanModule } from './modules/plan/plan.module';

import { GoogledriveModule } from './common/googledrive/googledrive.module';
import { GmailModule } from './common/gmail/gmail.module';
import { UserModule } from './modules/user/user.module';
import { HabitModule } from './modules/habit/habit.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AnimalsModule } from './modules/animals/animals.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BranchModule,
    PermissionModule,
    RoleModule,
    CloudinaryModule,
    GoogledriveModule,
    GmailModule,
    DashboardModule,
    PlanModule,
    UserModule,
    HabitModule,
    ActivityModule,
    AnimalsModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
