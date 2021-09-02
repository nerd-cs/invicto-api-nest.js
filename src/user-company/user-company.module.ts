import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCompany } from './user-company.model';
import { UserCompanyService } from './user-company.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserCompany])],
  providers: [UserCompanyService],
  exports: [UserCompanyService],
})
export class UserCompanyModule {}
