import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.model';
import { User } from '../users/users.model';

@Module({
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([Role, User])],
  exports: [RolesService],
})
export class RolesModule {}
