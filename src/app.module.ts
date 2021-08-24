import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { AppController } from './app.controller';
import { AccessGroupModule } from './access-group/access-group.module';
import { LocationModule } from './location/location.module';
import { CompanyModule } from './company/company.module';
import { CardModule } from './card/card.module';
import { ZoneModule } from './zone/zone.module';
import { DoorModule } from './door/door.module';
import { HolidayModule } from './holiday/holiday.module';
import { ScheduleModule } from './schedule/schedule.module';
import { TimetableModule } from './timetable/timetable.module';
import { ScheduleHolidayModule } from './schedule-holiday/schedule-holiday.module';
import { AccessGroupScheduleZoneModule } from './access-group-schedule-zone/access-group-schedule-zone.module';
import { ControllerModule } from './controller/controller.module';
import { MailModule } from './mail/mail.module';
import { TokenModule } from './token/token.module';
import { AccountModule } from './account/account.module';
import { UserAccessGroupModule } from './user-access-group/user-access-group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        `postgres://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      autoLoadEntities: true,
      ssl:
        process.env.DB_SSL_ON === 'true'
          ? { rejectUnauthorized: false }
          : false,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    AccessGroupModule,
    LocationModule,
    CompanyModule,
    CardModule,
    ZoneModule,
    DoorModule,
    HolidayModule,
    ScheduleModule,
    TimetableModule,
    ScheduleHolidayModule,
    AccessGroupScheduleZoneModule,
    ControllerModule,
    MailModule,
    TokenModule,
    AccountModule,
    UserAccessGroupModule,
  ],
  controllers: [AuthController, UsersController, AppController],
  providers: [],
})
export class AppModule {}
