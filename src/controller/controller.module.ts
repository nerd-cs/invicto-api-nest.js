import { Module } from '@nestjs/common';
import { ControllerService } from './controller.service';
import { ControllerController } from './controller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Controller } from './controller.model';

@Module({
  imports: [TypeOrmModule.forFeature([Controller])],
  controllers: [ControllerController],
  providers: [ControllerService],
})
export class ControllerModule {}
