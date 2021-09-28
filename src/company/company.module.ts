import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.model';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { UsersModule } from '../users/users.module';
import { DepartmentModule } from '../department/department.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), UsersModule, DepartmentModule],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
