import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './location.model';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
