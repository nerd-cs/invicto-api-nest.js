import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoorModule } from '../door/door.module';
import { LocationModule } from '../location/location.module';
import { ZoneController } from './zone.controller';
import { Zone } from './zone.model';
import { ZoneService } from './zone.service';

@Module({
  imports: [TypeOrmModule.forFeature([Zone]), LocationModule, DoorModule],
  controllers: [ZoneController],
  providers: [ZoneService],
})
export class ZoneModule {}
