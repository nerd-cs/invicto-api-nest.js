import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.model';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
})
export class CompanyModule {}
