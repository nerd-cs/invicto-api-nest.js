import { Module } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { HolidayController } from './holiday.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './holiday.model';
import { IsBeforeOrEqualConstraint } from '../validation/before-or-equal.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday])],
  controllers: [HolidayController],
  providers: [HolidayService, IsBeforeOrEqualConstraint],
  exports: [HolidayService],
})
export class HolidayModule {}
