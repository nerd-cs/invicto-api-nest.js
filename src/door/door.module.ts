import { Module } from '@nestjs/common';
import { DoorService } from './door.service';
import { DoorController } from './door.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Door } from './door.model';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [TypeOrmModule.forFeature([Door]), LocationModule],
  providers: [DoorService],
  controllers: [DoorController],
  exports: [DoorService],
})
export class DoorModule {}
