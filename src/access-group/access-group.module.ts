import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessGroup } from './access-group.model';
import { AccessGroupService } from './access-group.service';
import { AccessGroupController } from './access-group.controller';
import { LocationModule } from '../location/location.module';
import { ZoneModule } from '../zone/zone.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { UserAccessGroupModule } from '../user-access-group/user-access-group.module';
import { AccessGroupScheduleZoneModule } from '../access-group-schedule-zone/access-group-schedule-zone.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessGroup]),
    LocationModule,
    ZoneModule,
    ScheduleModule,
    UserAccessGroupModule,
    AccessGroupScheduleZoneModule,
  ],
  providers: [AccessGroupService],
  exports: [AccessGroupService],
  controllers: [AccessGroupController],
})
export class AccessGroupModule {}
