import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/roles.model';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RolesModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
